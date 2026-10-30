// 02 · Buffers: fetch → decodeAudioData → AudioBufferSourceNode por disparo.
const SAMPLES: Record<string, string> = { '1': 'kick', '2': 'snare', '3': 'hat' };
const buffers = new Map<string, AudioBuffer>();
let ctx: AudioContext | null = null;

const $ = (id: string) => document.getElementById(id)!;
const rate = $('rate') as HTMLInputElement, loop = $('loop') as HTMLInputElement, info = $('info');

async function load(name: string): Promise<AudioBuffer> {
  const cached = buffers.get(name); if (cached) return cached;
  const res = await fetch(`./samples/${name}.wav`);
  const buf = await ctx!.decodeAudioData(await res.arrayBuffer());
  buffers.set(name, buf);
  info.textContent = `${name}: ${buf.numberOfChannels} canal(es), ${buf.length} muestras, ${buf.duration.toFixed(3)} s @ ${buf.sampleRate} Hz`;
  return buf;
}

function trigger(buffer: AudioBuffer, when = 0) {
  const src = ctx!.createBufferSource();       // nuevo cada vez
  src.buffer = buffer;
  // Transposición en semitonos: n semitonos ≡ playbackRate = 2^(n/12)
  // (el slider es logarítmico, no lineal: 12 semitonos = octava = velocidad doble)
  src.playbackRate.value = Math.pow(2, +rate.value / 12);
  src.loop = loop.checked;
  if (src.loop) {                              // delimitar el fragmento que se repite
    src.loopStart = 0;     // s
    src.loopEnd = 0.1;     // s: se repiten los primeros 100 ms
  }
  src.connect(ctx!.destination);
  src.start(when);
  if (loop.checked) src.stop(ctx!.currentTime + 2);   // no dejar loops infinitos en la demo
}

$('init').addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();
  await ctx.resume();
  await Promise.all(Object.values(SAMPLES).map(load));   // precarga
  info.textContent += ' · listo: pulsa 1, 2 o 3';
});

window.addEventListener('keydown', async (e) => {
  const name = SAMPLES[e.key];
  if (!name || !ctx) return;
  trigger(await load(name));
});

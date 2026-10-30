// 03 · MediaElementAudioSourceNode y MediaStreamAudioSourceNode.
let ctx: AudioContext | null = null;
const $ = (id: string) => document.getElementById(id)!;
const track = $('track') as HTMLAudioElement;

$('wrap').addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();
  await ctx.resume();
  // createMediaElementSource solo puede llamarse una vez por elemento
  const src = ctx.createMediaElementSource(track);
  const gain = ctx.createGain(); gain.gain.value = 0.8;
  src.connect(gain).connect(ctx.destination);
  ($('wrap') as HTMLButtonElement).disabled = true;
  track.play();
});
// Experimento CORS (restaurar src="./samples/loop.wav" y crossorigin al acabar):
//  1) arrancar npx vite --port 5174 --strictPort en otro terminal
//  2) src="http://localhost:5174/samples/loop.wav" + crossorigin="anonymous" → suena por el grafo
//  3) sin crossorigin → el elemento reproduce, pero el grafo entrega silencio;
//     en la consola (nivel Info): "MediaElementAudioSource outputs zeroes due to
//     CORS access restrictions". La pista queda inutilizable: cambiar src no la recupera.

$('mic').addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();
  await ctx.resume();
  // Restricciones desactivadas: señal sin procesar, adecuada para medición.
  // Cambiar las tres a true (procesado por el navegador) y comparar con la
  // voz: menos ruido y nivel más uniforme, pero con latencia extra.
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const mic = ctx.createMediaStreamSource(stream);
  const gain = ctx.createGain(); gain.gain.value = +($('micGain') as HTMLInputElement).value;
  mic.connect(gain).connect(ctx.destination);
  $('micGain').addEventListener('input', (e) => gain.gain.setTargetAtTime(+(e.target as HTMLInputElement).value, ctx!.currentTime, 0.01));
  ($('mic') as HTMLButtonElement).disabled = true;
});

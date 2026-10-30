// 03 · MediaElementAudioSourceNode y MediaStreamAudioSourceNode.
let ctx: AudioContext | null = null;
const $ = (id: string) => document.getElementById(id)!;
const track = $('track') as HTMLAudioElement;

$('wrap').addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();
  await ctx.resume();
  const src = ctx.createMediaElementSource(track);   // solo puede hacerse una vez por elemento
  const gain = ctx.createGain(); gain.gain.value = 0.8;
  src.connect(gain).connect(ctx.destination);
  ($('wrap') as HTMLButtonElement).disabled = true;
  track.play();
});

$('mic').addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();
  await ctx.resume();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const mic = ctx.createMediaStreamSource(stream);
  const gain = ctx.createGain(); gain.gain.value = +($('micGain') as HTMLInputElement).value;
  mic.connect(gain).connect(ctx.destination);
  $('micGain').addEventListener('input', (e) => gain.gain.setTargetAtTime(+(e.target as HTMLInputElement).value, ctx!.currentTime, 0.01));
  ($('mic') as HTMLButtonElement).disabled = true;
});

// 04 · Secuenciador con planificación adelantada (look-ahead). Punto de partida de la Actividad 2.
const STEPS = 8, LOOKAHEAD = 0.1, INTERVAL = 25;
let ctx: AudioContext | null = null;
let kick: AudioBuffer | null = null;
let running = false, timer = 0, naiveTimer = 0;
let step = 0, nextNoteTime = 0;
const kickPattern = [1, 0, 0, 0, 1, 0, 0, 0];
// TODO 1: const snarePattern = [0, 0, 1, 0, 0, 0, 1, 0];
const queue: { step: number; time: number }[] = [];   // para la UI

const $ = (id: string) => document.getElementById(id)!;
const bpmIn = $('bpm') as HTMLInputElement;
let bpm = +bpmIn.value;
bpmIn.addEventListener('input', () => { bpm = +bpmIn.value; $('bpmv').textContent = bpmIn.value; });

function makeGrid(id: string, pattern: number[]) {
  const grid = $(id);
  pattern.forEach((on, i) => {
    const c = document.createElement('div'); c.className = 'cell' + (on ? ' on' : ''); c.dataset.i = String(i);
    c.addEventListener('click', () => { pattern[i] = pattern[i] ? 0 : 1; c.classList.toggle('on'); });  // cambia en vivo
    grid.appendChild(c);
  });
}
makeGrid('kick', kickPattern);
// TODO 1: makeGrid('snare', snarePattern);

function trigger(buffer: AudioBuffer, time: number) {
  const src = ctx!.createBufferSource(); src.buffer = buffer;
  const g = ctx!.createGain();
  g.gain.setValueAtTime(1, time);
  g.gain.linearRampToValueAtTime(0, time + 0.2);        // sin clics
  src.connect(g).connect(ctx!.destination);
  src.start(time); src.stop(time + 0.2);
}

function playStep(s: number, time: number) {
  if (kickPattern[s]) trigger(kick!, time);
  // TODO 1: if (snarePattern[s]) trigger(snare!, time);
  queue.push({ step: s, time });                          // la UI lo consumirá
}

function scheduler() {
  while (nextNoteTime < ctx!.currentTime + LOOKAHEAD) {
    playStep(step, nextNoteTime);
    nextNoteTime += 60 / bpm / 4;                         // semicorchea
    // TODO 4 (extra): swing → si step es impar, retrasar un % de la semicorchea
    step = (step + 1) % STEPS;
  }
  timer = window.setTimeout(scheduler, INTERVAL);
}

function naive() {                                        // sin look-ahead: setTimeout directo, para oír el jitter
  playStep(step, ctx!.currentTime); step = (step + 1) % STEPS;
  naiveTimer = window.setTimeout(naive, 60000 / bpm / 4);
}

function draw() {
  // TODO 3: consumir la cola y resaltar el paso en curso.
  //   while (queue.length && queue[0].time <= ctx!.currentTime) { highlight(queue.shift()!.step); }
  if (running) requestAnimationFrame(draw);
}

$('toggle').addEventListener('click', async () => {
  if (!ctx) {
    ctx = new AudioContext();
    kick = await ctx.decodeAudioData(await (await fetch('./samples/kick.wav')).arrayBuffer());
    // TODO 1: snare = …
  }
  await ctx.resume();
  running = !running;
  $('toggle').textContent = running ? 'Stop' : 'Start';
  if (running) {
    step = 0; nextNoteTime = ctx.currentTime + 0.05; queue.length = 0;
    if (($('naive') as HTMLInputElement).checked) naive(); else scheduler();
    requestAnimationFrame(draw);
  } else { clearTimeout(timer); clearTimeout(naiveTimer); }
});

// 01 · Oscilador + ganancia. Punto de partida de la Actividad 1.
let ctx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null; // TODO 4: segunda voz desafinada
let gain: GainNode | null = null;

// Prueba de política de autoplay (comprobar y eliminar):
//   const prueba = new AudioContext();
//   console.log('Estado sin gesto:', prueba.state); // 'suspended' hasta que haya un gesto del usuario

const $ = (id: string) => document.getElementById(id)!;
const play = $('play') as HTMLButtonElement;
const stop = $('stop') as HTMLButtonElement;
const state = $('state');
const freq = $('freq') as HTMLInputElement;
const type = $('type') as HTMLSelectElement;

play.addEventListener('click', async () => {
  if (!ctx) ctx = new AudioContext();           // creado dentro del gesto de usuario
  await ctx.resume();
  state.textContent = ctx.state;

  if (!gain) { gain = ctx.createGain(); gain.gain.value = 0.2; gain.connect(ctx.destination); }

  // Nodo fuente nuevo en cada reproducción: un AudioScheduledSourceNode solo
  // admite un start(); reutilizar el parado lanza "cannot call start more than once".
  osc = ctx.createOscillator();
  osc.type = type.value as OscillatorType;
  osc.frequency.value = +freq.value;            // frequency es un AudioParam
  osc.connect(gain);
  osc.start();

  // TODO 4: segunda voz con detune = +8 cents, mezclada en el mismo GainNode.
  // f2 = f1 · 2^(8/1200) ≈ f1 + 2 Hz a 440 Hz → batido lento de ~2 Hz.
  osc2 = ctx.createOscillator();
  osc2.type = osc.type;
  osc2.frequency.value = osc.frequency.value;
  osc2.detune.value = 8;                        // cents
  osc2.connect(gain);
  osc2.start();

  play.disabled = true; stop.disabled = false;
});

stop.addEventListener('click', () => {
  // stop() libera el nodo; se descarta la referencia para poder crear uno nuevo en Tocar.
  osc?.stop(); osc = null;
  osc2?.stop(); osc2 = null;
  play.disabled = false; stop.disabled = true;
});

// Controles activos durante la reproducción (afectan a las dos voces).
freq.addEventListener('input', () => {
  if (osc) osc.frequency.value = +freq.value;
  if (osc2) osc2.frequency.value = +freq.value; // el detune (+8 cents) se mantiene
});

type.addEventListener('change', () => {
  const t = type.value as OscillatorType;
  if (osc) osc.type = t;
  if (osc2) osc2.type = t;
});

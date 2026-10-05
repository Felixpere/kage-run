// Musica y efectos de sonido del pack "Ninja Adventure" (pixel-boy, CC0).
//
// Los navegadores no dejan sonar nada hasta que el usuario interactua, asi que
// la musica arranca en el boton EMPEZAR. El estado de silencio se guarda en
// localStorage.

const A = 'assets/pack/Audio/';
const url = p => A + p.split('/').map(encodeURIComponent).join('/');

const MUSICA = 'Musics/35 - Adventure.ogg';

const SFX = {
  salto:      'Sounds/Jump & Bounce/Jump.wav',
  rebote:     'Sounds/Jump & Bounce/Bounce.wav',
  golpe:      'Sounds/Hit & Impact/Hit2.wav',
  dano:       'Sounds/Hit & Impact/Hit7.wav',
  explosion:  'Sounds/Hit & Impact/Impact3.wav',
  romper:     'Sounds/Hit & Impact/Impact.wav',
  moneda:     'Sounds/Bonus/Coin.wav',
  pergamino:  'Sounds/Bonus/Bonus.wav',
  vida:       'Sounds/Bonus/PowerUp1.wav',
  magia:      'Sounds/Magic & Skill/Magic1.wav',
  tajo:       'Sounds/Whoosh & Slash/Slash.wav',
  invocar:    'Sounds/Magic & Skill/Spirit.wav',
  evolucion:  'Jingles/LevelUp1.wav',
  finPartida: 'Jingles/GameOver.wav',
  victoria:   'Jingles/Success1.wav',
};

let silencio = false;
try { silencio = localStorage.getItem('kage.mute') === '1' } catch { /* modo privado */ }

let musica = null;
const pools = {};          // nombre -> [Audio, Audio, ...] para solapar disparos
const POOL = 3;
let listo = false;

function crearPool(nombre) {
  const lista = [];
  for (let i = 0; i < POOL; i++) {
    const a = new Audio(url(SFX[nombre]));
    a.preload = 'auto';
    a.volume = 0.45;
    lista.push(a);
  }
  pools[nombre] = { lista, i: 0 };
}

export function initAudio() {
  if (listo) return;
  listo = true;
  for (const n of Object.keys(SFX)) crearPool(n);
  musica = new Audio(url(MUSICA));
  musica.loop = true;
  musica.volume = 0.22;
  aplicarSilencio();
}

/** Arranca la musica. Debe llamarse desde un gesto del usuario. */
export function startMusic() {
  initAudio();
  if (silencio || !musica) return;
  musica.play().catch(() => { /* el navegador aun no lo permite */ });
}

export function sfx(nombre) {
  if (silencio || !listo) return;
  const p = pools[nombre];
  if (!p) return;
  const a = p.lista[p.i];
  p.i = (p.i + 1) % p.lista.length;
  try { a.currentTime = 0; a.play().catch(() => {}) } catch { /* ignorar */ }
}

function aplicarSilencio() {
  if (musica) {
    if (silencio) musica.pause();
    else musica.play().catch(() => {});
  }
  const b = document.getElementById('mute');
  if (b) {
    b.textContent = silencio ? '🔇' : '🔊';
    b.setAttribute('aria-pressed', String(silencio));
    b.setAttribute('aria-label', silencio ? 'Activar sonido' : 'Silenciar');
  }
}

export function toggleMute() {
  silencio = !silencio;
  try { localStorage.setItem('kage.mute', silencio ? '1' : '0') } catch { /* ignorar */ }
  aplicarSilencio();
  return silencio;
}

export function isMuted() { return silencio }

/** Conecta el boton de silencio del DOM. */
export function initMuteButton() {
  const b = document.getElementById('mute');
  if (!b) return;
  b.addEventListener('click', e => { e.preventDefault(); initAudio(); toggleMute() });
  aplicarSilencio();
}

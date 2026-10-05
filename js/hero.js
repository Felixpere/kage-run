// Motor de hojas de sprites del heroe.
//
// Formato esperado (CLAUDE.md): celdas de 64x72, una fila por animacion,
// anclaje en los pies a y=64 dentro de la celda. Se escala para que el heroe
// mida ~90 px en pantalla, igual que la caja de colision (P.h = 90).
//
// Si una hoja no existe o no carga, heroReady() devuelve false y render.js
// sigue usando el sprite dibujado en codigo. No se rompe nada.

import { ctx, G } from './state.js';

export const CELL_W = 64, CELL_H = 72, FEET_Y = 64, HERO_H = 90;
export const SCALE = HERO_H / FEET_Y;   // 1.40625

// Orden de filas en la hoja. `frames` es lo esperado; si la hoja real trae
// otra cantidad se detecta contando celdas no vacias y manda la detectada.
export const ANIMS = [
  { key: 'idle',           frames: 4, fps: 8,  loop: true  },
  { key: 'correr',         frames: 8, fps: 10, loop: true  },
  { key: 'sprint',         frames: 6, fps: 18, loop: true  },
  { key: 'saltoSubida',    frames: 2, fps: 16, loop: false },
  { key: 'apice',          frames: 1, fps: 1,  loop: false },
  { key: 'caida',          frames: 2, fps: 16, loop: false },
  { key: 'aterrizaje',     frames: 3, fps: 14, loop: false },
  { key: 'patada',         frames: 4, fps: 16, loop: false },
  { key: 'patadaVoladora', frames: 4, fps: 16, loop: false },
  { key: 'embestida',      frames: 6, fps: 14, loop: false },
  { key: 'carga',          frames: 4, fps: 10, loop: true  },
  { key: 'dano',           frames: 2, fps: 12, loop: false },
];

// Una hoja por forma (0..3) mas la de distraccion.
const sheets = [null, null, null, null];
let distraccion = null;

/** Cuenta celdas con algun pixel visible en cada fila. */
export function analyzeSheet(img) {
  const cols = Math.max(1, Math.floor(img.naturalWidth / CELL_W));
  const rows = Math.max(1, Math.floor(img.naturalHeight / CELL_H));
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0);
  const counts = [];
  for (let r = 0; r < rows; r++) {
    let n = 0;
    for (let col = 0; col < cols; col++) {
      const d = x.getImageData(col * CELL_W, r * CELL_H, CELL_W, CELL_H).data;
      let vacia = true;
      for (let i = 3; i < d.length; i += 4) { if (d[i] > 8) { vacia = false; break } }
      if (vacia) break;          // la fila termina en la primera celda vacia
      n++;
    }
    counts.push(n);
  }
  return { cols, rows, counts };
}

function buildSheet(img) {
  const info = analyzeSheet(img);
  const filas = ANIMS.map((a, i) => ({
    ...a,
    row: i,
    // manda lo detectado; si la fila salio vacia, se queda con lo esperado
    frames: (info.counts[i] > 0 ? info.counts[i] : a.frames),
    presente: i < info.rows && info.counts[i] > 0,
  }));
  const byKey = {};
  for (const f of filas) byKey[f.key] = f;
  return { img, info, filas, byKey, ready: true };
}

function tryLoad(paths) {
  return new Promise(resolve => {
    let i = 0;
    const next = () => {
      if (i >= paths.length) return resolve(null);
      const url = paths[i++];
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth ? img : null);
      img.onerror = next;
      img.src = url;
    };
    next();
  });
}

const rutas = n => [`assets/${n}.png`, `assets/sprites/${n}.png`];

/** Carga las hojas en segundo plano. No bloquea el arranque del juego. */
export async function initHero() {
  for (let f = 0; f < 4; f++) {
    const img = await tryLoad(rutas('kage_f' + (f + 1)));
    if (img) {
      sheets[f] = buildSheet(img);
      console.info(`[hero] kage_f${f + 1} cargada: ` +
        sheets[f].filas.filter(x => x.presente).map(x => `${x.key}=${x.frames}`).join(' '));
    }
  }
  const d = await tryLoad(rutas('kage_distraccion'));
  if (d) distraccion = buildSheet(d);
  if (!sheets.some(Boolean)) {
    console.info('[hero] sin hojas en assets/: se usa el sprite dibujado en codigo ' +
                 '(ver assets/FALTA.md)');
  }
}

/** Hoja a usar segun la forma y el estado; null si hay que usar el fallback. */
export function heroSheet() {
  if (G.sexy > 0 && distraccion) return distraccion;
  return sheets[G.form] || sheets.find(Boolean) || null;
}

export function heroReady() { return heroSheet() !== null }

/** Estado del juego -> nombre de animacion. */
export function heroAnimFor() {
  const P = G.P;
  if (G.sexy > 0) return 'idle';
  if (P.hurtT > 0) return 'dano';
  if (G.charge > 0 || G.charging) return 'carga';
  if (P.rush > 0) return 'embestida';
  if (P.flyKick > 0) return 'patadaVoladora';
  if (P.kick > 0) return 'patada';
  if (!P.ground) {
    if (P.vy < -2) return 'saltoSubida';
    if (P.vy > 2) return 'caida';
    return 'apice';
  }
  if (P.land > 0) return 'aterrizaje';
  const v = Math.abs(P.vx);
  if (v > 6) return 'sprint';
  if (v > 0.5) return 'correr';
  return 'idle';
}

/**
 * Dibuja al heroe desde la hoja. (x, y) es la esquina superior izquierda de la
 * caja de colision; se ancla en los pies (x + w/2, y + 90).
 * Devuelve false si no hay hoja y hay que recurrir al sprite de codigo.
 */
export function drawHero(x, y, face, sxs = 1, sys = 1) {
  const sheet = heroSheet();
  if (!sheet) return false;
  const anim = sheet.byKey[heroAnimFor()] || sheet.byKey.idle;
  const n = Math.max(1, anim.frames);
  const paso = Math.max(1, Math.round(60 / anim.fps));
  let f = Math.floor(G.t / paso);
  f = anim.loop ? f % n : Math.min(n - 1, f % n);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x + 20, y + HERO_H);
  ctx.scale(sxs * (face < 0 ? -1 : 1), sys);
  ctx.drawImage(sheet.img,
    f * CELL_W, anim.row * CELL_H, CELL_W, CELL_H,
    -CELL_W * SCALE / 2, -FEET_Y * SCALE, CELL_W * SCALE, CELL_H * SCALE);
  ctx.restore();
  return true;
}

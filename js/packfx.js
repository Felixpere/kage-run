// Sprites del pack "Ninja Adventure" de pixel-boy (CC0): monstruos y efectos.
// Si una imagen no carga, listo() devuelve false para esa entrada y quien la
// use sigue con el dibujo en codigo.

import { ctx } from './state.js';

const PACK = 'assets/pack/';
function load(ruta) {
  const i = new Image();
  i.src = PACK + ruta.split('/').map(encodeURIComponent).join('/');
  return i;
}
const ok = img => img.complete && img.naturalWidth > 0;

// --- Monstruos: hojas de 64x64 con celdas de 16x16.
// Fila 0 de frente, fila 1 de espaldas, fila 2 de perfil, fila 3 de perfil.
// En un lateral interesa el perfil: fila 2, con volteo horizontal segun rumbo.
export const MON = {
  kappa:   load('actor/monster/KappaGreen/SpriteSheet.png'),
  snake:   load('actor/monster/Snake/Snake.png'),
  bamboo:  load('actor/monster/Bamboo/SpriteSheet.png'),
  lantern: load('actor/monster/LanternRed/SpriteSheet.png'),
};
export const MON_CELL = 16, MON_PERFIL = 2, MON_FRENTE = 0;

export function monListo(nombre) { return ok(MON[nombre]) }

/** Dibuja una celda de monstruo escalada a (w,h). `flip` espeja en horizontal. */
export function drawMon(nombre, x, y, w, h, frame = 0, fila = MON_PERFIL, flip = false) {
  const img = MON[nombre];
  if (!ok(img)) return false;
  const cols = Math.floor(img.naturalWidth / MON_CELL);
  const f = ((frame % cols) + cols) % cols;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (flip) { ctx.translate(x + w, y); ctx.scale(-1, 1); x = 0; y = 0 }
  ctx.drawImage(img, f * MON_CELL, fila * MON_CELL, MON_CELL, MON_CELL, x, y, w, h);
  ctx.restore();
  return true;
}

// --- Efectos de un solo disparo.
export const FXS = {
  humo:      { img: load('FX/Smoke/Smoke/SpriteSheet.png'),         cw: 32, ch: 32, n: 6, fps: 16 },
  explosion: { img: load('FX/Elemental/Explosion/SpriteSheet.png'), cw: 40, ch: 40, n: 9, fps: 18 },
  chispa:    { img: load('FX/Magic/Circle/SpriteSheetSpark.png'),   cw: 32, ch: 32, n: 6, fps: 14 },
};
// Aura: tira de 5 fotogramas de 25x24, se usa en bucle bajo el heroe.
export const AURA = { img: load('FX/Magic/Aura/SpriteSheet.png'), cw: 25, ch: 24, n: 5, fps: 10 };

export function fxListo(kind) { const d = FXS[kind]; return !!d && ok(d.img) }

/** Duracion en fotogramas de juego (60 fps) de un efecto. */
export function fxDuracion(kind) {
  const d = FXS[kind];
  return d ? Math.round(d.n * 60 / d.fps) : 0;
}

/** Dibuja el efecto `e` = {kind, x, y, esc, t}. Centrado en (x, y). */
export function drawFX(e) {
  const d = FXS[e.kind];
  if (!d || !ok(d.img)) return false;
  const paso = Math.max(1, Math.round(60 / d.fps));
  const f = Math.floor(e.t / paso);
  if (f >= d.n) return false;
  const w = d.cw * e.esc, h = d.ch * e.esc;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(d.img, f * d.cw, 0, d.cw, d.ch, e.x - w / 2, e.y - h / 2, w, h);
  ctx.restore();
  return true;
}

/** Aura en bucle a los pies del heroe. */
export function drawAura(x, y, esc, t) {
  if (!ok(AURA.img)) return false;
  const paso = Math.max(1, Math.round(60 / AURA.fps));
  const f = Math.floor(t / paso) % AURA.n;
  const w = AURA.cw * esc, h = AURA.ch * esc;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 0.85;
  ctx.drawImage(AURA.img, f * AURA.cw, 0, AURA.cw, AURA.ch, x - w / 2, y - h, w, h);
  ctx.restore();
  return true;
}

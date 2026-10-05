// Invocacion: el sapo de assets/sapo.png.
//
// La hoja no tiene filas de altura uniforme (la de humo es mas alta), asi que
// se mide con detectSheet() en vez de asumir una rejilla. Si no carga, el
// dibujado vuelve al sapo del pack.

import { ctx } from './state.js';
import { detectSheet } from './sheet.js';

// Filas detectadas en la hoja, por orden:
//   0 reposo · 1 avance · 2 ataque · 3 desaparicion en humo
export const FILA = { reposo: 0, avance: 1, ataque: 2, humo: 3 };

const ALTO_OBJETIVO = 300;   // alto en pantalla de la fila de reposo

let hoja = null;             // { img, cellW, rows, esc }

export function initSummon() {
  const img = new Image();
  img.onload = () => {
    const info = detectSheet(img, { minBanda: 20, minSprite: 20 });
    if (!info.rows.length) { console.info('[sapo] hoja vacia, se usa el del pack'); return }
    hoja = {
      img, cellW: info.cellW, rows: info.rows,
      esc: ALTO_OBJETIVO / info.rows[0].h,
    };
    console.info('[sapo] ' + info.w + 'x' + info.h + ' celda ' + info.cellW + ' px, filas: ' +
      info.rows.map((r, i) => `${i}=${r.n}f/${r.h}px`).join(' ') +
      ' escala x' + hoja.esc.toFixed(2));
  };
  img.onerror = () => console.info('[sapo] assets/sapo.png no encontrado, se usa el del pack');
  img.src = 'assets/sapo.png';
}

export function sapoListo() { return hoja !== null }

/** Fila segun la fase de la invocacion. `fin` activa la desaparicion. */
export function filaPara(stage, fin) {
  if (fin) return FILA.humo;
  if (stage === 0) return FILA.avance;
  if (stage === 1) return FILA.reposo;
  return FILA.ataque;
}

/**
 * Dibuja el sapo con los pies en `suelo`, centrado en `cx`.
 * `t` es el contador de fotogramas del juego. Devuelve false si no hay hoja.
 */
export function drawSapo(cx, suelo, stage, t, fin = false) {
  if (!hoja) return false;
  const i = Math.min(filaPara(stage, fin), hoja.rows.length - 1);
  const fila = hoja.rows[i];
  const paso = stage === 2 ? 5 : 9;
  // la desaparicion no hace bucle: se queda en el ultimo fotograma
  const bruto = Math.floor(t / paso);
  const f = (i === FILA.humo) ? Math.min(fila.n - 1, bruto % (fila.n * 2)) : bruto % fila.n;
  const w = hoja.cellW * hoja.esc, h = fila.h * hoja.esc;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(hoja.img, f * hoja.cellW, fila.y, hoja.cellW, fila.h,
                cx - w / 2, suelo - h, w, h);
  ctx.restore();
  return true;
}

// Deteccion automatica de rejilla en una hoja de sprites.
//
// No asume celdas de tamano fijo: mide donde hay pixeles. Sirve para hojas
// exportadas con margenes, etiquetas de texto y filas de distinta altura.
//
// Devuelve { w, h, cellW, rows: [{ y, h, n }] } donde cada fila trae su propia
// altura y su numero de fotogramas.

/** Tramos [ini, fin] de indices marcados como NO vacios. */
function tramos(vacio, total) {
  const out = [];
  let ini = null;
  for (let i = 0; i < total; i++) {
    if (!vacio[i]) { if (ini === null) ini = i }
    else if (ini !== null) { out.push([ini, i - 1]); ini = null }
  }
  if (ini !== null) out.push([ini, total - 1]);
  return out;
}

/** Mediana de un array de numeros. */
function mediana(a) {
  if (!a.length) return 0;
  const s = [...a].sort((p, q) => p - q);
  return s[s.length >> 1];
}

/**
 * @param img          imagen ya cargada
 * @param minBanda     alto minimo para que una banda cuente como fila (filtra
 *                     las etiquetas de texto que traen las hojas exportadas)
 * @param minSprite    ancho minimo para que un grupo cuente como fotograma
 */
export function detectSheet(img, { minBanda = 20, minSprite = 20 } = {}) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, w, h).data;
  const alfa = (px, py) => d[(py * w + px) * 4 + 3];

  // filas vacias -> bandas horizontales con contenido
  const filaVacia = new Array(h);
  for (let y = 0; y < h; y++) {
    let vacia = true;
    for (let px = 0; px < w; px++) { if (alfa(px, y) > 8) { vacia = false; break } }
    filaVacia[y] = vacia;
  }
  const bandas = tramos(filaVacia, h).filter(([y0, y1]) => y1 - y0 + 1 >= minBanda);
  if (!bandas.length) return { w, h, cellW: w, rows: [] };

  // grupos de columnas dentro de cada banda
  const grupos = bandas.map(([y0, y1]) => {
    const colVacia = new Array(w);
    for (let px = 0; px < w; px++) {
      let vacia = true;
      for (let y = y0; y <= y1; y++) { if (alfa(px, y) > 8) { vacia = false; break } }
      colVacia[px] = vacia;
    }
    return tramos(colVacia, w).filter(([c0, c1]) => c1 - c0 + 1 >= minSprite);
  });

  // ancho de celda: mediana del paso entre inicios de sprite de todas las bandas
  const pasos = [];
  for (const g of grupos) for (let i = 1; i < g.length; i++) pasos.push(g[i][0] - g[i - 1][0]);
  let cellW = mediana(pasos);
  if (!cellW || cellW < minSprite) cellW = w;         // una sola columna

  // fotogramas por fila: grupos anchos (los estrechos suelen ser adornos sueltos)
  const rows = bandas.map(([y0, y1], i) => {
    const anchos = grupos[i].filter(([c0, c1]) => c1 - c0 + 1 >= cellW * 0.5);
    const n = Math.max(1, Math.min(anchos.length || grupos[i].length, Math.floor(w / cellW)));
    return { y: y0, h: y1 - y0 + 1, n };
  });

  return { w, h, cellW, rows };
}

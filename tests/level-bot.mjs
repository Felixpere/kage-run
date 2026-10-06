/**
 * Prueba automática del nivel: un bot recorre el mapa en las cuatro formas.
 *
 *   node tests/level-bot.mjs            las cuatro formas
 *   node tests/level-bot.mjs 0          solo la forma 1 (Niño)
 *   node tests/level-bot.mjs --headed   con navegador visible
 *
 * El bot mantiene DERECHA y salta cuando detecta un hueco en el suelo o un
 * obstáculo delante. Nada más: ni patada ni poderes. Si el bot no llega al
 * torii, el nivel exige algo que un jugador no puede deducir solo corriendo.
 *
 * La simulación NO depende del reloj: avanza fotograma a fotograma con
 * window.KAGE.tick(), así que el resultado es el mismo en cualquier máquina y
 * no se ve afectado por que la pestaña esté oculta (requestAnimationFrame se
 * pausa, tick() no). "Segundos" significa fotogramas / 60.
 *
 * El juego llama a Math.random() al construir enemigos, morteros y serpientes,
 * asi que cada carga daria un nivel distinto. La prueba inyecta un generador
 * con semilla antes de cargar la pagina: dos ejecuciones con la misma semilla
 * dan exactamente el mismo resultado. Con --semillas N se prueban N semillas y
 * hay que pasarlas todas, que es lo que de verdad demuestra que el nivel aguanta.
 *
 * Sale con código 1 si alguna forma no llega al torii.
 */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, normalize } from 'node:path';
import { writeFileSync } from 'node:fs';

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));

const FPS = 60;
const MAX_FRAMES = 20000;        // ~5,5 min simulados
const BLOQUEO_FRAMES = 5 * FPS;  // 5 s sin avanzar = bloqueo (lo que pide el enunciado)
const ABANDONO_FRAMES = 15 * FPS;// 15 s sin avanzar = se da por imposible
const AVANCE_MIN = 2;            // px para considerar que ha avanzado

const FORMAS = ['Niño', 'Chakra', 'Sabio', 'Dorado'];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif',
  '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

function servidor(raiz) {
  return new Promise(resolve => {
    const s = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(req.url.split('?')[0]);
        if (p.endsWith('/')) p += 'index.html';
        const abs = normalize(join(raiz, p));
        if (!abs.startsWith(raiz)) { res.writeHead(403).end(); return }
        const cuerpo = await readFile(abs);
        const ext = abs.slice(abs.lastIndexOf('.')).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(cuerpo);
      } catch { res.writeHead(404).end('no encontrado') }
    });
    s.listen(0, '127.0.0.1', () => resolve({ s, puerto: s.address().port }));
  });
}

/** Recorre el nivel con una forma. Devuelve el informe de esa pasada. */
async function pasada(page, forma, god, soloMapa) {
  return await page.evaluate(async ({ forma, god, soloMapa, MAX_FRAMES, BLOQUEO_FRAMES, ABANDONO_FRAMES, AVANCE_MIN, FPS }) => {
    const K = window.KAGE, G = K.G;
    const { goal, COLS } = await import('./js/level.js');
    const { TILE, H } = await import('./js/state.js');

    // --- arranque limpio: forma pedida, SIN vidas infinitas
    document.getElementById('start').click();
    G.god = god;
    for (const k of Object.keys(K.keys)) K.keys[k] = false;
    for (const k of Object.keys(K.pressed)) K.pressed[k] = false;
    if (forma > 0) { K.pressed['f' + (forma + 1)] = true; K.tick(3) }
    G.god = god;                         // por si el cambio de forma lo tocó
    if (soloMapa) {                      // aisla la geometria pura: sin enemigos
      for (const e of G.enemies) e.alive = false;
      for (const m of G.mortars) m.alive = false;
      for (const sn of G.snakes) sn.dead = true;
    }
    K.tick(2);

    // --- sensores sobre el mundo real del juego
    const solidoEn = (x, y) =>
      G.solidsLive.some(s => x >= s.x && x < s.x + s.w && y >= s.y && y < s.y + s.h);
    const sueloBajo = (x, yPies, caidaMax) =>
      G.solidsLive.some(s => x >= s.x && x < s.x + s.w && s.y >= yPies - 4 && s.y <= yPies + caidaMax);

    // Hay que saltar con el enemigo AUN LEJOS: si se espera a tenerlo pegado,
    // el choque ocurre en la subida. La ventana se estira con la velocidad.
    const enemigoDelante = (P) => {
      const alcance = Math.max(90, Math.abs(P.vx) * 16);
      return G.enemies.some(e =>
        e.alive && !e.dead && e.x > P.x + P.w - 4 && e.x < P.x + P.w + alcance &&
        e.y + e.h > P.y + 10 && e.y < P.y + P.h + 20) ||
        G.mortars.some(m =>
          m.alive && m.x > P.x + P.w - 4 && m.x < P.x + P.w + alcance &&
          m.y + m.h > P.y + 10);
    };

    const META = goal ? goal.x : COLS * TILE;
    const bloqueos = [], muertesEn = [];
    let mejorX = G.P.x, desde = 0, saltoHold = 0, muertes = 0, vidasPrev = G.lives;
    let fin = null, f = 0;

    const traza = [];
    for (; f < MAX_FRAMES; f++) {
      const P = G.P;
      traza.push({ f, x: Math.round(P.x), y: Math.round(P.y), vx: +P.vx.toFixed(1),
                   vy: +P.vy.toFixed(1), suelo: P.ground, runT: G.runT, saltos: P.jumps });
      if (traza.length > 400) traza.shift();

      // ---- lógica del bot: derecha siempre, saltar ante borde u obstáculo
      K.keys.right = true;
      // La anticipacion crece con la velocidad: un muro de 3 tiles necesita
      // empezar el salto ~20 fotogramas antes, no al tenerlo pegado.
      const vista = Math.max(28, Math.abs(P.vx) * 11);
      const frente = P.x + P.w + vista;
      const obstaculo = solidoEn(frente, P.y + 70) || solidoEn(frente, P.y + 40) ||
                        solidoEn(P.x + P.w + 8, P.y + 70) || enemigoDelante(P);
      const hueco = !sueloBajo(P.x + P.w + vista, P.y + P.h, 130);

      // al tocar suelo se puede volver a saltar YA: mantener la cuenta atras
      // aqui era justo lo que hacia caer al bot al aterrizar en el borde.
      if (P.ground) saltoHold = 0;
      if (saltoHold > 0) { K.keys.jump = true; saltoHold-- }
      else K.keys.jump = false;

      if (P.ground && (obstaculo || hueco)) {
        K.pressed.jump = true; K.keys.jump = true; saltoHold = 16;
      } else if (!P.ground && P.vy > 0 && forma >= 1 && P.jumps < 2 &&
                 !sueloBajo(P.x + P.w / 2, P.y + P.h, 220) && saltoHold === 0) {
        // doble salto de rescate, solo donde el juego lo permite (forma II+)
        K.pressed.jump = true; K.keys.jump = true; saltoHold = 14;
      }

      const antesX = P.x, antesY = P.y;
      K.tick(1);

      // ---- métricas
      if (G.lives < vidasPrev) {
        muertes++; vidasPrev = G.lives;
        muertesEn.push({ x: Math.round(antesX), tile: Math.round(antesX / TILE),
                         causa: antesY > H - 40 ? 'caida al vacio' : 'golpe', frame: f });
      }
      if (G.P.x > mejorX + AVANCE_MIN) { mejorX = G.P.x; desde = f }

      const atasco = f - desde;
      if (atasco === BLOQUEO_FRAMES) {
        bloqueos.push({
          x: Math.round(mejorX),
          tile: Math.round(mejorX / TILE),
          tramo: Math.min(4, 1 + Math.floor(mejorX / (COLS * TILE / 4))),
          frame: f,
          segundos: +(atasco / FPS).toFixed(1),
        });
      }
      if (goal && G.P.x + G.P.w >= goal.x) { fin = 'torii'; break }
      if (!G.running) {
        fin = /TORII/i.test(document.querySelector('#overlay h2')?.textContent || '')
            ? 'torii' : 'fin de partida';
        break;
      }
      if (atasco >= ABANDONO_FRAMES) { fin = 'bloqueado'; break }
    }
    if (!fin) fin = 'sin tiempo';

    const titulo = document.querySelector('#overlay h2')?.textContent || '';
    return {
      fin, frames: f, segundos: +(f / FPS).toFixed(1),
      maxX: Math.round(mejorX), maxTile: Math.round(mejorX / TILE),
      metaX: Math.round(META), metaTile: Math.round(META / TILE),
      avance: +(100 * mejorX / META).toFixed(1),
      muertes, vidas: G.lives, puntos: G.score, forma: G.form,
      bloqueos, muertesEn, titulo, traza: fin === 'bloqueado' ? traza : [],
    };
  }, { forma, god, soloMapa, MAX_FRAMES, BLOQUEO_FRAMES, ABANDONO_FRAMES, AVANCE_MIN, FPS });
}

// ------------------------------------------------------------------ principal
const args = process.argv.slice(2);
const headed = args.includes('--headed');
const god = args.includes('--god') || args.includes('--solo-mapa');
const soloMapa = args.includes('--solo-mapa');
const soloForma = args.find(a => /^[0-3]$/.test(a));
const nSemillas = Number((args.find(a => a.startsWith('--semillas=')) || '--semillas=1').split('=')[1]);
const formas = soloForma !== undefined ? [Number(soloForma)] : [0, 1, 2, 3];

console.log(soloMapa ? 'modo SOLO MAPA (sin enemigos ni vidas: geometria pura)'
          : god ? 'modo GEOMETRIA (vidas infinitas)'
                : 'modo REAL (sin vidas infinitas)');
const { s, puerto } = await servidor(RAIZ);
const navegador = await chromium.launch({ headless: !headed });
const page = await navegador.newPage();

const errores = [];
page.on('pageerror', e => errores.push(String(e.message)));
page.on('console', m => { if (m.type() === 'error') errores.push(m.text()) });

/** Math.random determinista, inyectado antes de que cargue ningun modulo. */
async function sembrar(page, semilla) {
  await page.addInitScript(s => {
    let x = s >>> 0 || 1;
    Math.random = () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296 };
  }, semilla);
}

const informes = [];
try {
 for (let semilla = 1; semilla <= nSemillas; semilla++) {
  if (nSemillas > 1) console.log(`
######## semilla ${semilla} ########`);
  const ctx = await navegador.newContext();
  const page2 = await ctx.newPage();
  page2.on('pageerror', e => errores.push(String(e.message)));
  page2.on('console', m => { if (m.type() === 'error') errores.push(m.text()) });
  await sembrar(page2, semilla);
  for (const forma of formas) {
    await page2.goto(`http://127.0.0.1:${puerto}/`, { waitUntil: 'load' });
    await page2.waitForFunction(() => window.KAGE && window.KAGE.G, null, { timeout: 15000 });
    await page2.waitForTimeout(600);            // dar margen a que carguen las hojas

    const r = await pasada(page2, forma, god, soloMapa);
    r.nombre = FORMAS[forma];
    r.semilla = semilla;
    informes.push(r);

    const ok = r.fin === 'torii';
    console.log(
      `\n${ok ? 'OK  ' : 'FALLA'}  Forma ${forma + 1} (${r.nombre})\n` +
      `        final: ${r.fin}${r.titulo ? '  «' + r.titulo + '»' : ''}\n` +
      `        avance: ${r.avance}%  (x=${r.maxX} de ${r.metaX}, tile ${r.maxTile} de ${r.metaTile})\n` +
      `        ${r.segundos}s simulados · muertes: ${r.muertes} · vidas: ${r.vidas} · puntos: ${r.puntos}`
    );
    for (const b of r.bloqueos)
      console.log(`        bloqueado >5s en x=${b.x} (tile ${b.tile}, tramo ${b.tramo})`);
    for (const m of r.muertesEn)
      console.log(`        muere en x=${m.x} (tile ${m.tile}) por ${m.causa}`);
  }
  await ctx.close();
 }
} finally {
  await navegador.close();
  s.close();
}

writeFileSync(join(RAIZ, 'tests', soloMapa ? 'level-bot-report-mapa.json' : god ? 'level-bot-report-god.json' : 'level-bot-report.json'),
  JSON.stringify(informes, null, 2) + '\n');

const fallan = informes.filter(r => r.fin !== 'torii');
console.log('\n' + '-'.repeat(64));
if (errores.length) {
  console.log(`errores de consola: ${errores.length}`);
  for (const e of [...new Set(errores)].slice(0, 5)) console.log('  ' + e);
}
if (fallan.length) {
  console.log(`FALLA: ${fallan.length} de ${informes.length} formas no llegan al torii`);
  for (const r of fallan)
    console.log(`  semilla ${r.semilla} · Forma ${r.forma + 1} (${r.nombre}): ${r.fin} al ${r.avance}%`);
  process.exit(1);
}
console.log(`OK: ${informes.length} pasadas (${formas.length} formas x ${nSemillas} semilla(s)) llegan al torii`);

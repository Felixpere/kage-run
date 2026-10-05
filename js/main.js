// Arranque: entrada de teclado y tactil, bucle principal.
import { G, ctx, CH, keys, pressed, released } from './state.js';
import { reset, show } from './game.js';
import { step } from './physics.js';
import { draw } from './render.js';
import { initHero, heroReady, heroAnimFor, analyzeSheet } from './hero.js';
import { initAudio, initMuteButton, startMusic, toggleMute, isMuted } from './audio.js';
import { startBtn } from './state.js';

addEventListener('keydown',e=>{const k=map(e.key);if(k){if(!keys[k])pressed[k]=true;keys[k]=true;e.preventDefault()}});
addEventListener('keyup',e=>{const k=map(e.key);if(k){keys[k]=false;released[k]=true}});
function map(k){return{ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',w:'jump',' ':'jump',x:'dash',X:'dash',z:'orb',Z:'orb',c:'clone',C:'clone',k:'kick',K:'kick',v:'beam',V:'beam',b:'summon',B:'summon',h:'henge',H:'henge',j:'sexy',J:'sexy',i:'god',I:'god',t:'hud',T:'hud','1':'f1','2':'f2','3':'f3','4':'f4'}[k]}
document.querySelectorAll('.k').forEach(b=>{const k=b.dataset.k;
  const on=e=>{e.preventDefault();if(!keys[k])pressed[k]=true;keys[k]=true;b.classList.add('down')};
  const off=e=>{e.preventDefault();if(keys[k])released[k]=true;keys[k]=false;b.classList.remove('down')};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off)});

function loop(){if(G.running){try{step();draw()}catch(err){console.error(err);ctx.fillStyle='#f00';ctx.font='12px monospace';ctx.fillText('ERR '+err.message,10,CH-20)}}requestAnimationFrame(loop)}
G.running = false;
startBtn.onclick = () => { initAudio(); startMusic(); reset(true); show(false); G.running = true };

// Modo pruebas: handle para inspeccionar el estado y avanzar fotogramas a mano
// (util cuando la pestana esta oculta y requestAnimationFrame se pausa).
window.KAGE = { G, keys, pressed, released, step, draw, heroReady, heroAnimFor, analyzeSheet,
  toggleMute, isMuted,
  tick(n = 1) { for (let i = 0; i < n; i++) { step(); draw(); } } };

initHero();
initMuteButton();
reset(true); draw(); loop();

// Ciclo de partida: reset, mostrar/ocultar menu, fin, evolucion y dano.
import { G, H, TILE, CAMY, overlay, startBtn, wrap, pad, legend, FORMS } from './state.js';
import { scrolls0, enemies0, solids, snakes0, mortars0 } from './level.js';
import { burst, hitstop } from './fx.js';

function reset(full){
  if(full){G.lives=3;G.score=0}
  G.form=0;G.gotCount=0;G.cam=0;G.camY=CAMY;G.freeze=0;G.coins=[];G.sexy=0;G.particles=[];G.clones=[];G.chakra=50;G.shake=0;G.debris=[];G.summon=null;G.fallen=[];G.craters=[];G.items=[];G.beam=null;G.charge=0;G.runT=0;G.shots=[];G.scorch=[];G.mounds=[];G.henge=0;G.orbHold=0;G.charging=false;G.ring=null;
  G.scrolls=scrolls0.map(s=>({...s}));G.enemies=enemies0.map(e=>({...e,dead:0,vy:0}));G.solidsLive=solids.map(x=>({...x}));
  G.snakes=snakes0.map(s=>({...s,pipe:G.solidsLive.find(q=>q.x===s.px&&q.y===s.py),dead:false}));G.mortars=mortars0.map(m=>({...m}));
  G.P={x:80,y:H-3*TILE-36,w:40,h:90,vx:0,vy:0,ground:false,jumps:0,face:1,dash:0,dashCd:0,inv:0,aura:0,kick:0,kickCd:0,flyKick:0,land:0,prevVy:0,rush:0};
}
function evolve(){if(G.form<3){G.form++;G.charge=50;G.P.inv=140;G.P.vx=0;G.shake=4;hitstop(30)}}
function loseLife(msg){if(G.god){G.P.inv=120;return false}G.lives--;if(G.lives<=0){end('GAME OVER',msg+' Puntos: '+G.score);return true}return false}
function hurt(){if(G.P.inv>0||G.charge>0||G.henge>0||G.P.rush>0||G.sexy>0)return;
  if(G.form>0){G.form--;G.P.inv=120;burst(G.P.x+20,G.P.y+45,'#ffffff',30);G.P.vx=-G.P.face*4;G.P.vy=-5}
  else{if(loseLife('El reino del bambú gana esta vez.'))return;G.P.inv=120;G.P.vx=-G.P.face*5;G.P.vy=-6}}
function end(title,msg){G.running=false;overlay.querySelector('h2').textContent=title;overlay.querySelectorAll('p')[0].textContent=msg;overlay.querySelector('.evo').style.display='none';overlay.querySelectorAll('p')[1].style.display='none';startBtn.textContent='OTRA VEZ';show(true);startBtn.onclick=()=>{reset(true);show(false);G.running=true}}
function show(menu){overlay.classList.toggle('off',!menu);[wrap,pad,legend].forEach(e=>e.classList.toggle('off',menu))}
export { reset, evolve, loseLife, hurt, end, show };

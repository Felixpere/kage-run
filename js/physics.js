// Fisica, entrada de juego, colisiones, poderes y enemigos.
import { G, keys, pressed, released, FORMS, W, CH, H, TILE, VW, VH, CAMY, ORBE, CARGADO_ESC } from './state.js';
import { COLS, goal } from './level.js';
import { burst, dust, doFlash, hitstop, crater, updateFX, spawnFX } from './fx.js';
import { sfx } from './audio.js';
import { evolve, loseLife, hurt, end } from './game.js';

function hit(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function killEnemy(e,kx){if(e.dead)return;e.dead=40;e.kx=kx;e.ky=-7;e.squash=false;burst(e.x+20,e.y+20,'#ff3b5c',20);spawnFX('explosion',e.x+21,e.y+20,1.6);sfx('golpe');G.shake=Math.max(G.shake,4)}
function killMortar(m){m.alive=false;G.score+=300;burst(m.x+20,m.y+20,'#6b7280',30,10);spawnFX('explosion',m.x+20,m.y+20,2.2);sfx('explosion');G.shake=6}
function bump(s){if(s.t==='b')breakBlock(s,0);
  else if(s.t==='l'){s.t='u';sfx('moneda');G.chakra=Math.min(100,G.chakra+20);G.score+=50;G.shake=3;burst(s.x+24,s.y-6,'#ffd166',14);G.items.push({x:s.x+10,y:s.y-30,vx:G.P.face*1.6,vy:-4,w:26,h:26,life:600});for(let k=0;k<9;k++)G.coins.push({x:s.x+24,y:s.y-4,vx:(Math.random()-.5)*5,vy:-7-Math.random()*4,life:90,ph:Math.random()*4})}
  else G.shake=Math.max(G.shake,1)}
function breakBlock(s,dir){const i=G.solidsLive.indexOf(s);if(i<0)return;G.score+=50;sfx('romper');spawnFX('chispa',s.x+s.w/2,s.y+s.h/2,1.4);G.shake=Math.max(G.shake,s.t==='p'?8:5);dir=dir||1;
  if(s.t==='p'){G.solidsLive.splice(i,1);for(const sn of G.snakes)if(sn.pipe===s)sn.dead=true;
    hitstop(10);if(s.stump||Math.random()<0.5){G.fallen.push({x:s.x,y:s.y,w:s.w,h:s.h,dir,a:0});crater(s.x+s.w/2+dir*30,s.y+s.h)}
    else{G.solidsLive.push({x:s.x,y:s.y+TILE,w:s.w,h:TILE,t:'p',stump:true});for(let k=0;k<3;k++)G.debris.push({x:s.x+k*20,y:s.y+10,vx:dir*(3+k),vy:-6-k,rot:0,vr:0.15,life:80,col:'#3f9a3b',sz:22,bamboo:true})}
    dust(s.x+s.w/2,s.y+s.h,16);return}
  G.solidsLive.splice(i,1);
  const col=s.t==='l'||s.t==='u'?['#ffd166','#e0462e','#7a2a1e']:['#9a5a2a','#3a1c0a','#c27a3a'];
  for(let k=0;k<14;k++)G.debris.push({x:s.x+Math.random()*s.w,y:s.y+Math.random()*s.h,vx:(Math.random()-0.5)*7+dir*3,vy:-5-Math.random()*6,rot:0,vr:(Math.random()-0.5)*0.5,life:70,col:col[k%col.length],sz:6+Math.random()*8})}
function supported(e){for(const s of G.solidsLive)if(e.x+e.w-4>s.x&&e.x+4<s.x+s.w&&Math.abs(e.y+e.h-s.y)<3)return s;return null}
function applyGravity(e){const sup=supported(e);if(sup&&e.vy>=0){e.vy=0;e.y=sup.y-e.h;return true}e.vy=Math.min(12,e.vy+0.5);e.y+=e.vy;for(const s of G.solidsLive)if(hit(e,s)&&e.vy>0){e.y=s.y-e.h;e.vy=0;return true}return false}

// Al caer al vacio hay que reaparecer en un sitio del que se pueda salir: sobre
// suelo firme y con varios tiles por delante. Reaparecer en cam+100 conservando
// la velocidad de sprint provocaba un bucle de muertes cuando la camara quedaba
// justo antes de un hueco.
const TILES_SEGUROS = 9;   // suelo por delante suficiente para coger carrerilla
function haySuelo(x){
  for(const s of G.solidsLive) if(s.t==='g' && x>=s.x && x<s.x+s.w && s.y<=H-2*TILE && s.y>H-3*TILE) return true;
  return false;
}
function puntoSeguro(desde){
  for(let x=Math.max(80,desde); x>80; x-=TILE){
    let ok=true;
    for(let k=0;k<TILES_SEGUROS;k++) if(!haySuelo(x+k*TILE+20)){ok=false;break}
    if(ok) return x;
  }
  return 80;
}

function step(){
  if(G.freeze>0){G.freeze--;for(const k in pressed)pressed[k]=false;for(const k in released)released[k]=false;return}
  G.t++;const F=FORMS[G.form];
  if(pressed.god){G.god=!G.god}if(pressed.hud)G.showHud=!G.showHud;
  for(let i=1;i<=4;i++)if(pressed['f'+i]&&G.form!==i-1){G.form=i-1;G.charge=30;G.P.vx=0;G.chakra=100}
  if(G.charge>0){G.charge--;G.P.vx=0;if(G.t%2==0)G.particles.push({x:G.P.x+Math.random()*40,y:G.P.y+94,vx:0,vy:-3-Math.random()*2,life:30,col:'#3ee6ff',g:0});
    if(G.charge===1){G.P.aura=100;burst(G.P.x+20,G.P.y+45,F.col,70,12);G.shake=8;hitstop(40)}}
  // manual G.charge (hold Z) vs rush (tap Z)
  if(keys.orb&&G.form>=1){G.orbHold++;if(G.orbHold>14&&G.P.ground){G.charging=true;G.P.vx=0;G.chakra=Math.min(100,G.chakra+0.9);if(G.t%2==0)G.particles.push({x:G.P.x+Math.random()*40,y:G.P.y+94,vx:0,vy:-3-Math.random()*2,life:30,col:'#3ee6ff',g:0})}}
  if(released.orb){
    const cfg=ORBE[G.form], cargado=G.chakra>=100, esc=cargado?CARGADO_ESC:1, coste=cfg.coste*(cargado?2:1);
    if(G.orbHold<=14&&G.chakra>=coste&&G.charge<=0&&!G.orb){
      G.chakra-=coste; sfx('magia'); G.P.inv=Math.max(G.P.inv,18);
      burst(G.P.x+20,G.P.y+45,'#3ee6ff',cargado?24:10);
      const base={tipo:cfg.tipo,r:cfg.r*esc,esc,cargado,dir:G.P.face,golpeados:[]};
      if(cfg.tipo==='mano'){
        G.P.rush=Math.round(cfg.embestidaTiles*TILE*esc/8);
        G.orb={...base,vida:Math.round(cfg.vida*esc),maxVida:Math.round(cfg.vida*esc),parpadeo:!!cfg.parpadeo,x:0,y:0};
      }else{
        // La caja de choque no crece con el dibujo: si creciera, al salir
        // cargada tocaria el suelo en el mismo fotograma y detonaria sola.
        G.orb={...base,x:G.P.x+20+G.P.face*(40+cfg.r*0.5),y:G.P.y+38,vel:cfg.vel,rec:0,giro:0,
               rc:Math.min(cfg.r,24),
               alcance:cfg.alcanceTiles*TILE*esc,expansionR:(cfg.expansionTiles||0)*TILE*esc};
      }
    }
    G.orbHold=0;G.charging=false}
  // ---- input (ninja feel: instant start/stop)
  let ax=0;if(keys.left)ax=-1;if(keys.right)ax=1;
  if(G.charge>0||G.charging||G.sexy>0)ax=0;
  if(ax&&G.P.ground)G.runT++;else if(!ax)G.runT=0;
  const sprint=G.runT>60;const runFast=G.runT>18;
  const maxv=sprint?F.sprint:runFast?F.run:F.walk;
  if(G.P.dash>0){G.P.vx=G.P.face*(G.form>=3?11:9);G.P.dash--}
  else if(G.P.rush>0){G.P.vx=G.P.face*8;G.P.rush--}
  else if(G.P.flyKick>0){G.P.flyKick--}
  else{if(ax){G.P.face=ax;G.P.vx+=(ax*maxv-G.P.vx)*0.5}else{G.P.vx=G.P.ground?0:G.P.vx*0.9}}
  if(sprint&&G.P.ground&&G.t%7==0)dust(G.P.x+(G.P.face>0?-6:44),G.P.y+90,3);
  if(pressed.jump&&G.charge<=0&&!G.charging&&G.sexy<=0){const maxJ=G.form>=1?2:1;if(G.P.ground||G.P.jumps<maxJ){G.P.vy=F.jump*(G.P.jumps?0.85:1);G.P.jumps++;G.P.ground=false;sfx('salto');dust(G.P.x+20,G.P.y+90,G.P.jumps>1?0:6);if(G.P.jumps>1)burst(G.P.x+20,G.P.y+90,'#3ee6ff',12)}}
  if(!keys.jump&&G.P.vy<-10)G.P.vy=-10;
  if(pressed.kick&&G.P.kickCd<=0&&G.charge<=0){G.P.kick=12;G.P.kickCd=20;sfx('tajo');if(!G.P.ground){G.P.flyKick=14;G.P.vx=G.P.face*7;G.P.vy=4}}
  if(pressed.dash&&G.form>=2&&G.P.dashCd<=0){G.P.dash=12;G.P.dashCd=40;G.P.inv=Math.max(G.P.inv,13)}
  if(pressed.clone&&G.form>=1&&G.chakra>=35){
    G.chakra-=35; sfx('magia');
    const n=[0,2,4,6][G.form];                     // F2 dos, F3 cuatro, F4 seis
    for(let i=0;i<n;i++){
      const lado=i%2?1:-1, paso=2.3+Math.floor(i/2)*1.7;   // abanico
      G.clones.push({x:G.P.x,y:G.P.y,vx:lado*paso,life:150,kick:0,nace:9,face:lado});
    }
    spawnFX('humo',G.P.x+20,G.P.y+45,4.5); burst(G.P.x+20,G.P.y+45,'#FFFFFF',44,11);
    doFlash(.35,170); hitstop(5);
  }
  if(pressed.sexy&&G.form>=1&&G.chakra>=30&&G.sexy<=0){G.chakra-=30;G.sexy=180;G.P.vx=0;sfx('magia');spawnFX('humo',G.P.x+20,G.P.y+45,3);for(let i=0;i<30;i++)G.particles.push({x:G.P.x+Math.random()*40,y:G.P.y+Math.random()*90,vx:(Math.random()-.5)*2,vy:-2-Math.random()*3,life:40,col:'#FFFFFF',g:-0.02});hitstop(10);
    for(const e of G.enemies)if(e.alive&&!e.dead&&e.kind!=='shell'&&Math.abs(e.x-G.P.x)<520&&Math.abs(e.y-G.P.y)<200){e.stun=300;e.vx=Math.sign(G.P.x-e.x)*0.001||0.001}}
  if(pressed.summon&&G.form>=2&&G.chakra>=60&&!G.summon){G.chakra-=60;sfx('invocar');spawnFX('humo',G.P.x+20,G.P.y+45,6);G.summon={x:G.cam-600,y:H-2*TILE-440,vx:9,life:360,stage:0,wait:0};G.shake=12;hitstop(45)}
  if(pressed.beam&&G.form>=3&&G.chakra>=50&&!G.beam){G.chakra-=50;sfx('magia');G.beam={x:G.P.x+20,y:G.P.y+45,dir:G.P.face,life:20,w:0};G.shake=14;doFlash(.6,240);G.P.vx=0;hitstop(10)}
  for(const k in pressed)pressed[k]=false;for(const k in released)released[k]=false;
  if(G.chakra<100)G.chakra+=0.05;
  if(G.sexy>0)G.sexy--;if(G.P.kick>0)G.P.kick--;if(G.P.kickCd>0)G.P.kickCd--;if(G.P.dashCd>0)G.P.dashCd--;if(G.P.inv>0)G.P.inv--;if(G.P.aura>0)G.P.aura--;if(G.P.land>0)G.P.land--;if(G.P.hurtT>0)G.P.hurtT--;
  if(G.P.dash>0){if(G.form<3&&G.t%2==0)burst(G.P.x+20,G.P.y+60,'#D4503A',3);if(G.form>=3){for(let i=0;i<3;i++)G.particles.push({x:G.P.x+20-G.P.face*(20+i*14),y:G.P.y+30+Math.random()*60,vx:-G.P.face*3,vy:-1.5,life:22,col:i===0?'#FFF6D0':i===1?'#FF8A2B':'#E0701A',g:0});if(G.P.ground&&G.t%3==0)G.scorch.push({x:G.P.x+20,y:G.P.y+90,life:900})}}
  // ---- physics: heavy fast fall; dash crouches the hitbox
  G.P.vy+=G.P.vy>0?0.78:0.5;if(G.P.vy>15)G.P.vy=15;
  const ph=G.P.dash>0?44:90,off=90-ph;const pb={x:G.P.x,y:G.P.y+off,w:40,h:ph};
  G.P.x+=G.P.vx;pb.x=G.P.x;for(const s of G.solidsLive)if(hit(pb,s)){if(G.P.vx>0)G.P.x=s.x-G.P.w;else if(G.P.vx<0)G.P.x=s.x+s.w;if((G.P.dash>0||G.P.rush>0)&&s.t!=='g')breakBlock(s,G.P.face);G.P.vx=0;pb.x=G.P.x}
  if(G.P.x<G.cam)G.P.x=G.cam;if(G.P.x>COLS*TILE-G.P.w)G.P.x=COLS*TILE-G.P.w;
  G.P.prevVy=G.P.vy;G.P.y+=G.P.vy;pb.y=G.P.y+off;const wasG=G.P.ground;G.P.ground=false;
  for(const s of G.solidsLive)if(hit(pb,s)){if(G.P.vy>0){G.P.y=s.y-G.P.h;G.P.ground=true;G.P.jumps=0;G.P.flyKick=0}else if(G.P.vy<0){G.P.y=s.y+s.h-off;bump(s)}G.P.vy=0;pb.y=G.P.y+off}
  if(G.P.ground&&!wasG){if(G.P.prevVy>9){dust(G.P.x+20,G.P.y+90,14);G.shake=Math.max(G.shake,3);crater(G.P.x+20,G.P.y+90);G.P.land=8}else dust(G.P.x+20,G.P.y+90,5)}
  if(G.P.y>H+100){if(loseLife('Caíste al vacío.'))return;G.P.x=puntoSeguro(G.cam+100);G.P.y=H-5*TILE;G.P.vy=0;G.P.vx=0;G.runT=0;G.P.jumps=0;G.P.dash=0;G.P.rush=0;G.P.inv=120}
  // ---- melee: kick + rush
  const kb=(G.P.kick>5||G.P.flyKick>0)?{x:G.P.face>0?G.P.x+G.P.w-8:G.P.x-44,y:G.P.y+24,w:52,h:56}:null;
  const rb=G.P.rush>0?{x:G.P.face>0?G.P.x+G.P.w-10:G.P.x-110,y:G.P.y-20,w:120,h:120}:null;
  for(const hb of [kb,rb])if(hb){for(const e of G.enemies)if(e.alive&&!e.dead&&hit(hb,e)){if(e.kind==='shell'){e.vx=G.P.face*9;e.rolling=true;G.score+=50}else{killEnemy(e,G.P.face*5);G.score+=150}}
    for(const s of G.solidsLive)if(hit(hb,s)&&s.t!=='g')breakBlock(s,G.P.face);
    for(const m of G.mortars)if(m.alive&&hit(hb,m)){m.hp--;burst(m.x+20,m.y+20,'#9aa3b8',10);if(m.hp<=0)killMortar(m)}
    for(const sh of G.shots)if(hit(hb,sh)){sh.life=0;burst(sh.x,sh.y,'#555',10)}
    for(const sn of G.snakes)if(!sn.dead&&sn.up>0.5&&hit(hb,{x:sn.x,y:sn.pipe.y-sn.up*40,w:sn.w,h:sn.up*40})){sn.dead=true;G.score+=200;burst(sn.x+20,sn.pipe.y-20,'#4ccf5e',20)}}
  // ---- G.scrolls
  for(const s of G.scrolls)if(!s.got&&hit(G.P,s)){s.got=true;G.gotCount++;G.score+=100;sfx('pergamino');G.chakra=Math.min(100,G.chakra+25);burst(s.x+12,s.y+16,'#ffe066',20);if(G.gotCount%3==0)evolve();G.shake=2}
  // ---- G.items
  for(const it of G.items){it.life--;it.vy+=0.5;it.x+=it.vx;it.y+=it.vy;for(const s of G.solidsLive)if(hit(it,s)){if(it.vy>0&&it.y+it.h-s.y<16){it.y=s.y-it.h;it.vy=0}else{it.vx*=-1;it.x+=it.vx*2}}
    if(hit(G.P,it)){it.life=0;if(G.lives<5)G.lives++;G.score+=300;sfx('vida');burst(it.x+13,it.y+13,'#ffffff',20)}}
  G.items=G.items.filter(i=>i.life>0&&i.y<H+60);
  // ---- G.enemies (with gravity)
  const passThrough=G.form>=2||G.P.dash>0||(G.P.inv>0&&G.P.aura>0);
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.dead){e.dead--;if(!e.squash){e.x+=e.kx||0;e.y+=e.ky||0;if(e.ky!==undefined)e.ky+=0.4}if(e.dead<=0)e.alive=false;continue}
    if(e.kind==='shell'){
      if(e.rolling){e.x+=e.vx;for(const s of G.solidsLive){if(!hit(e,s))continue;if(e.y+e.h-s.y<6)continue;if(s.t==='b'||s.t==='l'||s.t==='u')breakBlock(s,e.vx>0?1:-1);else{e.vx*=-1;e.x+=e.vx*2}}
        for(const o of G.enemies)if(o!==e&&o.alive&&!o.dead&&hit(e,o)){killEnemy(o,e.vx>0?6:-6);G.score+=200}
        for(const m of G.mortars)if(m.alive&&hit(e,m))killMortar(m);
        e.life=(e.life||360)-1;if(e.life<=0)e.alive=false;if(G.t%4==0)dust(e.x+20,e.y+e.h,1)}
      applyGravity(e);if(e.y>H+80)e.alive=false;
      if(hit(G.P,e)){if(!e.rolling){e.vx=G.P.x<e.x?9:-9;e.rolling=true;G.P.inv=Math.max(G.P.inv,20)}else if(G.P.vy>0&&G.P.y+G.P.h-e.y<28){e.rolling=false;e.vx=0;G.P.vy=-7}else if(!(G.P.inv>0||passThrough))hurt()}
      continue}
    if(e.stun>0){e.stun--;applyGravity(e);if(G.t%12==0)G.particles.push({x:e.x+e.w/2+(Math.random()-.5)*20,y:e.y-6,vx:0,vy:-0.8,life:40,col:'#FF5CC8',g:-0.01,heart:true});
      if(hit(G.P,e)){e.dead=240;e.squash=true;G.score+=200;burst(e.x+20,e.y+20,'#FF5CC8',16)}continue}
    const onG=applyGravity(e);
    if(onG){e.x+=e.vx;for(const s of G.solidsLive)if(hit(e,s)&&e.y+e.h>s.y+6){e.vx*=-1;e.x+=e.vx*2;break}
      if(e.plat){const ahead={x:e.x+(e.vx>0?e.w:-4),y:e.y+e.h+2,w:4,h:4};let has=false;for(const s of G.solidsLive)if(hit(ahead,s)){has=true;break}if(!has)e.vx*=-1}}
    if(e.y>H+80){e.alive=false;continue}
    if(hit(G.P,e)){if(G.P.vy>0&&G.P.y+G.P.h-e.y<28){if(e.kind==='kappa'){e.kind='shell';e.h=26;e.y+=13;e.vx=0;e.rolling=false;G.P.vy=keys.jump?-9:-6;G.score+=100;burst(e.x+20,e.y,'#3aa94c',16)}else{e.dead=240;e.squash=true;G.P.vy=keys.jump?-9:-6;G.score+=200;sfx('rebote');burst(e.x+20,e.y+20,'#8b5a2b',25);G.shake=3}}
      else if(passThrough){killEnemy(e,G.P.face*5);G.score+=200}
      else hurt()}}
  // ---- G.snakes in bamboo
  for(const sn of G.snakes){if(sn.dead||!sn.pipe)continue;const ph2=(G.t+sn.phase)%240;sn.up=ph2<60?ph2/60:ph2<150?1:ph2<200?(200-ph2)/50:0;
    if(sn.up>0.4){const box={x:sn.x,y:sn.pipe.y-sn.up*40,w:sn.w,h:sn.up*40};if(hit(G.P,box)){if(passThrough||G.P.rush>0){sn.dead=true;G.score+=200;burst(sn.x+20,sn.pipe.y-20,'#4ccf5e',20)}else hurt()}}}
  // ---- G.mortars
  for(const m of G.mortars){if(!m.alive)continue;if(G.sexy>0&&Math.abs(m.x-G.P.x)<520){if(G.t%15==0)G.particles.push({x:m.x+20,y:m.y-6,vx:0,vy:-0.8,life:40,col:'#FF5CC8',g:-0.01,heart:true});continue}if(Math.abs(m.x-G.P.x)<VW*0.8){m.cd--;if(m.cd<=0){m.cd=170;const dir=G.P.x<m.x?-1:1;G.shots.push({x:m.x+12,y:m.y-10,vx:dir*2.6,vy:-6,w:16,h:16,life:300});burst(m.x+20,m.y,'#9aa3b8',8);G.shake=Math.max(G.shake,2)}}}
  for(const sh of G.shots){sh.life--;sh.vy+=0.22;sh.x+=sh.vx;sh.y+=sh.vy;for(const s of G.solidsLive)if(hit(sh,s)){sh.life=0;burst(sh.x,sh.y,'#555',10);if(s.t==='b')breakBlock(s,sh.vx>0?1:-1);break}
    if(sh.life>0&&hit(G.P,sh)){sh.life=0;burst(sh.x,sh.y,'#555',10);if(!(G.P.inv>0||G.P.rush>0||G.P.dash>0))hurt()}}
  G.shots=G.shots.filter(s=>s.life>0&&s.y<H+60);
  // ---- clones: salen del humo, imitan al heroe y se deshacen en humo
  for(const c of G.clones){
    if(c.nace>0){ c.nace--; continue }             // todavia dentro de la nube
    if(c.kick>0){ c.kick--; if(c.kick<=0)c.life=0; continue }
    c.x+=c.vx; c.life--; c.face=c.vx<0?-1:1;
    let enSuelo=false;
    for(const sd of G.solidsLive)
      if(c.x+40>sd.x&&c.x<sd.x+sd.w&&c.y+90>=sd.y&&c.y+90<=sd.y+12){enSuelo=true;c.y=sd.y-90}
    if(!enSuelo)c.y+=4;
    for(const e of G.enemies)
      if(e.alive&&!e.dead&&e.kind!=='shell'&&hit({x:c.x,y:c.y,w:40,h:90},e)){
        killEnemy(e,c.vx>0?5:-5); G.score+=200;
        c.kick=13;                                  // remata con la patada
        break;
      }
  }
  G.clones=G.clones.filter(c=>{
    if(c.life>0&&c.y<H+50)return true;
    spawnFX('humo',c.x+20,c.y+45,2.6);              // siempre se van en humo
    return false;
  });
  // ---- G.summon beast: enters, stands by Kage, then charges
  if(G.summon){G.summon.life--;
    if(G.summon.stage===0){G.summon.x+=G.summon.vx;if(G.summon.x>=G.P.x-600){G.summon.stage=1;G.summon.wait=90;G.shake=10;for(let i=0;i<40;i++)G.particles.push({x:G.summon.x+100+Math.random()*400,y:H-2*TILE-Math.random()*60,vx:(Math.random()-.5)*3,vy:-2-Math.random()*4,life:60,col:Math.random()<.5?'#FFFFFF':'#DFF6FF',g:-0.02});hitstop(18)}}
    else if(G.summon.stage===1){G.summon.wait--;if(G.t%20==0)G.shake=Math.max(G.shake,3);if(G.summon.wait<=0){G.summon.stage=2;G.summon.vx=9;doFlash(.5,80)}}
    else{G.summon.x+=G.summon.vx;if(G.t%3==0)G.shake=Math.max(G.shake,5);if(G.t%10==0)crater(G.summon.x+280,H-2*TILE)}
    const bb={x:G.summon.x+90,y:H-2*TILE-400,w:400,h:400};
    for(const e of G.enemies)if(e.alive&&!e.dead&&hit(bb,e)){killEnemy(e,7);G.score+=150}
    for(const m of G.mortars)if(m.alive&&hit(bb,m))killMortar(m);
    if(G.summon.stage===2)for(const s of G.solidsLive.slice())if(hit(bb,s)&&s.t!=='g')breakBlock(s,1);
    if(G.summon.life<=0||G.summon.x>G.cam+VW+700)G.summon=null}
  // ---- golden G.beam + G.ring
  // ---- esfera de chakra: en la mano (F1-F2) o lanzada (F3-F4)
  if(G.orb){
    const o=G.orb;
    const rc=o.rc||o.r;
    const caja=()=>({x:o.x-rc,y:o.y-rc,w:rc*2,h:rc*2});
    if(o.tipo==='mano'){
      o.x=G.P.x+20+G.P.face*(38+o.r*0.45); o.y=G.P.y+45; o.dir=G.P.face; o.vida--;
      const c=caja(); let choco=false;
      for(const e of G.enemies)if(e.alive&&!e.dead&&hit(c,e)){killEnemy(e,o.dir*6);G.score+=200;choco=true}
      for(const m of G.mortars)if(m.alive&&hit(c,m)){killMortar(m);choco=true}
      for(const s2 of G.solidsLive.slice())if(hit(c,s2)&&s2.t!=='g'){breakBlock(s2,o.dir);choco=true}
      if(G.t%2==0)G.particles.push({x:o.x+(Math.random()-.5)*o.r,y:o.y+(Math.random()-.5)*o.r,
        vx:0,vy:-1,life:14,col:'#C6F4FC',g:0});
      if(o.vida<=0||(choco&&G.form===0))G.orb=null;
    }else{
      o.x+=o.dir*o.vel; o.rec+=o.vel; o.giro+=0.45;
      const c=caja(); let detona=false;
      for(const e of G.enemies)if(e.alive&&!e.dead&&hit(c,e)&&!o.golpeados.includes(e)){
        o.golpeados.push(e); killEnemy(e,o.dir*7); G.score+=200}
      for(const m of G.mortars)if(m.alive&&hit(c,m))killMortar(m);
      for(const s2 of G.solidsLive.slice())if(hit(c,s2)){
        if(s2.t==='g')detona=true;
        else{ breakBlock(s2,o.dir); if(o.tipo==='proyectil')detona=true }
      }
      if(G.t%2==0)G.particles.push({x:o.x,y:o.y+(Math.random()-.5)*o.r,vx:-o.dir*2,
        vy:(Math.random()-.5)*2,life:16,col:o.tipo==='cuchilla'?'#E8B64A':'#7FD8F0',g:0});
      if(o.rec>=o.alcance)detona=true;
      if(o.x<G.cam-240||o.x>G.cam+VW+240)detona=true;
      if(detona){
        if(o.tipo==='cuchilla'&&o.expansionR>0){
          G.expansion={x:o.x,y:o.y,r:0,max:o.expansionR,life:26};
          hitstop(15); doFlash(.6,260); G.shake=14; sfx('explosion');
        }else{ burst(o.x,o.y,'#C6F4FC',26,10); sfx('romper'); G.shake=Math.max(G.shake,6) }
        G.orb=null;
      }
    }
  }
  // ---- expansion de la cuchilla de chakra
  if(G.expansion){
    const ex=G.expansion; ex.life--; ex.r=Math.min(ex.max,ex.r+ex.max/10);
    const c={x:ex.x-ex.r,y:ex.y-ex.r,w:ex.r*2,h:ex.r*2};
    for(const e of G.enemies)if(e.alive&&!e.dead&&hit(c,e)){killEnemy(e,Math.sign(e.x-ex.x)*8);G.score+=200}
    for(const m of G.mortars)if(m.alive&&hit(c,m))killMortar(m);
    for(const s2 of G.solidsLive.slice())if(hit(c,s2)&&s2.t!=='g')breakBlock(s2,Math.sign(s2.x-ex.x)||1);
    if(ex.life<=0)G.expansion=null;
  }
  if(G.beam){G.beam.life--;G.beam.w=Math.min(G.beam.w+120,500);G.shake=Math.max(G.shake,6);
    const bx=G.beam.dir>0?G.beam.x:G.beam.x-G.beam.w,bb={x:bx,y:G.beam.y-120,w:G.beam.w,h:240};
    for(const e of G.enemies)if(e.alive&&!e.dead&&hit(bb,e)){killEnemy(e,G.beam.dir*8);G.score+=200}
    for(const m of G.mortars)if(m.alive&&hit(bb,m))killMortar(m);
    for(const s of G.solidsLive.slice())if(hit(bb,s)&&s.t!=='g')breakBlock(s,G.beam.dir);
    for(const sn of G.snakes)if(!sn.dead&&sn.pipe&&hit(bb,{x:sn.x,y:sn.pipe.y-40,w:sn.w,h:40}))sn.dead=true;
    if(G.t%2==0)G.particles.push({x:bx+Math.random()*G.beam.w,y:G.beam.y+(Math.random()-.5)*220,vx:G.beam.dir*3,vy:(Math.random()-.5)*3,life:20,col:Math.random()<.5?'#E8B64A':'#FFF6D0',g:0});
    if(G.beam.life<=0)G.beam=null}
  if(G.ring){G.ring.r+=22;if(G.ring.r>500)G.ring=null}
  for(const c of G.coins){c.life--;c.vy+=0.45;c.x+=c.vx;c.y+=c.vy;c.ph+=0.25;if(c.y>H-2*TILE-6)c.life=0}G.coins=G.coins.filter(c=>c.life>0);
  for(const f of G.fallen)if(f.a<1)f.a=Math.min(1,f.a+0.06);
  G.scorch=G.scorch.filter(s=>s.life-->0);
  // ---- goal
  if(goal&&hit(G.P,goal)){end('¡LLEGASTE AL TORII!','Forma final: '+F.name+'. Puntos: '+(G.score+G.lives*500)+' (incluye bonus por vidas).');return}
  // ---- camera
  {const rel=G.P.x-G.cam;let target=G.cam;if(rel<VW*0.35)target=G.P.x-VW*0.35;else if(rel>VW*0.45)target=G.P.x-VW*0.45;G.cam+=(target-G.cam)*0.35;G.cam=Math.max(0,Math.min(G.cam,COLS*TILE-VW))}
  G.camY=CAMY;
  if(G.shake>0)G.shake--;
  updateFX();
}

export { hit, step, supported, applyGravity, breakBlock, killEnemy, killMortar, bump };

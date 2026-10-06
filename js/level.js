// Mapa del nivel en ASCII y su conversion a objetos del mundo.
import { TILE, H } from './state.js';

// ---------- LEVEL (4 tramos, 172 cols). Floating things keep >= 2 tiles of clearance.
// # ground  = brick  L chakra block  P bamboo  N bamboo with snake  S scroll  b bush  M mortar  o oni  k kappa  T torii
const L=[
"...........................................................................=................................................................................................",
"..........S=.........................S.......................S............L............S...........................S...........=L=...........S..............................",
"........===.=......................====.......................=..........=............====.......................=............................................=L=...........",
"......................==...................................................L...........................L....................................................................",
"...........L...........S....................S.L........===.......S........L............S.......==.....L.S................S.....===.......S..........==..........S....T......",
"............................................................................................................................................................................",
"..........o......P.........b....o.P............b..N.....k....P....M....k..........bN...M.k...P....o.N....k...M........o.P..N..M..k...P..k...o....M.Nk....P......b...........",
"#########################################...#################################...##################################...########################...############################",
"#########################################...#################################...##################################...########################...############################",
];
const ROWS=L.length,COLS=L[0].length;
const solids=[],scrolls0=[],enemies0=[],bushes=[],snakes0=[],mortars0=[];let goal=null;
for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){const ch=L[r][c],x=c*TILE,y=H-(ROWS-r)*TILE;
  if(ch==='#')solids.push({x,y,w:TILE,h:TILE,t:'g'});
  else if(ch==='=')solids.push({x,y,w:TILE,h:TILE,t:'b'});
  else if(ch==='L')solids.push({x,y,w:TILE,h:TILE,t:'l'});
  else if(ch==='P'||ch==='N'){const h=TILE*3;const s={x:x-6,y:y+TILE-h,w:TILE+12,h,t:'p'};solids.push(s);if(ch==='N')snakes0.push({px:s.x,py:s.y,x:s.x+9,w:42,phase:Math.random()*200,up:0})}
  else if(ch==='b')bushes.push({x,y});
  else if(ch==='S')scrolls0.push({x:x+12,y:y+8,w:24,h:32,got:false});
  else if(ch==='M')mortars0.push({x:x+4,y:y+TILE-42,w:40,h:42,cd:120+Math.random()*60,alive:true,hp:2});
  else if(ch==='o')for(let i=0;i<2+(c>80?1:0);i++)enemies0.push({kind:'oni',x:x+i*46,y:y+TILE-39,w:42,h:39,vx:1.1,alive:true});
  else if(ch==='k')enemies0.push({kind:'kappa',x,y:y+TILE-39,w:42,h:39,vx:0.9,alive:true});
  else if(ch==='T')goal={x,y:y-TILE*2,w:TILE,h:TILE*3};
}
for(const c of [56,98,129])enemies0.push({kind:'oni',x:c*TILE,y:H-5*TILE-39,w:42,h:39,vx:0.8,alive:true,plat:true});

export { L, ROWS, COLS, solids, scrolls0, enemies0, bushes, snakes0, mortars0, goal };

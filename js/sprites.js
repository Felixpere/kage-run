// Pixel art dibujado en codigo y carga de los PNG del pack.
import { FORMS } from './state.js';

const SC=3;
const PAL={k:'#1b1b2a',w:'#f6f1e6',s:'#f1c9a0',r:'#d93a3a',o:'#ff7a1a',c:'#3ee6ff',y:'#ffd166',g:'#2f7d3a',G:'#5ac85a',d:'#8a5a2b',D:'#5a3617',t:'#b5783a',T:'#8c5a26',m:'#6b7280',p:'#f7a8c4',n:'#2a2f45',e:'#e8e4d8'};
function sprite(rows,colorMap,sc){sc=sc||SC;const h=rows.length,w=Math.max(...rows.map(r=>r.length)),c=document.createElement('canvas');c.width=w*sc;c.height=h*sc;const x=c.getContext('2d');
  for(let j=0;j<h;j++)for(let i=0;i<rows[j].length;i++){const ch=rows[j][i];if(ch==='.')continue;x.fillStyle=(colorMap&&colorMap[ch])||PAL[ch]||ch;x.fillRect(i*sc,j*sc,sc,sc)}return c}
const NB=[
"...hh.hh.h..",
"..hhhhhhhh..",
".hhhhhhhhhh.",
".AAAPPPPAAA.",
".ssseessess.",
".sssssssss..",
"..ssskksss..",
"...CCCCCC...",
"..CooooooC..",
".CoooAAoooC.",
".soooAAooos.",
".soOooooOos.",
"..OooooooO..",
"...bb..bb...",
"...bb..bb...",
"...bb..bb...",
"...dd..dd...",
"..ddd..ddd.."];
const NR1=NB.slice(0,13).concat(["...bb...bb..","...bb....bb.","..bb.....bb.","..dd......dd",".ddd........"]);
const NR2=NB.slice(0,13).concat(["..bb...bb...",".bb....bb...",".bb.....bb..","dd......dd..","........ddd."]);
const NJ=NB.slice(0,13).concat(["..bb....bb..",".bb......bb.",".bb......bb.",".dd......dd.","............"]);
const NK=NB.slice(0,8).concat(["..CooooooC..",".CoooAAoooss",".soooAAooo..",".soOooooOos.","..OooooooO..","...bb..bbbb.","...bb....ddd","...bb.......","...dd.......","..ddd......."]);
const NC=NB.slice(0,7).concat(["...CCCCCC...","ssCooooooCss","..CoooAAoC..",".CoooAAoooC.",".CoOooooOoC.","..OooooooO..","...bb..bb...","...bb..bb...","...bb..bb...","...dd..dd...","..ddd..ddd.."]);
function ninjaSet(f,alt){const F=FORMS[f];const cm=alt?{A:'#FF5CC8',P:'#e8d8ff',h:'#f6f1e6',e:'#FF5CC8',s:'#f8e0c8',k:'#1b1b2a',C:'#4a2a7a',o:'#2a1a4a',O:'#1a0f2e',b:'#4a2a7a',d:'#1b1b2a'}
  :{A:F.col,P:'#c9d1e0',h:f===3?'#FFE07A':'#EAC867',e:f>=2?F.col:'#2B1A10',s:'#F6D3A8',k:'#2B1A10',C:f===2?'#A8332A':f===3?'#E8B64A':'#2B1A10',o:f===2?'#2B1A10':f===3?'#F7D59D':'#E0701A',O:f===2?'#1a0f08':f===3?'#E8B64A':'#9C4406',b:f===2?'#2B1A10':f===3?'#F7D59D':'#FF8A2B',d:'#2B1A10'};
  const S5=5;return{idle:sprite(NB,cm,S5),run1:sprite(NR1,cm,S5),run2:sprite(NR2,cm,S5),jump:sprite(NJ,cm,S5),kick:sprite(NK,cm,S5),charge:sprite(NC,cm,S5)}}
const NINJAS=[0,1,2,3].map(f=>ninjaSet(f,false));const HENGE=ninjaSet(1,true);
const DANCER=(()=>{const cm={A:'#D4503A',P:'#FFF6D0',h:'#2B1A10',e:'#2B1A10',s:'#F6D3A8',k:'#2B1A10',C:'#FF5CC8',o:'#FFD6E8',O:'#FF9ACD',b:'#FFD6E8',d:'#D4503A'};const S5=5;return{idle:sprite(NB,cm,S5),charge:sprite(NC,cm,S5)}})();
const ONI=sprite(["..w........w..","..ww......ww..","...RRRRRRRR...","..RRRRRRRRRR..",".RRkRRRRRRkRR.",".RRwwkRRkwwRR.",".RRRRRRRRRRRR.",".RRRkkkkkkRRR.","..RRRwRwRwRR..","...RRRRRRRR...","...kyykyykk...","...RR....RR...","..kkk....kkk.."],{R:'#d23a2e',w:'#ffffff',k:'#1b1b2a',y:'#ffd166'});
const ONI2=sprite(["..w........w..","..ww......ww..","...RRRRRRRR...","..RRRRRRRRRR..",".RRkRRRRRRkRR.",".RRwwkRRkwwRR.",".RRRRRRRRRRRR.",".RRRkkkkkkRRR.","..RRRwRwRwRR..","...RRRRRRRR...","...kyykyykk...","..RR......RR..",".kkk......kkk."],{R:'#d23a2e',w:'#ffffff',k:'#1b1b2a',y:'#ffd166'});
const KAPPA=sprite([".....gggg.....","....gwwwwg....","...ggwwwwgg...","...gGGGGGGg...","..GGkGGGGkGG..","..GGGGyyGGGG..","..GGGGGGGGGG..",".SSSSSSSSSSSS.","SSsSSsSSsSSsSS","SSSSSSSSSSSSSS",".SSsSSsSSsSSS.","..GGGG..GGGG..","..kkk....kkk.."],{g:'#2f8f48',G:'#5ad45f',w:'#e8f6ff',k:'#1b1b2a',y:'#ffd166',S:'#8a5a2b',s:'#5a3617'});
const SHELL=sprite([".SSSSSSSSSSSS.","SSsSSsSSsSSsSS","SSSSSSSSSSSSSS","SSsSSsSSsSSsSS","SSSSSSSSSSSSSS",".SSsSSsSSsSSS.","..kkkkkkkkkk..",".............."],{S:'#8a5a2b',s:'#5a3617',k:'#1b1b2a'});
const SNAKE=sprite(["...GGGGG......","..GGwkGGG.....","..GGGGGGGGr...","..GGGGGGGG....","....GGGG......","....GGGG......","...GGGGG......","...GGGGG......","....GGGG......","....GGGG......","...GGGGG......","...GGGGG......","....GGGG......","....GGGG......"],{G:'#4ccf5e',w:'#ffffff',k:'#1b1b2a',r:'#ff3b5c'});
const MORTAR=sprite(["....mmmmmm....","...mmnnnnmm...","..mmnnnnnnmm..",".mmnnnnnnnnmm.",".mmmmmmmmmmmm.",".mmmmmmmmmmmm.","mmmmmmmmmmmmmm","mmmmnmmmmnmmmm","mmmmmmmmmmmmmm","nnnnnnnnnnnnnn","mmmmmmmmmmmmmm","mmmmmmmmmmmmmm","nnnnnnnnnnnnnn","nnnnnnnnnnnnnn"],{m:'#8a8f9a',n:'#3a3f4a'});
const SCROLL=sprite(["rrrrrrrr","ereeeeer","e.cc.c.e","e.c.cc.e","e.cc.c.e","e......e","e.c..cc.","e.cc.c.e","e......e","ereeeeer","rrrrrrrr"]);
const GROUND=sprite(["L.LL.L.LL.L.LL.L","LLLLLLLLLLLLLLLL","GGGLGGGGGGGLGGGG","GGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGG","gGGGGGGgGGGGGGGg","gggggggggggggggg","dddddddddddddddd","ddddttddddddddtt","dddddddddddddddd","dddddddddddddddd","ddddddddddttdddd","dddddddddddddddd","ttdddddddddddddd","dddddddddddddddd","DDDDDDDDDDDDDDDD"],{L:'#3FBF3A',G:'#1D9A2A',g:'#0E6B22',d:'#CC7923',t:'#E09A3C',D:'#8F4E16'});
const DIRT=sprite(["dddddddddddddddd","ddttdddddddddddd","dddddddddddttddd","dddddddddddddddd","dddddddddddddddd","ddddddddttdddddd","dddddddddddddddd","ttdddddddddddddd","dddddddddddddddd","ddddddttdddddddd","dddddddddddddddd","dddddddddddddddd","ddttddddddddttdd","dddddddddddddddd","dddddddddddddddd","DDDDDDDDDDDDDDDD"],{d:'#CC7923',t:'#E09A3C',D:'#8F4E16'});
const BLOCK=sprite(["nnnnnnnnnnnnnnnn","nLLLLLLLnLLLLLLL","nMMMMMMLnMMMMMML","nMMMMMMLnMMMMMML","nMMMMMMMnMMMMMMM","nnnnnnnnnnnnnnnn","nLLLLLLLnLLLLLLL","nMMMMMMLnMMMMMML","nMMMMMMLnMMMMMML","nMMMMMMMnMMMMMMM","nnnnnnnnnnnnnnnn","nLLLLLLLnLLLLLLL","nMMMMMMLnMMMMMML","nMMMMMMLnMMMMMML","nMMMMMMMnMMMMMMM","nnnnnnnnnnnnnnnn"],{L:'#A85C34',M:'#864A2A',n:'#4A2414'});
const LANTERN=sprite(["kkkkkkkkkkkkkkkk","kyyyyyyyyyyyyyyk","kyYYYYYYYYYYYYyk","kyYYYYYccYYYYYyk","kyYYYYccccYYYYyk","kyYYYccYYccYYYyk","kyYYccYYYYccYYyk","kyYccYYwwYYccYyk","kyYccYYwwYYccYyk","kyYYccYYYYccYYyk","kyYYYccYYccYYYyk","kyYYYYccccYYYYyk","kyYYYYYccYYYYYyk","kyyyyyyyyyyyyyyk","kkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkk"],{k:'#6B4408',y:'#F2D45C',Y:'#D9A227',c:'#7FD8F0',w:'#FFFFFF'});
const USED=sprite(["DDDDDDDDDDDDDDDD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DnnnnnnnnnnnnnnD","DDDDDDDDDDDDDDDD","DDDDDDDDDDDDDDDD","DDDDDDDDDDDDDDDD"],{D:'#6B4408',n:'#CC852C'});
const ONIGIRI=sprite(["...wwww..","..wwwwww.",".wwwwwwww","wwwwwwwww","wwwwwwwww","wwwkkkwww","wwwkkkwww","wwwkkkwww","wwwwwwwww"],{w:'#ffffff',k:'#1d3b1d'});
const BUSH=sprite(["........GGGG............",".....GGGGGGGGG..........","...GGGGGGGGGGGGGGGG.....","..GGGGgGGGGGGgGGGGGGG...",".GGGGGGGGGGGGGGGGGGGGG..","GGGGgGGGGGGGGGGGgGGGGGG.","GGGGGGGGGGGGGGGGGGGGGGGG","GGGGGGGGGGGGGGGGGGGGGGGG","gGGGGGGGGgGGGGGGGGGGGGGg","gggggggggggggggggggggggg"],{G:'#45CB50',g:'#1D9A2A'});
const CLOUD=sprite(["......wwww..........","....wwwwwwww....ww..","..wwwwwwwwwwww.wwww.",".wwwwwwwwwwwwwwwwww.","wwwwwwwwwwwwwwwwww..","wwwwwwwwwwwwwwwwwwww",".mmmmmmmmmmmmmmmmmm.","..ssssssssssssssss.."],{w:'#FFFFFF',m:'#DFF6FF',s:'#BFF0FC'});
const BEAST=(()=>{const rows=[".......RR..........RR....","......RRRR........RRRR...",".....RRRRRR......RRRRRR..","....RRRRRRRRRRRRRRRRRRRR.","...RRRRRRRRRRRRRRRRRRRRRR","..RRRwwRRRRRRRRRRRRRwwRRR","..RRRkwRRRRRRRRRRRRRkwRRR",".RRRRRRRRRRRRRRRRRRRRRRRR",".RRRRRRRRRRRRRRRRRRRRRRR.","RRRRRRRRRRRRRRRRRRRRRRR..","RRRRwwwwwwRRRRRRRRRRRR...","RRRRwkwkwkRRRRRRRRRRRRR..",".RRRRRRRRRRRRRRRRRRRRRRR.","..RRRRRRRRRRRRRRRRRRRRRRR","...RRRRRRRRRRRRRRRRRRRRRR","....RRRRRRRRRRRRRRRRRRRR.",".....RRR....RRR....RRR...",".....RRR....RRR....RRR...","....RRRR...RRRR...RRRR...","....kkkk...kkkk...kkkk..."];
  const c=document.createElement('canvas');c.width=300;c.height=252;const x=c.getContext('2d');
  for(let j=0;j<rows.length;j++)for(let i=0;i<rows[j].length;i++){const ch=rows[j][i];if(ch==='.')continue;x.fillStyle=ch==='R'?'#c8312e':ch==='w'?'#ffffff':'#1b1b2a';x.fillRect(i*12,j*12,12,12)}
  x.fillStyle='#a3241f';x.fillRect(60,170,120,30);return c})();

// ---------- Assets from "Ninja Adventure" asset pack by pixel-boy (CC0) ----------
function img(file){const i=new Image();i.src='assets/sprites/'+file;return i}
const FROG={idle:img('frog_idle.png'),jump:img('frog_jump.png'),attack:img('frog_attack.png')};
const ONIGIRI_IMG=img('onigiri.png'),SCROLL_IMG=img('scroll.png');
function mkTile(fn){const c=document.createElement('canvas');c.width=48;c.height=48;const x=c.getContext('2d');fn(x);return c}
function bricks(x,base,light,joint,bw,bh,y0,y1){x.fillStyle=base;x.fillRect(0,y0,48,y1-y0);for(let r=0,yy=y0;yy<y1;r++,yy+=bh){const off=(r%2)*(bw/2);for(let xx=-bw;xx<48+bw;xx+=bw){x.fillStyle=light;x.fillRect(xx+off+1,yy+1,bw-3,2);x.fillStyle=joint;x.fillRect(xx+off,yy,1,bh);x.fillRect(xx+off,yy+bh-1,bw,1)}}}
const GROUND2=mkTile(x=>{bricks(x,'#CC7923','#E09A3C','#8F4E16',24,12,22,48);x.fillStyle='#1D9A2A';x.fillRect(0,0,48,22);x.fillStyle='#3FBF3A';x.fillRect(0,0,48,8);for(let i=0;i<48;i+=6){x.fillRect(i,8,3,3+(i%12?2:0))}x.fillStyle='#0E6B22';x.fillRect(0,18,48,4);for(let i=3;i<48;i+=9)x.fillRect(i,14,2,4);x.fillStyle='#8F4E16';x.fillRect(0,22,48,1)});
const DIRT2=mkTile(x=>{bricks(x,'#CC7923','#E09A3C','#8F4E16',24,12,0,48)});
const BLOCK2=mkTile(x=>{bricks(x,'#864A2A','#A85C34','#4A2414',24,12,0,48);x.strokeStyle='#4A2414';x.lineWidth=2;x.strokeRect(1,1,46,46)});

export { SC, PAL, sprite, NINJAS, HENGE, DANCER, ONI, ONI2, KAPPA, SHELL, SNAKE, MORTAR,
         SCROLL, GROUND, DIRT, BLOCK, LANTERN, USED, ONIGIRI, BUSH, CLOUD, BEAST,
         FROG, ONIGIRI_IMG, SCROLL_IMG, mkTile, bricks, GROUND2, DIRT2, BLOCK2 };

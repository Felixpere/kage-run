// Dibujado: fondo, mundo, jugador y HUD.
import { G, ctx, FORMS, W, CH, H, TILE, ZOOM, VW, VH, BOTTOM_PAD } from './state.js';
import { COLS, bushes, scrolls0, goal } from './level.js';
import { NINJAS, HENGE, DANCER, ONI, ONI2, KAPPA, SHELL, SNAKE, MORTAR, LANTERN, USED,
         GROUND2, DIRT2, BLOCK2, FROG, ONIGIRI_IMG, SCROLL_IMG } from './sprites.js';
import { dust } from './fx.js';

function drawBamboo(x,y,w,h){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#1a7a28');g.addColorStop(0.25,'#35C94A');g.addColorStop(0.55,'#239F32');g.addColorStop(1,'#0F5C1C');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.fillStyle='#2B1A10';ctx.fillRect(x-1,y,1,h);ctx.fillRect(x+w,y,1,h);ctx.fillStyle='#45d85a';ctx.fillRect(x,y,w,6);ctx.fillStyle='#0F5C1C';ctx.fillRect(x,y+6,w,3);ctx.fillStyle='#2B1A10';ctx.fillRect(x+Math.round(w/2)-2,y+16,4,h-22);ctx.fillStyle='#0F5C1C';for(let yy=y+40;yy<y+h-10;yy+=36)ctx.fillRect(x+4,yy,w-8,2)}
function glow(x,y,r,col){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col+'ff');g.addColorStop(0.5,col+'88');g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}

function draw(){
  const sky=ctx.createLinearGradient(0,0,0,CH);sky.addColorStop(0,'#DFEEFF');sky.addColorStop(0.45,'#9CCBE8');sky.addColorStop(1,'#5F9CBE');ctx.fillStyle=sky;ctx.fillRect(0,0,W,CH);
  const gS=(H-2*TILE-G.camY)*ZOOM;
  // far hills
  for(let i=0;i<10;i++){const hx=((i*560-G.cam*0.85)%(560*10)+5600)%5600-280;smoothHill(hx,gS,330,120+(i%3)*45,'#2E9A68','#1F7E52')}
  // clouds (big, puffy, flat bottom, cool shadow)
  for(let i=0;i<9;i++){const cx=((i*430-G.cam)%(430*9)+3870)%3870-150,cy=40+(i%3)*58;cloud(cx,cy,1+(i%3)*0.25)}
  // near hills
  for(let i=0;i<10;i++){const hx=((i*560+280-G.cam)%(560*10)+5600)%5600-280;smoothHill(hx,gS,250,90+(i%2)*45,'#3FB874','#2E9A68')}
  ctx.save();ctx.scale(ZOOM,ZOOM);const sx=G.shake?(Math.random()-0.5)*G.shake:0,sy2=G.shake?(Math.random()-0.5)*G.shake:0;ctx.translate(-Math.round(G.cam)+sx,-Math.round(G.camY)+sy2);
  ctx.fillStyle='#8a4a1a';ctx.fillRect(G.cam-10,H,VW+20,BOTTOM_PAD+40);
  for(const b of bushes){ctx.fillStyle='#1D9A2A';ctx.beginPath();ctx.arc(b.x+10,b.y+TILE-10,16,0,7);ctx.arc(b.x+30,b.y+TILE-16,20,0,7);ctx.arc(b.x+50,b.y+TILE-10,15,0,7);ctx.fill();ctx.fillStyle='#45CB50';ctx.beginPath();ctx.arc(b.x+12,b.y+TILE-14,10,0,7);ctx.arc(b.x+30,b.y+TILE-22,13,0,7);ctx.arc(b.x+48,b.y+TILE-14,9,0,7);ctx.fill()}
  for(const f of G.fallen){ctx.save();ctx.translate(f.x+(f.dir>0?f.w:0),f.y+f.h);ctx.rotate(f.dir*f.a*Math.PI/2);drawBamboo(f.dir>0?-f.w+6:6,-f.h,f.w-12,f.h);ctx.restore()}
  for(const c of G.craters){ctx.fillStyle='#b06a2a';ctx.beginPath();ctx.ellipse(c.x,c.y,22,7,0,0,7);ctx.fill();ctx.fillStyle='#5a2a08';ctx.beginPath();ctx.ellipse(c.x,c.y+1,14,4,0,0,7);ctx.fill()}
  for(const m of G.mounds){ctx.fillStyle='#c27a3a';ctx.beginPath();ctx.ellipse(m.x,m.y,18,9,0,Math.PI,0);ctx.fill();ctx.fillStyle='#8a4a1a';ctx.fillRect(m.x-6,m.y-7,5,4);ctx.fillRect(m.x+4,m.y-5,4,3)}
  for(const s of G.scorch){ctx.globalAlpha=Math.min(1,s.life/300)*0.7;ctx.fillStyle='#3a1c0a';ctx.fillRect(s.x-10,s.y-3,20,4);ctx.globalAlpha=1}
  for(const sn of G.snakes){if(sn.dead||!sn.pipe||sn.up<=0)continue;const hgt=sn.up*42;ctx.save();ctx.beginPath();ctx.rect(sn.x-4,sn.pipe.y-hgt-2,sn.w+8,hgt+2);ctx.clip();ctx.drawImage(SNAKE,sn.x,sn.pipe.y-hgt);ctx.restore()}
  for(const s of G.solidsLive){if(s.x+s.w<G.cam||s.x>G.cam+VW)continue;
    if(s.t==='g')ctx.drawImage(s.y>=H-TILE?DIRT2:GROUND2,s.x,s.y);else if(s.t==='b')ctx.drawImage(BLOCK2,s.x,s.y);else if(s.t==='l')ctx.drawImage(LANTERN,s.x,s.y);else if(s.t==='u')ctx.drawImage(USED,s.x,s.y);else drawBamboo(s.x+6,s.y,s.w-12,s.h)}
  for(const m of G.mortars){if(!m.alive)continue;ctx.drawImage(MORTAR,m.x,m.y);if(m.hp<2){ctx.fillStyle='#3a3f4a';ctx.fillRect(m.x+10,m.y+14,4,12);ctx.fillRect(m.x+22,m.y+22,10,3)}}
  if(goal){const g=goal;ctx.fillStyle='#c42b24';ctx.fillRect(g.x-2,g.y+14,12,g.h-14);ctx.fillRect(g.x+g.w-10,g.y+14,12,g.h-14);ctx.fillStyle='#1b1b2a';ctx.fillRect(g.x-20,g.y,g.w+40,8);ctx.fillStyle='#c42b24';ctx.fillRect(g.x-16,g.y+8,g.w+32,10);ctx.fillRect(g.x-6,g.y+30,g.w+12,8);ctx.fillStyle='#ffd166';ctx.fillRect(g.x+g.w/2-8,g.y+18,16,12)}
  for(const s of G.scrolls){if(s.got)continue;ctx.imageSmoothingEnabled=false;ctx.drawImage(SCROLL_IMG,s.x-8,s.y-4+Math.sin(G.t/12)*4,42,42)}
  for(const it of G.items){ctx.imageSmoothingEnabled=false;ctx.drawImage(ONIGIRI_IMG,it.x-5,it.y-10,36,36)}
  for(const c of G.coins){const w=Math.abs(Math.cos(c.ph))*16+3;ctx.fillStyle='#6B4408';ctx.fillRect(c.x-w/2-1,c.y-9,w+2,18);ctx.fillStyle='#F2D45C';ctx.fillRect(c.x-w/2,c.y-8,w,16);ctx.fillStyle='#D9A227';ctx.fillRect(c.x-w/2+2,c.y-4,Math.max(1,w-4),8)}
  for(const sh of G.shots){ctx.fillStyle='#2a2f45';ctx.beginPath();ctx.arc(sh.x+8,sh.y+8,8,0,7);ctx.fill();ctx.fillStyle='#ff8c1a';ctx.fillRect(sh.x+4,sh.y-6,3,6)}
  for(const e of G.enemies){if(!e.alive)continue;let sp=e.kind==='kappa'?KAPPA:e.kind==='shell'?SHELL:(Math.floor(G.t/10)%2?ONI:ONI2);ctx.save();
    if(e.dead&&e.squash){ctx.globalAlpha=Math.min(1,e.dead/40);ctx.translate(e.x,e.y+e.h-15);ctx.scale(1,0.38);ctx.drawImage(sp,0,0);ctx.globalAlpha=1}
    else if(e.dead){ctx.translate(e.x+21,e.y+20);ctx.rotate(e.dead*0.3);ctx.drawImage(sp,-21,-20)}
    else if(e.kind==='shell'&&e.rolling){ctx.translate(e.x+21,e.y+13);ctx.rotate(G.t*0.5*(e.vx>0?1:-1));ctx.drawImage(sp,-21,-13)}
    else if(e.vx>0){ctx.translate(e.x+e.w,e.y);ctx.scale(-1,1);ctx.drawImage(sp,0,0)}else ctx.drawImage(sp,e.x,e.y);ctx.restore()}
  for(const d of G.debris){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot);if(d.bamboo){drawBamboo(-d.sz/2,-d.sz,d.sz,d.sz*2)}else{ctx.fillStyle=d.col;ctx.fillRect(-d.sz/2,-d.sz/2,d.sz,d.sz)}ctx.restore()}
  if(G.summon){const sc=11,fw=40*sc;const sheet=G.summon.stage===0?FROG.jump:G.summon.stage===1?FROG.idle:FROG.attack;const nf=sheet.width/40||1;const fr=Math.floor(G.t/(G.summon.stage===2?5:9))%nf;
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(G.summon.x+290,H-2*TILE);if(G.summon.vx<0||false){}ctx.drawImage(sheet,fr*40,0,40,40,-fw/2,-fw,fw,fw);ctx.restore();
    if(G.summon.stage===2&&G.t%2==0)dust(G.summon.x+200+Math.random()*200,H-2*TILE,2)}
  for(const c of G.clones){ctx.globalAlpha=0.6+0.3*Math.sin(G.t/3);ctx.save();if(c.vx<0){ctx.translate(c.x+60,c.y);ctx.scale(-1,1);ctx.drawImage(NINJAS[G.form].run1,0,0)}else ctx.drawImage(Math.floor(G.t/6)%2?NINJAS[G.form].run1:NINJAS[G.form].run2,c.x,c.y);ctx.restore();ctx.globalAlpha=1}
  if(G.beam){const a=Math.min(1,G.beam.life/8);ctx.save();ctx.globalAlpha=a*0.9;ctx.translate(G.beam.x,G.beam.y);ctx.scale(G.beam.dir,1);ctx.rotate(-0.5);
    const prog=Math.min(1,G.beam.w/500);ctx.beginPath();ctx.ellipse(0,0,250*prog,120*prog,0,-Math.PI*0.5,Math.PI*0.5);ctx.ellipse(0,0,170*prog,120*prog,0,Math.PI*0.5,-Math.PI*0.5,true);ctx.closePath();
    ctx.fillStyle='#F7D59D';ctx.fill();ctx.lineWidth=6;ctx.strokeStyle='#E8B64A';ctx.stroke();
    ctx.strokeStyle='#FFF6D0';ctx.lineWidth=5;for(let k=1;k<=4;k++){ctx.beginPath();ctx.ellipse(0,0,(180+k*14)*prog,(60+k*14)*prog,0,-Math.PI*0.45,Math.PI*0.45);ctx.stroke()}ctx.restore()}
  
  if(!(G.P.inv>0&&G.P.aura<=0&&G.charge<=0&&G.henge<=0&&G.P.rush<=0&&Math.floor(G.t/4)%2))drawPlayer();
  for(const p of G.particles){ctx.globalAlpha=Math.min(1,p.life/25);ctx.fillStyle=p.col;if(p.heart){ctx.fillRect(p.x-6,p.y,4,4);ctx.fillRect(p.x+2,p.y,4,4);ctx.fillRect(p.x-8,p.y+4,16,4);ctx.fillRect(p.x-6,p.y+8,12,4);ctx.fillRect(p.x-4,p.y+12,8,4);ctx.fillRect(p.x-2,p.y+16,4,4)}else ctx.fillRect(p.x,p.y,5,5)}ctx.globalAlpha=1;
  ctx.restore();
  if(G.showHud){ctx.font='14px "Press Start 2P",monospace';ctx.textBaseline='top';
    const pd=14;ctx.fillStyle='#2B1A10aa';ctx.fillRect(0,0,W,52);
    hudText('PERG '+G.gotCount+'/'+scrolls0.length,pd,10,'#fff');
    hudText(FORMS[G.form].name+(G.sexy>0?' DISTRACCION':G.henge>0?' HENGE':''),W*0.32,10,(G.henge>0||G.sexy>0)?'#FF5CC8':FORMS[G.form].col);
    hudText('VIDAS '+(G.god?'∞':G.lives),W*0.6,10,G.god?'#3ee6ff':'#fff');
    hudText(String(G.score).padStart(6,'0'),W-pd-86,10,'#ffd166');
    ctx.fillStyle='#0008';ctx.fillRect(pd,32,180,14);ctx.fillStyle=G.charging?'#9ff3ff':'#3ee6ff';ctx.fillRect(pd+2,34,176*G.chakra/100,10);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.strokeRect(pd+.5,32.5,179,13);
    const tramo=Math.min(4,1+Math.floor(G.P.x/(COLS*TILE/4)));hudText('TRAMO '+tramo+'/4',W*0.32,32,'#9aa3b8')}
}
function hudText(txt,x,y,col){ctx.fillStyle='#000';ctx.fillText(txt,x+2,y+2);ctx.fillStyle=col;ctx.fillText(txt,x,y)}
function smoothHill(x,base,w,h,col,shade){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-w,base+4);ctx.bezierCurveTo(x-w*0.7,base-h*0.9,x-w*0.35,base-h,x,base-h);ctx.bezierCurveTo(x+w*0.35,base-h,x+w*0.7,base-h*0.9,x+w,base+4);ctx.closePath();ctx.fill();
  ctx.fillStyle=shade;const spots=[[-0.5,0.3,26,14],[-0.15,0.7,30,16],[0.3,0.45,22,12],[0.55,0.2,16,10],[0.05,0.25,14,9]];for(const [a,b,sw,sh] of spots){ctx.beginPath();ctx.ellipse(x+w*a,base-h*b,sw,sh,0,0,7);ctx.fill()}
  ctx.strokeStyle=shade;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-w*0.78,base-h*0.55);ctx.bezierCurveTo(x-w*0.6,base-h*0.95,x-w*0.3,base-h*1.02,x,base-h*0.98);ctx.stroke()}
function cloud(x,y,k){const r=22*k;ctx.save();ctx.translate(x,y);ctx.fillStyle='#BFF0FC';blob(0,r*0.35,r);ctx.fillStyle='#FFFFFF';blob(0,0,r);ctx.restore()}
function blob(ox,oy,r){ctx.beginPath();ctx.arc(ox,oy+r*0.2,r*0.9,0,7);ctx.arc(ox+r*1.1,oy-r*0.3,r*1.15,0,7);ctx.arc(ox+r*2.4,oy-r*0.1,r*1.0,0,7);ctx.arc(ox+r*3.4,oy+r*0.3,r*0.8,0,7);ctx.rect(ox-r*0.6,oy+r*0.2,r*4.6,r*0.9);ctx.fill()}
function rhill(x,base,w,h,col,shade,spot){const steps=16;for(let i=0;i<steps;i++){const f=i/steps,hw=w*Math.sqrt(1-f*f),hy=base-h*f;ctx.fillStyle=shade;ctx.fillRect(Math.round(x-hw),Math.round(hy-h/steps),Math.round(hw*0.18)+4,Math.ceil(h/steps)+1);ctx.fillStyle=col;ctx.fillRect(Math.round(x-hw*0.82+4),Math.round(hy-h/steps),Math.round(hw*1.82)-4,Math.ceil(h/steps)+1)}
  ctx.fillStyle=shade;const sp=[[-0.45,0.25,18,10],[0.2,0.55,22,12],[-0.1,0.8,14,8],[0.45,0.3,12,8],[-0.25,0.55,10,6]];for(const [a,b,sw,sh] of sp)ctx.fillRect(Math.round(x+w*a),Math.round(base-h*b),sw,sh);ctx.fillStyle=spot;ctx.fillRect(Math.round(x+w*0.05),Math.round(base-h*0.4),8,6)}
function drawPlayer(){
  const F=FORMS[G.form],set=G.sexy>0?DANCER:G.henge>0?HENGE:NINJAS[G.form],col=G.sexy>0?'#FF5CC8':G.henge>0?'#FF5CC8':F.col;
  let sp=set.idle;if(G.sexy>0)sp=Math.floor(G.t/10)%2?set.charge:set.idle;else if(G.charge>0||G.charging)sp=set.charge;else if(G.P.kick>0||G.P.flyKick>0)sp=set.kick;else if(!G.P.ground)sp=set.jump;else if(Math.abs(G.P.vx)>0.5)sp=Math.floor(G.t/(Math.abs(G.P.vx)>4?4:7))%2?set.run1:set.run2;
  const x=Math.round(G.P.x),y=Math.round(G.P.y);
  if(G.P.aura>0||G.form>=2||G.charge>0||G.charging||G.henge>0){const r=G.charge>0?36+((50-G.charge)/50)*50:G.charging?50+Math.sin(G.t/3)*8:56+Math.sin(G.t/4)*5;glow(x+20,y+45,r,col)}
  if(G.form===3&&G.henge<=0){ctx.fillStyle='#ffd34a';for(let i=0;i<3;i++){const a=G.t/6+i*2.1;ctx.fillRect(x+20-G.P.face*56+Math.cos(a)*10-4,y+56+Math.sin(a)*12+i*6,8,8)}}
  if(!G.P.ground&&G.P.vy<2&&G.P.vy>-6){ctx.strokeStyle=col+'aa';ctx.lineWidth=3;ctx.lineWidth=5;ctx.beginPath();ctx.arc(x+20-G.P.face*36,y+80,46,G.P.face>0?Math.PI*1.1:Math.PI*1.6,G.P.face>0?Math.PI*1.45:Math.PI*1.95);ctx.stroke()}
  ctx.fillStyle=col;ctx.fillRect(x+(G.P.face>0?-26:40),y+16+Math.sin(G.t/5)*3,26,5);ctx.fillRect(x+(G.P.face>0?-22:38),y+24+Math.cos(G.t/5)*3,22,5);
  const sprinting=Math.abs(G.P.vx)>6&&G.P.ground&&G.P.dash<=0,sxs=G.P.dash>0?1.3:sprinting?1.15:G.P.land>0?1.12:1,sys=G.P.dash>0?0.55:sprinting?0.9:G.P.land>0?0.86:1;
  if(sprinting){ctx.fillStyle='#9C4406';for(let i=0;i<3;i++)ctx.fillRect(x+20-G.P.face*(34+i*4),y+30+i*18,-G.P.face*22,3)}
  ctx.save();ctx.translate(x+20,y+90);ctx.scale(sxs*(G.P.face<0?-1:1),sys);ctx.drawImage(sp,-30,-90);ctx.restore();
  if(G.sexy>0){const sw=Math.sin(G.t/6);for(const dx of [-34,74]){ctx.save();ctx.translate(x+dx,y+34+sw*6);ctx.rotate(dx<0?-0.6+sw*0.3:0.6-sw*0.3);ctx.fillStyle='#FF5CC8';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,30,Math.PI*1.15,Math.PI*1.85);ctx.closePath();ctx.fill();ctx.fillStyle='#FFF6D0';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,27,Math.PI*(1.2+k*0.17),Math.PI*(1.2+k*0.17)+0.08);ctx.closePath();ctx.fill()}ctx.restore()}
    if(G.t%8==0)G.particles.push({x:x+Math.random()*40,y:y-10,vx:(Math.random()-.5),vy:-1,life:40,col:'#FF5CC8',g:-0.01,heart:true})}
  if(G.P.rush>0){const ox=x+20+G.P.face*62,oy=y+40,R=60;ctx.fillStyle='#2FA6D4';ctx.beginPath();ctx.arc(ox,oy,R,0,7);ctx.fill();ctx.fillStyle='#7FD8F0';ctx.beginPath();ctx.arc(ox,oy,R-5,0,7);ctx.fill();ctx.fillStyle='#C6F4FC';ctx.beginPath();ctx.arc(ox,oy,R-22,0,7);ctx.fill();ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.arc(ox,oy,15,0,7);ctx.fill();
    ctx.strokeStyle='#FFFFFF';ctx.lineWidth=5;for(let k=0;k<2;k++){ctx.beginPath();for(let a=0;a<3.2;a+=0.2){const r=10+a*14,an=a*2.2+G.t/4*(k?-1:1)+k*Math.PI;ctx.lineTo(ox+Math.cos(an)*r,oy+Math.sin(an)*r)}ctx.stroke()}
    for(let k=0;k<5;k++){const an=G.t/5+k*1.26;ctx.fillStyle='#FFFFFF';ctx.fillRect(ox+Math.cos(an)*(R+6)-2,oy+Math.sin(an)*(R*0.6)-2,4,4)}
    ctx.fillStyle='#7FD8F0aa';for(let k=0;k<3;k++)ctx.fillRect(ox-G.P.face*(R+10+k*20),oy-14+k*10,-G.P.face*30,5)}
}
export { draw, drawPlayer, drawBamboo, glow };

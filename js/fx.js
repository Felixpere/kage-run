// Particulas, polvo, destellos, hitstop y marcas del terreno.
import { G, flash } from './state.js';

function burst(x,y,col,n,sp){sp=sp||8;for(let i=0;i<n;i++)G.particles.push({x,y,vx:(Math.random()-.5)*sp,vy:(Math.random()-.8)*sp,life:40,col})}
function dust(x,y,n){for(let i=0;i<n;i++)G.particles.push({x,y,vx:(Math.random()-.5)*4,vy:-Math.random()*2,life:25,col:'#e8d8b8',g:0})}
function doFlash(a,ms){flash.style.opacity=Math.min(0.6,a);setTimeout(()=>flash.style.opacity=0,ms)}
function hitstop(f){G.freeze=Math.max(G.freeze,f)}
function crater(x,y){G.craters.push({x,y});G.mounds.push({x:x+(Math.random()<.5?-36:36),y});if(G.craters.length>40){G.craters.shift();G.mounds.shift()}}

// Avance de particulas y escombros (se llamaba al final de step()).
export function updateFX(){
  G.particles = G.particles.filter(p => (p.life-- > 0));
  for (const p of G.particles) { p.x += p.vx; p.y += p.vy; p.vy += (p.g === undefined ? 0.3 : p.g); }
  G.debris = G.debris.filter(d => d.life-- > 0);
  for (const d of G.debris) { d.x += d.vx; d.y += d.vy; d.vy += 0.4; d.rot += d.vr; }
}
export { burst, dust, doFlash, hitstop, crater };

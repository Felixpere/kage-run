// Estado global, constantes y referencias al DOM.
// Todo lo mutable vive en G para poder compartirlo entre modulos.
export const cv = document.getElementById('c');
export const ctx = cv.getContext('2d');
export const PORTRAIT = matchMedia('(max-width:600px)').matches;
export const W = 960, CH = 480, H = 540, TILE = 48, ZOOM = 1, VW = W, VH = CH;
cv.width = W; cv.height = CH;
document.getElementById('wrap').style.aspectRatio = W / CH;
export const BOTTOM_PAD = 0;
export const CAMY = H - 2 * TILE - Math.round(CH * 0.85);

const $ = id => document.getElementById(id);
export const overlay = $('overlay'), flash = $('flash'), wrap = $('wrap'),
             pad = $('pad'), startBtn = $('start'), legend = $('legend');

export const FORMS = [
  {name:'NIÑO',  col:'#FF8A2B',jump:-13.0,walk:2.2,run:4.6,sprint:8.4},
  {name:'ADULTO',col:'#E0701A',jump:-13.3,walk:2.3,run:4.9,sprint:9.0},
  {name:'SABIO', col:'#D4503A',jump:-13.6,walk:2.4,run:5.2,sprint:9.6},
  {name:'DORADO',col:'#E8B64A',jump:-13.9,walk:2.5,run:5.5,sprint:10.4}];

// La esfera de chakra (Z) evoluciona con la forma. Las distancias van en
// tiles de 48 px; el motor las convierte a pixeles.
//   mano       la esfera se queda en la mano y el heroe embiste
//   proyectil  sale disparada recta y revienta al tocar estructura
//   cuchilla   sale girando, atraviesa todo y detona una expansion al final
export const ORBE = [
  { tipo:'mano',      coste:20, r:30, embestidaTiles:2,  vida:60, parpadeo:true },
  { tipo:'mano',      coste:25, r:60, embestidaTiles:3,  vida:26, parpadeo:false },
  { tipo:'proyectil', coste:30, r:34, vel:9,  alcanceTiles:8 },
  { tipo:'cuchilla',  coste:50, r:40, vel:11, alcanceTiles:16, expansionTiles:5 },
];
// Con la barra llena la tecnica sale a 1,6x gastando el doble.
export const CARGADO_ESC = 1.6;

// Entrada: objetos constantes mutados en sitio, compartidos por todos los modulos.
export const keys = {}, pressed = {}, released = {};

// Estado de partida.
export const G = {
  sexy:0, coins:[], freeze:0, P:null, cam:0, camY:0, scrolls:[], enemies:[],
  form:0, lives:3, score:0, gotCount:0, running:false, t:0, particles:[],
  clones:[], chakra:0, shake:0, debris:[], summon:null, solidsLive:[], fallen:[],
  craters:[], items:[], beam:null, charge:0, runT:0, snakes:[], mortars:[],
  shots:[], scorch:[], mounds:[], orbHold:0, charging:false,
  god:true, showHud:true, ring:null, fx:[], orb:null, expansion:null,
};

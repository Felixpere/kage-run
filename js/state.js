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
  {name:'NOVATO',col:'#E0701A',jump:-13.0,walk:2.2,run:4.6,sprint:8.4},
  {name:'CHAKRA',col:'#7FD8F0',jump:-13.3,walk:2.3,run:4.9,sprint:9.0},
  {name:'SABIO', col:'#D4503A',jump:-13.6,walk:2.4,run:5.2,sprint:9.6},
  {name:'DORADO',col:'#E8B64A',jump:-13.9,walk:2.5,run:5.5,sprint:10.4}];

// Entrada: objetos constantes mutados en sitio, compartidos por todos los modulos.
export const keys = {}, pressed = {}, released = {};

// Estado de partida.
export const G = {
  sexy:0, coins:[], freeze:0, P:null, cam:0, camY:0, scrolls:[], enemies:[],
  form:0, lives:3, score:0, gotCount:0, running:false, t:0, particles:[],
  clones:[], chakra:0, shake:0, debris:[], summon:null, solidsLive:[], fallen:[],
  craters:[], items:[], beam:null, charge:0, runT:0, snakes:[], mortars:[],
  shots:[], scorch:[], mounds:[], henge:0, orbHold:0, charging:false,
  god:true, showHud:true, ring:null, fx:[],
};

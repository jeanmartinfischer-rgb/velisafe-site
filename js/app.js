/* VÉLI SAFE — logique du site (rendu, cartes, réservation, messagerie)
   Chargé par index.html. Scripts classiques, pas de modules :
   le site doit pouvoir s'ouvrir par double-clic, sans serveur local. */

/* ===================== ÉTAT ===================== */
let lang = 'fr';
const panier = {};
const maps = {};

function tr(k){ return (T[lang] && T[lang][k]) || T.fr[k] || k; }
function euros(n){ return n.toLocaleString(lang==='fr'?'fr-FR':lang,{maximumFractionDigits:0}) + ' €'; }
function tarif(v){ return document.getElementById('duree').value==='demi' ? v.demi : v.jour; }

/* disponibilité simulée, stable pour une date donnée */
function dispo(v, dateStr){
  let h=0; const c=dateStr+v.id;
  for(let i=0;i<c.length;i++) h=(h*31+c.charCodeAt(i))%9973;
  return v.stock - (h % (v.stock+1));
}
function dateLisible(){
  const loc = {fr:'fr-FR',en:'en-GB',de:'de-DE',es:'es-ES',it:'it-IT'}[lang];
  return new Date(document.getElementById('date').value+'T12:00:00')
    .toLocaleDateString(loc,{weekday:'long',day:'numeric',month:'long'});
}

/* ===================== RENDU ===================== */
function appliquerLangue(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el=>{ el.textContent = tr(el.dataset.t); });
  document.querySelectorAll('[data-tph]').forEach(el=>{ el.placeholder = tr(el.dataset.tph); });
  const mode=document.getElementById('msg-mode');
  if(mode && mode.textContent) mode.textContent = useS() ? tr('msg.live') : tr('msg.demo');
  if(filCourant && FILS[filCourant]) peindre(FILS[filCourant]);
  rendreTarifs(); rendreVelos(); rendreBalades(); rendreVignoble(); rendreAlsace();
}

function rendreTarifs(){
  document.getElementById('tbody-tarifs').innerHTML = VELOS.map(v=>
    `<tr><td>${v.nom[lang]}</td><td>${euros(v.demi)}</td><td>${euros(v.jour)}</td></tr>`).join('');
}

function rendreVelos(){
  const dateStr = document.getElementById('date').value;
  document.getElementById('liste-velos').innerHTML = VELOS.map(v=>{
    const libre = dispo(v,dateStr);
    if(panier[v.id]>libre) panier[v.id]=libre;
    let st;
    if(libre===0) st=`<span class="stock nul">${tr('book.none')}</span>`;
    else if(libre<=2) st=`<span class="stock bas">${tr('book.left')} ${libre}</span>`;
    else st=`<span class="stock">${libre} ${tr('book.avail')}</span>`;
    return `<div class="velo">
      <div class="ico">${v.ico}</div>
      <div>
        <h3>${v.nom[lang]}</h3>
        <div class="meta">${v.det[lang]}</div>
        ${st}
      </div>
      <div>
        <span class="prix">${euros(tarif(v))}</span>
        ${libre===0?'':`<div class="pas">
          <button type="button" data-m="${v.id}" aria-label="−">−</button>
          <output id="q-${v.id}">${panier[v.id]||0}</output>
          <button type="button" data-p="${v.id}" aria-label="+">+</button>
        </div>`}
      </div>
    </div>`;
  }).join('');
  majRecap();
}

function majRecap(){
  const box = document.getElementById('recap');
  let total=0, html='';
  VELOS.forEach(v=>{
    const q=panier[v.id]||0; if(!q) return;
    const st=q*tarif(v); total+=st;
    html += `<div><span>${q} × ${v.nom[lang]}</span><span>${euros(st)}</span></div>`;
  });
  if(!html) html = `<div style="color:var(--gris)">${tr('book.empty')}</div>`;
  html += `<div class="tot"><span>${tr('book.total')}</span><span>${euros(total)}</span></div>`;
  box.innerHTML = html;
}

function rendreBalades(){
  document.getElementById('liste-balades').innerHTML = BALADES.map(b=>`
    <button class="item" data-balade="${b.id}">
      <h3>${b.nom[lang]}</h3>
      <p>${b.desc[lang]}</p>
      <div class="tags">
        <span class="tag lime">${b.km} km</span>
        <span class="tag">${b.h}</span>
        <span class="tag teal">${tr('lvl.'+(b.lvl==='easy'?'easy':b.lvl==='mid'?'mid':'hard'))}</span>
        ${b.lvl==='hard'?`<span class="tag">${tr('lvl.ebike')}</span>`:''}
      </div>
    </button>`).join('');
}

function rendreVignoble(){
  document.getElementById('liste-vignoble').innerHTML = VIGNOBLE.map(v=>`
    <button class="item" data-vin="${v.id}">
      <h3>${v.nom[lang]}</h3>
      <p>${v.desc[lang]}</p>
      <div class="tags">
        <span class="tag lime">${v.km} km ${tr('from.colmar')}</span>
        <span class="tag teal">${tr('wine.gc')} : ${v.gc}</span>
      </div>
    </button>`).join('');
}

function rendreAlsace(){
  document.getElementById('liste-alsace').innerHTML = ALSACE.map(a=>`
    <button class="item" data-als="${a.id}">
      <h3>${a.nom[lang]}</h3>
      <p>${a.desc[lang]}</p>
    </button>`).join('');
}

/* ===================== CARTES =====================
   Deux moteurs possibles :
   - Google Maps si une clé est renseignée ci-dessous (nécessite un compte
     Google Cloud avec facturation activée, même pour l'usage gratuit) ;
   - sinon, repli automatique sur OpenStreetMap en version sombre, sans clé
     et sans compte. Le rendu et les fonctions sont identiques.
   Pour passer à Google : collez la clé entre les guillemets, rien d'autre. */
const GOOGLE_KEY = "";

const useG = () => GOOGLE_KEY.trim().length > 0;

/* -- style sombre pour Google Maps -- */
const STYLE_SOMBRE = [
 {elementType:"geometry",stylers:[{color:"#1b241a"}]},
 {elementType:"labels.text.stroke",stylers:[{color:"#131a12"}]},
 {elementType:"labels.text.fill",stylers:[{color:"#9aa893"}]},
 {featureType:"administrative",elementType:"geometry",stylers:[{color:"#2e3a2b"}]},
 {featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#c7cfc0"}]},
 {featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#7e8c78"}]},
 {featureType:"poi.park",elementType:"geometry",stylers:[{color:"#22301f"}]},
 {featureType:"road",elementType:"geometry",stylers:[{color:"#2a3527"}]},
 {featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#8d9b87"}]},
 {featureType:"road.highway",elementType:"geometry",stylers:[{color:"#3a4736"}]},
 {featureType:"transit",elementType:"geometry",stylers:[{color:"#243021"}]},
 {featureType:"water",elementType:"geometry",stylers:[{color:"#101c22"}]},
 {featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#4c6670"}]}
];

/* -- tuiles sombres OpenStreetMap (CARTO), sans clé -- */
const TUILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/* -- chargement différé de l'API Google -- */
let gPret=false, gFile=[], gLance=false;
function chargerGoogle(cb){
  if(gPret) return cb();
  gFile.push(cb);
  if(gLance) return;
  gLance = true;
  window.__gInit = ()=>{ gPret=true; gFile.forEach(f=>f()); gFile=[]; };
  const sc=document.createElement('script');
  sc.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_KEY)}&callback=__gInit&language=${lang}&region=FR`;
  sc.async=true;
  sc.onerror=()=>{ console.warn("Google Maps n'a pas pu se charger : repli OpenStreetMap."); };
  document.head.appendChild(sc);
}

/* Leaflet peut être bloqué par certains aperçus intégrés : second CDN, puis message. */
function avecLeaflet(cb){
  if(window.L) return cb();
  if(window.__lFail) return messageCarte();
  const css=document.createElement('link');
  css.rel='stylesheet'; css.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
  document.head.appendChild(css);
  const sc=document.createElement('script');
  sc.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
  sc.onload=()=>cb();
  sc.onerror=()=>{ window.__lFail=true; messageCarte(); };
  document.head.appendChild(sc);
}
function messageCarte(){
  ['map-balades','map-vignoble','map-alsace'].forEach(id=>{
    const el=document.getElementById(id);
    if(el && !el.dataset.msg){
      el.dataset.msg='1'; el.classList.add('vide');
      el.textContent = "Les cartes ont besoin d'une connexion internet. Ouvrez ce fichier directement dans Safari ou Chrome.";
    }
  });
}

function pastilleL(couleur,texte){
  return L.divIcon({className:'',iconSize:[26,26],iconAnchor:[13,13],
    html:`<div style="width:26px;height:26px;border-radius:50%;background:${couleur};color:#fff;
      display:flex;align-items:center;justify-content:center;font:700 12px Inter,sans-serif;
      border:2px solid #0E140D;box-shadow:0 2px 8px rgba(0,0,0,.6)">${texte}</div>`});
}
function pastilleG(couleur,texte){
  return {
    icon:{path:google.maps.SymbolPath.CIRCLE,scale:12,fillColor:couleur,fillOpacity:1,
          strokeColor:'#0E140D',strokeWeight:2},
    label:{text:texte,color:'#ffffff',fontSize:'12px',fontWeight:'700',fontFamily:'Inter,sans-serif'}
  };
}

/* ---------- BALADES ---------- */
function initBalades(){
  if(useG()){
    chargerGoogle(()=>{
      const m=new google.maps.Map(document.getElementById('map-balades'),
        {center:{lat:BASE[0],lng:BASE[1]},zoom:11,styles:STYLE_SOMBRE,
         mapTypeControl:false,streetViewControl:false,fullscreenControl:true,scrollwheel:false});
      const info=new google.maps.InfoWindow();
      new google.maps.Marker({position:{lat:BASE[0],lng:BASE[1]},map:m,...pastilleG('#8FDD1A','V')});
      const traces={};
      BALADES.forEach(b=>{
        traces[b.id]=new google.maps.Polyline({
          path:b.pts.map(p=>({lat:p[0],lng:p[1]})),map:m,
          strokeColor:b.couleur,strokeWeight:5,strokeOpacity:.6});
      });
      maps.balades={moteur:'g',m,traces,info};
    });
  } else { avecLeaflet(()=>{
    const m=L.map('map-balades',{scrollWheelZoom:false}).setView(BASE,11);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(m);
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    const traces={};
    BALADES.forEach(b=>{
      traces[b.id]=L.polyline(b.pts,{color:b.couleur,weight:5,opacity:.55}).addTo(m)
        .bindPopup(`<b>${b.nom[lang]}</b><br>${b.km} km · ${b.h}`);
    });
    maps.balades={moteur:'l',m,traces};
  }); }
}
function montrerBalade(id){
  const o=maps.balades; if(!o) return;
  const b=BALADES.find(x=>x.id===id);
  if(o.moteur==='g'){
    BALADES.forEach(x=>o.traces[x.id].setOptions({strokeOpacity:x.id===id?1:.15,strokeWeight:x.id===id?6:4}));
    const bd=new google.maps.LatLngBounds();
    b.pts.forEach(p=>bd.extend({lat:p[0],lng:p[1]}));
    o.m.fitBounds(bd,40);
    o.info.setContent(`<div style="font:400 13.5px Inter,sans-serif"><b style="font-size:14.5px">${b.nom[lang]}</b><br>${b.km} km · ${b.h}</div>`);
    o.info.setPosition({lat:b.pts[0][0],lng:b.pts[0][1]});
    o.info.open(o.m);
  } else {
    BALADES.forEach(x=>o.traces[x.id].setStyle({opacity:x.id===id?1:.16,weight:x.id===id?6:4}));
    o.m.fitBounds(o.traces[id].getBounds(),{padding:[30,30]});
    o.traces[id].openPopup();
  }
}

/* ---------- VIGNOBLE ---------- */
function initVignoble(){
  if(useG()){
    chargerGoogle(()=>{
      const m=new google.maps.Map(document.getElementById('map-vignoble'),
        {center:{lat:48.11,lng:7.31},zoom:11,styles:STYLE_SOMBRE,
         mapTypeControl:false,streetViewControl:false,scrollwheel:false});
      const info=new google.maps.InfoWindow(), mk={};
      new google.maps.Marker({position:{lat:BASE[0],lng:BASE[1]},map:m,...pastilleG('#8FDD1A','V')});
      VIGNOBLE.forEach((v,i)=>{
        mk[v.id]=new google.maps.Marker({position:{lat:v.pos[0],lng:v.pos[1]},map:m,...pastilleG('#9E4455',String(i+1))});
        mk[v.id].addListener('click',()=>montrerVin(v.id));
      });
      maps.vignoble={moteur:'g',m,mk,info};
    });
  } else { avecLeaflet(()=>{
    const m=L.map('map-vignoble',{scrollWheelZoom:false}).setView([48.11,7.31],11);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(m);
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    const mk={};
    VIGNOBLE.forEach((v,i)=>{ mk[v.id]=L.marker(v.pos,{icon:pastilleL('#9E4455',String(i+1))}).addTo(m); });
    maps.vignoble={moteur:'l',m,mk};
  }); }
}
function montrerVin(id){
  const o=maps.vignoble; if(!o) return;
  const v=VIGNOBLE.find(x=>x.id===id);
  const html=`<b>${v.nom[lang]}</b><br>${tr('wine.gc')} : ${v.gc}<br>${v.km} km ${tr('from.colmar')}`;
  if(o.moteur==='g'){
    o.info.setContent(`<div style="font:400 13.5px Inter,sans-serif;color:#16200F">${html}</div>`);
    o.info.open(o.m,o.mk[id]); o.m.panTo({lat:v.pos[0],lng:v.pos[1]}); o.m.setZoom(13);
  } else {
    o.mk[id].bindPopup(html).openPopup(); o.m.setView(v.pos,13);
  }
}

/* ---------- ALSACE ---------- */
function initAlsace(){
  if(useG()){
    chargerGoogle(()=>{
      const m=new google.maps.Map(document.getElementById('map-alsace'),
        {center:{lat:48.15,lng:7.40},zoom:9,styles:STYLE_SOMBRE,
         mapTypeControl:false,streetViewControl:false,scrollwheel:false});
      const info=new google.maps.InfoWindow(), mk={};
      ALSACE.forEach((a,i)=>{
        mk[a.id]=new google.maps.Marker({position:{lat:a.pos[0],lng:a.pos[1]},map:m,...pastilleG('#3E9FB0',String(i+1))});
        mk[a.id].addListener('click',()=>montrerAls(a.id));
      });
      new google.maps.Marker({position:{lat:BASE[0],lng:BASE[1]},map:m,...pastilleG('#8FDD1A','V')});
      maps.alsace={moteur:'g',m,mk,info};
    });
  } else { avecLeaflet(()=>{
    const m=L.map('map-alsace',{scrollWheelZoom:false}).setView([48.15,7.40],9);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(m);
    const mk={};
    ALSACE.forEach((a,i)=>{ mk[a.id]=L.marker(a.pos,{icon:pastilleL('#3E9FB0',String(i+1))}).addTo(m); });
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    maps.alsace={moteur:'l',m,mk};
  }); }
}
function montrerAls(id){
  const o=maps.alsace; if(!o) return;
  const a=ALSACE.find(x=>x.id===id);
  const html=`<b>${a.nom[lang]}</b><br>${a.desc[lang]}`;
  if(o.moteur==='g'){
    o.info.setContent(`<div style="font:400 13.5px Inter,sans-serif;color:#16200F;max-width:230px">${html}</div>`);
    o.info.open(o.m,o.mk[id]); o.m.panTo({lat:a.pos[0],lng:a.pos[1]}); o.m.setZoom(12);
  } else {
    o.mk[id].bindPopup(html).openPopup(); o.m.setView(a.pos,12);
  }
}

function redimensionner(o){
  if(!o) return;
  if(o.moteur==='l') o.m.invalidateSize();
  else google.maps.event.trigger(o.m,'resize');
}
function fermerBulles(){
  Object.values(maps).forEach(o=>{
    if(o.moteur==='l') o.m.closePopup(); else if(o.info) o.info.close();
  });
}

/* ===================== NAVIGATION ===================== */
function aller(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('actif'));
  document.getElementById('page-'+page).classList.add('actif');
  document.querySelectorAll('.onglet').forEach(o=>o.classList.toggle('actif',o.dataset.page===page));
  window.scrollTo({top:0,behavior:'instant'});
  setTimeout(()=>{
    if(page==='balades'){ maps.balades ? redimensionner(maps.balades) : initBalades(); }
    if(page==='vignoble'){ maps.vignoble ? redimensionner(maps.vignoble) : initVignoble(); }
    if(page==='alsace'){ maps.alsace ? redimensionner(maps.alsace) : initAlsace(); }
  },80);
}

document.getElementById('onglets').addEventListener('click',e=>{
  const b=e.target.closest('.onglet'); if(b) aller(b.dataset.page);
});
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>aller(b.dataset.goto)));

document.getElementById('liste-balades').addEventListener('click',e=>{
  const b=e.target.closest('[data-balade]'); if(!b) return;
  document.querySelectorAll('#liste-balades .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerBalade(b.dataset.balade);
});
document.getElementById('liste-vignoble').addEventListener('click',e=>{
  const b=e.target.closest('[data-vin]'); if(!b) return;
  document.querySelectorAll('#liste-vignoble .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerVin(b.dataset.vin);
});
document.getElementById('liste-alsace').addEventListener('click',e=>{
  const b=e.target.closest('[data-als]'); if(!b) return;
  document.querySelectorAll('#liste-alsace .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerAls(b.dataset.als);
});

document.getElementById('liste-velos').addEventListener('click',e=>{
  const p=e.target.dataset.p, m=e.target.dataset.m;
  if(!p&&!m) return;
  const id=p||m, v=VELOS.find(x=>x.id===id), libre=dispo(v,document.getElementById('date').value);
  panier[id]=Math.max(0,Math.min(libre,(panier[id]||0)+(p?1:-1)));
  document.getElementById('q-'+id).textContent=panier[id];
  majRecap();
});

document.getElementById('date').addEventListener('change',rendreVelos);
document.getElementById('duree').addEventListener('change',rendreVelos);

document.getElementById('valider').addEventListener('click',()=>{
  const n=Object.values(panier).reduce((a,b)=>a+b,0);
  const nom=document.getElementById('nom').value.trim(), mail=document.getElementById('mail').value.trim();
  if(!n||!nom||!mail){ alert(tr('book.alert')); return; }
  document.getElementById('ok-texte').textContent =
    tr('book.okTxt').replace('{d}',dateLisible()).replace('{h}',document.getElementById('heure').value).replace('{m}',mail);
  const code=nouveauCode();
  FILS[code]=[{auteur:'systeme',texte:'demo'}];
  document.getElementById('ok-code').textContent=code;
  document.getElementById('etape-panier').style.display='none';
  document.getElementById('etape-ok').style.display='block';
});
document.getElementById('retour').addEventListener('click',()=>{
  Object.keys(panier).forEach(k=>panier[k]=0);
  document.getElementById('etape-ok').style.display='none';
  document.getElementById('etape-panier').style.display='block';
  rendreVelos();
});

document.getElementById('langue').addEventListener('change',e=>{
  lang=e.target.value;
  appliquerLangue();
  fermerBulles();
});

/* ===================== MESSAGERIE PAR CODE =====================
   Pas de compte utilisateur : le code de réservation est la seule clé d'accès.

   Deux moteurs, comme pour les cartes :
   - vide  -> mode démonstration, les messages vivent dans la page ;
   - rempli -> vraie messagerie temps réel via Supabase (gratuit pour ce volume).

   Pour brancher Supabase, créer la table dans l'éditeur SQL du projet :

     create table messages (
       id bigint generated always as identity primary key,
       code text not null,
       auteur text not null check (auteur in ('client','equipe')),
       texte text not null,
       cree_le timestamptz not null default now()
     );
     create index on messages (code, cree_le);
     alter table messages enable row level security;
     -- lecture et écriture réservées aux lignes portant le code demandé :
     -- à filtrer côté serveur (fonction edge) pour éviter la lecture de tous les codes.

   Attention : une clé anonyme dans une page publique laisse lire la table si la
   politique RLS est trop large. À faire relire avant mise en ligne.            */
const SUPABASE_URL = "";
const SUPABASE_ANON = "";
const useS = () => SUPABASE_URL.trim().length > 0 && SUPABASE_ANON.trim().length > 0;

let sb = null, filCourant = null, canal = null;
const FILS = {};                    // fils en mémoire (mode démonstration)
FILS['VS-DEMO01'] = [{auteur:'systeme', texte:'demo'}];

function nouveauCode(){
  const car = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for(let i=0;i<6;i++) c += car[Math.floor(Math.random()*car.length)];
  return 'VS-' + c;
}

function chargerSupabase(cb){
  if(sb) return cb();
  const sc=document.createElement('script');
  sc.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  sc.onload=()=>{ sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON); cb(); };
  sc.onerror=()=>{ document.getElementById('msg-mode').textContent = tr('msg.demo'); cb(null); };
  document.head.appendChild(sc);
}

function bulle(auteur, texte, auto){
  const d=document.createElement('div');
  if(auteur==='systeme'){ d.className='bulle sys'; d.textContent = texte==='demo' ? tr('msg.first') : texte; return d; }
  d.className = 'bulle ' + (auteur==='client' ? 'moi' : 'eux');
  const q=document.createElement('span'); q.className='qui';
  q.textContent = (auteur==='client'?tr('msg.you'):tr('msg.team')) + (auto?' · '+tr('msg.auto'):'');
  d.appendChild(q); d.appendChild(document.createTextNode(texte));
  return d;
}
function peindre(liste){
  const c=document.getElementById('fil-corps');
  c.innerHTML='';
  liste.forEach(m=>c.appendChild(bulle(m.auteur,m.texte,m.auto)));
  c.scrollTop=c.scrollHeight;
}

function ouvrirFil(code){
  code = (code||'').trim().toUpperCase();
  const err=document.getElementById('msg-erreur');
  if(!code){ err.style.display='block'; err.textContent=tr('msg.bad'); return; }
  err.style.display='none';
  filCourant=code;
  document.getElementById('fil-code').textContent=code;
  document.getElementById('fil').style.display='flex';
  document.getElementById('code-input').value=code;

  if(useS()){
    document.getElementById('msg-mode').textContent=tr('msg.live');
    chargerSupabase(async ok=>{
      if(ok===null) return ouvrirDemo(code);
      const {data}=await sb.from('messages').select('*').eq('code',code).order('cree_le');
      peindre(data && data.length ? data : [{auteur:'systeme',texte:'demo'}]);
      if(canal) sb.removeChannel(canal);
      canal = sb.channel('fil-'+code)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'code=eq.'+code},
            p=>document.getElementById('fil-corps').appendChild(bulle(p.new.auteur,p.new.texte)))
        .subscribe();
    });
  } else {
    ouvrirDemo(code);
  }
}
function ouvrirDemo(code){
  document.getElementById('msg-mode').textContent=tr('msg.demo');
  if(!FILS[code]){
    const err=document.getElementById('msg-erreur');
    err.style.display='block'; err.textContent=tr('msg.bad');
    document.getElementById('fil').style.display='none';
    filCourant=null; return;
  }
  peindre(FILS[code]);
}

async function envoyer(){
  const champ=document.getElementById('fil-texte');
  const texte=champ.value.trim();
  if(!texte || !filCourant) return;
  champ.value='';
  if(useS() && sb){
    await sb.from('messages').insert({code:filCourant, auteur:'client', texte});
    return;                                   // l'affichage arrive par le temps réel
  }
  FILS[filCourant].push({auteur:'client',texte});
  peindre(FILS[filCourant]);
  setTimeout(()=>{
    if(!filCourant) return;
    FILS[filCourant].push({auteur:'equipe',texte:'…',auto:true});
    FILS[filCourant][FILS[filCourant].length-1].texte =
      {fr:"Bien reçu, on regarde ça tout de suite.",en:"Got it, we're looking into it right now.",
       de:"Angekommen, wir kümmern uns sofort darum.",es:"Recibido, lo miramos ahora mismo.",
       it:"Ricevuto, ce ne occupiamo subito."}[lang];
    peindre(FILS[filCourant]);
  },1400);
}

document.getElementById('ouvrir-fil').addEventListener('click',()=>ouvrirFil(document.getElementById('code-input').value));
document.getElementById('code-input').addEventListener('keydown',e=>{ if(e.key==='Enter') ouvrirFil(e.target.value); });
document.getElementById('fil-envoi').addEventListener('click',envoyer);
document.getElementById('fil-texte').addEventListener('keydown',e=>{ if(e.key==='Enter') envoyer(); });
document.getElementById('ok-vers-msg').addEventListener('click',()=>{
  aller('messagerie');
  ouvrirFil(document.getElementById('ok-code').textContent);
});

/* démarrage */
const dd=new Date(); dd.setDate(dd.getDate()+1);
const iso=dd.toISOString().slice(0,10);
document.getElementById('date').value=iso;
document.getElementById('date').min=new Date().toISOString().slice(0,10);
const nav=(navigator.language||'fr').slice(0,2);
if(T[nav]){ lang=nav; document.getElementById('langue').value=nav; }
appliquerLangue();

/* VÉLI SAFE — logique du site (rendu, cartes, réservation, messagerie, pages légales)
   Chargé par index.html. Scripts classiques, pas de modules :
   le site doit pouvoir s'ouvrir par double-clic, sans serveur local.
   Ordre de chargement : leaflet → i18n → data → legal → app. */

/* ===================== ÉTAT ===================== */
let lang = 'fr';
const panier = {};
const maps = {};
let filtreBalade = 'all';
let baladeCourante = null;

function tr(k){ return (T[lang] && T[lang][k]) || T.fr[k] || k; }
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function nb(n){ return n.toLocaleString(lang==='fr'?'fr-FR':lang); }
function euros(n){ return n.toLocaleString(lang==='fr'?'fr-FR':lang,{maximumFractionDigits:0}) + ' €'; }
function dureeChoisie(){ return document.getElementById('duree').value; }
function tarif(v){ return v.prix[dureeChoisie()]; }

/* durée de pédalage : 145 minutes -> « 2 h 25 » */
function heures(min){
  const h = Math.floor(min/60), m = min%60;
  if(!h) return m + ' min';
  return h + ' h' + (m ? ' ' + String(m).padStart(2,'0') : '');
}

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
  rendreTarifs(); rendreVelos(); rendreBalades(); rendreVignoble(); rendreAlsace(); rendrePartenaires();
  if(detailCourant) peindreDetail();
  if(surcoucheOuverte) peindreDoc(surcoucheOuverte);
  majFlecheNav();
}

function rendreTarifs(){
  document.getElementById('tbody-tarifs').innerHTML = VELOS.map(v=>
    `<tr><td>${esc(v.nom[lang])}</td>` + DUREES.map(d=>`<td>${euros(v.prix[d])}</td>`).join('') + `</tr>`
  ).join('');
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
      <div class="ico">${v.photo?`<img src="${v.photo}" alt="">`:v.ico}</div>
      <div>
        <h3>${esc(v.nom[lang])}</h3>
        <div class="meta">${esc(v.det[lang])}</div>
        <div class="pour">${esc(v.pour[lang])}</div>
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
  if(typeof rendreCal==='function') rendreCal();
}

function majRecap(){
  const box = document.getElementById('recap');
  let total=0, html='';
  VELOS.forEach(v=>{
    const q=panier[v.id]||0; if(!q) return;
    const st=q*tarif(v); total+=st;
    html += `<div><span>${q} × ${esc(v.nom[lang])}</span><span>${euros(st)}</span></div>`;
  });
  if(!html) html = `<div style="color:var(--gris)">${tr('book.empty')}</div>`;
  html += `<div class="tot"><span>${tr('book.total')}</span><span>${euros(total)}</span></div>`;
  box.innerHTML = html;
}

/* ---------- balades ---------- */
function baladesVisibles(){
  return filtreBalade==='all' ? BALADES : BALADES.filter(b=>b.lvl===filtreBalade);
}
function rendreBalades(){
  document.querySelectorAll('#filtres-balades .filtre')
    .forEach(f=>f.classList.toggle('actif', f.dataset.lvl===filtreBalade));
  document.getElementById('liste-balades').innerHTML = baladesVisibles().map(b=>`
    <button class="item${b.id===baladeCourante?' actif':''}" data-balade="${b.id}">
      <h3>${esc(b.nom[lang])}</h3>
      <p>${esc(b.resume[lang])}</p>
      <div class="tags">
        <span class="tag lime">${nb(b.km)} km</span>
        <span class="tag">↗ ${nb(b.denivele)} m</span>
        <span class="tag">${heures(b.minutes)}</span>
        <span class="tag teal">${tr('lvl.'+b.lvl)}</span>
        ${b.velo==='vae'?`<span class="tag ambre">${tr('lvl.ebike')}</span>`:''}
      </div>
    </button>`).join('');
}

/* Contenus des fiches détaillées, affichées dans la surcouche #sur-detail. */
function htmlBalade(b){
  const ch = (k,v,u)=>`<div class="chiffre"><span class="k">${k}</span><span class="v">${v}${u?`<span class="u">${u}</span>`:''}</span></div>`;
  return `
    <p class="accroche">${esc(b.resume[lang])}</p>
    <div class="chiffres">
      ${ch(tr('rides.km'), nb(b.km), ' km')}
      ${ch(tr('rides.denivele'), '↗ '+nb(b.denivele), ' m')}
      ${ch(tr('rides.duree'), heures(b.minutes), '')}
      ${ch(tr('rides.altmax'), nb(b.altMax), ' m')}
      ${ch(tr('rides.sol'), '<span style="font-size:13px">'+tr('sol.'+b.sol)+'</span>', '')}
      ${ch(tr('rides.velo'), '<span style="font-size:13px">'+tr('velo.'+b.velo)+'</span>', '')}
    </div>
    <div class="fiche-cols">
      <div class="fiche-bloc"><h4>${tr('rides.voir')}</h4><p>${esc(b.voir[lang])}</p></div>
      <div class="fiche-bloc"><h4>${tr('rides.conseil')}</h4><p>${esc(b.conseil[lang])}</p></div>
    </div>
    ${b.ref?`<p class="source"><strong>${tr('rides.ref')} :</strong> ${esc(b.ref[lang])}</p>`:''}
    <p class="source">${tr('rides.duree')} : ${heures(b.minutes)}, ${tr('rides.pedal')}.</p>`;
}
function htmlVin(v){
  return `
    <div class="tags" style="margin:0 0 12px">
      <span class="tag lime">${v.km} km ${tr('from.colmar')}</span>
      <span class="tag teal">${tr('wine.gc')} : ${esc(v.gc)}</span>
      <span class="tag">${tr('wine.cep')} : ${esc(v.cep)}</span>
    </div>
    <p>${esc(v.desc[lang])}</p>`;
}
function htmlAls(a){
  return `
    <div class="tags" style="margin:0 0 12px">
      <span class="tag teal">${tr('acces.'+a.acces)}</span>
      <span class="tag lime">${a.km} km</span>
      <span class="tag">${tr('disc.duree')} ${esc(a.duree)}</span>
    </div>
    <p>${esc(a.desc[lang])}</p>`;
}

function rendreVignoble(){
  document.getElementById('liste-vignoble').innerHTML = VIGNOBLE.map(v=>`
    <button class="item" data-vin="${v.id}">
      <h3>${esc(v.nom[lang])}</h3>
      <p>${esc(v.desc[lang])}</p>
      <div class="tags">
        <span class="tag lime">${v.km} km ${tr('from.colmar')}</span>
        <span class="tag teal">${tr('wine.gc')} : ${esc(v.gc)}</span>
        <span class="tag">${tr('wine.cep')} : ${esc(v.cep)}</span>
      </div>
    </button>`).join('');
}

function rendreAlsace(){
  document.getElementById('liste-alsace').innerHTML = ALSACE.map(a=>`
    <button class="item" data-als="${a.id}">
      <h3>${esc(a.nom[lang])}</h3>
      <p>${esc(a.desc[lang])}</p>
      <div class="tags">
        <span class="tag teal">${tr('acces.'+a.acces)}</span>
        <span class="tag lime">${a.km} km</span>
        <span class="tag">${tr('disc.duree')} ${esc(a.duree)}</span>
      </div>
    </button>`).join('');
}

function rendrePartenaires(){
  document.getElementById('liste-partenaires').innerHTML = PARTENAIRES.map(p=>{
    const places = `<div class="place-note">${tr('part.libreD')}</div>` +
      Array.from({length:p.places}, (_,i)=>
        `<div class="place-libre"><b>${tr('part.libre')}</b><span>${i+1} / ${p.places}</span></div>`).join('');
    return `<div class="part">
      <div class="pic">${p.ico}</div>
      <h3>${esc(p.nom[lang])}</h3>
      <p class="intro">${esc(p.intro[lang])}</p>
      <h4>${tr('part.offre')}</h4>
      <p class="offre">${esc(p.offre[lang])}</p>
      <div class="places">${places}</div>
    </div>`;
  }).join('');
}

/* ===================== CARTES =====================
   Deux moteurs possibles, conformément à la décision consignée dans
   CLAUDE.md : OpenStreetMap par défaut, Google Maps si une clé est
   renseignée ci-dessous. La décision du 3 septembre 2026 est de rester
   sur OpenStreetMap ; le code Google reste en place, dormant.
   Pour basculer : coller la clé entre les guillemets, rien d'autre. */
const GOOGLE_KEY = "";
const useG = () => GOOGLE_KEY.trim().length > 0;

const STYLE_SOMBRE = [
 {elementType:"geometry",stylers:[{color:"#1b241a"}]},
 {elementType:"labels.text.stroke",stylers:[{color:"#131a12"}]},
 {elementType:"labels.text.fill",stylers:[{color:"#9aa893"}]},
 {featureType:"poi.park",elementType:"geometry",stylers:[{color:"#22301f"}]},
 {featureType:"road",elementType:"geometry",stylers:[{color:"#2a3527"}]},
 {featureType:"water",elementType:"geometry",stylers:[{color:"#101c22"}]}
];

const TUILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

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
  sc.onerror=()=>{ console.warn("Google Maps n'a pas pu se charger."); messageCarte(); };
  document.head.appendChild(sc);
}

/* Leaflet est servi depuis le dossier vendor/ : s'il manque, on le dit. */
function avecLeaflet(cb){
  if(window.L) return cb();
  messageCarte();
}
function messageCarte(){
  ['map-balades','map-vignoble','map-alsace'].forEach(id=>{
    const el=document.getElementById(id);
    if(el && !el.dataset.msg){
      el.dataset.msg='1'; el.classList.add('vide');
      el.textContent = "Les cartes ont besoin d'une connexion internet pour charger les fonds. Ouvrez ce fichier dans Safari ou Chrome, connecté.";
    }
  });
}

function pastilleL(couleur,texte){
  return L.divIcon({className:'',iconSize:[26,26],iconAnchor:[13,13],
    html:`<div style="width:26px;height:26px;border-radius:50%;background:${couleur};color:#fff;
      display:flex;align-items:center;justify-content:center;font:700 12px sans-serif;
      border:2px solid #0E140D;box-shadow:0 2px 8px rgba(0,0,0,.6)">${texte}</div>`});
}
function pastilleG(couleur,texte){
  return {
    icon:{path:google.maps.SymbolPath.CIRCLE,scale:12,fillColor:couleur,fillOpacity:1,
          strokeColor:'#0E140D',strokeWeight:2},
    label:{text:texte,color:'#ffffff',fontSize:'12px',fontWeight:'700'}
  };
}

/* Les bulles sont construites au moment du clic : elles suivent donc
   toujours la langue affichée, y compris après un changement de langue. */
function bulleBalade(b){ return `<b>${esc(b.nom[lang])}</b><br>${nb(b.km)} km · ↗ ${nb(b.denivele)} m · ${heures(b.minutes)}`; }
function bulleVin(v){ return `<b>${esc(v.nom[lang])}</b><br>${tr('wine.gc')} : ${esc(v.gc)}<br>${v.km} km ${tr('from.colmar')}`; }
function bulleAls(a){ return `<b>${esc(a.nom[lang])}</b><br>${esc(a.desc[lang])}`; }

/* ---------- BALADES ---------- */
function initBalades(){
  if(useG()){
    chargerGoogle(()=>{
      const m=new google.maps.Map(document.getElementById('map-balades'),
        {center:{lat:BASE[0],lng:BASE[1]},zoom:11,styles:STYLE_SOMBRE,
         mapTypeControl:false,streetViewControl:false,scrollwheel:false});
      const info=new google.maps.InfoWindow();
      new google.maps.Marker({position:{lat:BASE[0],lng:BASE[1]},map:m,...pastilleG('#8FDD1A','V')});
      const traces={};
      BALADES.forEach(b=>{
        traces[b.id]=new google.maps.Polyline({
          path:b.pts.map(p=>({lat:p[0],lng:p[1]})),map:m,
          strokeColor:b.couleur,strokeWeight:5,strokeOpacity:.55});
      });
      maps.balades={moteur:'g',m,traces,info};
      appliquerFiltreCarte();
    });
  } else { avecLeaflet(()=>{
    const m=L.map('map-balades',{scrollWheelZoom:false}).setView(BASE,11);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(m);
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    const traces={};
    BALADES.forEach(b=>{
      traces[b.id]=L.polyline(b.pts,{color:b.couleur,weight:5,opacity:.7}).addTo(m)
        .bindTooltip(()=>`${b.nom[lang]} · ${nb(b.km)} km`,{sticky:true,className:'etiq'})
        .on('click',()=>choisirBalade(b.id));
    });
    maps.balades={moteur:'l',m,traces};
    appliquerFiltreCarte();
  }); }
}
/* n'affiche que les tracés du filtre en cours */
function appliquerFiltreCarte(){
  const o=maps.balades; if(!o) return;
  const vis=new Set(baladesVisibles().map(b=>b.id));
  BALADES.forEach(b=>{
    const t=o.traces[b.id]; if(!t) return;
    const op = vis.has(b.id) ? (b.id===baladeCourante?1:.5) : 0;
    if(o.moteur==='l') t.setStyle({opacity:op, weight: b.id===baladeCourante?6:4});
    else t.setOptions({strokeOpacity:op, strokeWeight: b.id===baladeCourante?6:4});
  });
}
function montrerBalade(id){
  baladeCourante=id;
  const o=maps.balades; if(!o) return;
  const b=BALADES.find(x=>x.id===id);
  appliquerFiltreCarte();
  if(o.moteur==='g'){
    const bd=new google.maps.LatLngBounds();
    b.pts.forEach(p=>bd.extend({lat:p[0],lng:p[1]}));
    o.m.fitBounds(bd,40);
    o.info.setContent(`<div style="font:400 13.5px sans-serif;color:#16200F">${bulleBalade(b)}</div>`);
    o.info.setPosition({lat:b.pts[0][0],lng:b.pts[0][1]});
    o.info.open(o.m);
  } else {
    o.m.fitBounds(o.traces[id].getBounds(),{padding:[30,30]});
    o.traces[id].bindPopup(bulleBalade(b)).openPopup();
  }
}
/* clic sur un tracé de la carte : on synchronise la liste */
function choisirBalade(id){
  const el=document.querySelector(`#liste-balades [data-balade="${id}"]`);
  document.querySelectorAll('#liste-balades .item').forEach(i=>i.classList.remove('actif'));
  if(el){ el.classList.add('actif'); el.scrollIntoView({block:'nearest'}); }
  montrerBalade(id);
}

/* ---------- VIGNOBLE ---------- */
function initVignoble(){
  if(useG()){
    chargerGoogle(()=>{
      const m=new google.maps.Map(document.getElementById('map-vignoble'),
        {center:{lat:48.09,lng:7.31},zoom:11,styles:STYLE_SOMBRE,
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
    const m=L.map('map-vignoble',{scrollWheelZoom:false}).setView([48.09,7.31],11);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(m);
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    const mk={};
    VIGNOBLE.forEach((v,i)=>{
      mk[v.id]=L.marker(v.pos,{icon:pastilleL('#9E4455',String(i+1))}).addTo(m)
        .bindTooltip(v.nom[lang],{permanent:true,direction:'right',offset:[11,0],className:'etiq'})
        .on('click',()=>montrerVin(v.id));
    });
    maps.vignoble={moteur:'l',m,mk};
  }); }
}
function montrerVin(id){
  const o=maps.vignoble; if(!o) return;
  const v=VIGNOBLE.find(x=>x.id===id);
  if(o.moteur==='g'){
    o.info.setContent(`<div style="font:400 13.5px sans-serif;color:#16200F">${bulleVin(v)}</div>`);
    o.info.open(o.m,o.mk[id]); o.m.panTo({lat:v.pos[0],lng:v.pos[1]}); o.m.setZoom(13);
  } else {
    o.mk[id].bindPopup(bulleVin(v)).openPopup(); o.m.setView(v.pos,14);
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
    ALSACE.forEach((a,i)=>{
      mk[a.id]=L.marker(a.pos,{icon:pastilleL('#3E9FB0',String(i+1))}).addTo(m)
        .bindTooltip(a.nom[lang],{permanent:true,direction:'right',offset:[11,0],className:'etiq'})
        .on('click',()=>montrerAls(a.id));
    });
    L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}).addTo(m).bindPopup('<b>VÉLI SAFE</b><br>Colmar');
    maps.alsace={moteur:'l',m,mk};
  }); }
}
function montrerAls(id){
  const o=maps.alsace; if(!o) return;
  const a=ALSACE.find(x=>x.id===id);
  if(o.moteur==='g'){
    o.info.setContent(`<div style="font:400 13.5px sans-serif;color:#16200F;max-width:230px">${bulleAls(a)}</div>`);
    o.info.open(o.m,o.mk[id]); o.m.panTo({lat:a.pos[0],lng:a.pos[1]}); o.m.setZoom(12);
  } else {
    o.mk[id].bindPopup(bulleAls(a)).openPopup(); o.m.setView(a.pos,13);
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

/* ===================== NAVIGATION =====================
   Le site est une seule page qui défile : chaque « page » est une section
   empilée, et les onglets font glisser jusqu'à la section voulue.
   L'onglet actif suit la position de défilement. */
function aller(page){
  const el=document.getElementById('page-'+page);
  if(!el || el.classList.contains('dormant')) return;
  document.querySelectorAll('.onglet').forEach(o=>o.classList.toggle('actif',o.dataset.page===page));
  majActifBloquee=Date.now()+900;
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* les cartes ne s'initialisent (et leurs fonds ne se téléchargent) que
   lorsque leur section approche de l'écran */
const INIT_CARTES={balades:initBalades, vignoble:initVignoble, alsace:initAlsace};
const carteFaite={};
function lancerCarte(p){
  if(carteFaite[p] || !INIT_CARTES[p]) return;
  carteFaite[p]=true; INIT_CARTES[p]();
}
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ lancerCarte(e.target.id.replace('page-','')); io.unobserve(e.target); }
  }),{rootMargin:'300px 0px'});
  ['balades','vignoble','alsace'].forEach(p=>io.observe(document.getElementById('page-'+p)));
} else { ['balades','vignoble','alsace'].forEach(lancerCarte); }

/* l'onglet actif suit le défilement */
const sectionsNav=[...document.querySelectorAll('.page:not(.dormant)')];
let majActifBloquee=0;
function majOngletActif(){
  if(Date.now()<majActifBloquee) return;
  const y=window.scrollY+150;
  let cur=sectionsNav[0];
  sectionsNav.forEach(s=>{ if(s.offsetTop<=y) cur=s; });
  const page=cur.id.replace('page-','');
  document.querySelectorAll('.onglet').forEach(o=>o.classList.toggle('actif',o.dataset.page===page));
}
window.addEventListener('scroll',majOngletActif,{passive:true});

document.getElementById('onglets').addEventListener('click',e=>{
  const b=e.target.closest('.onglet'); if(b) aller(b.dataset.page);
});
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>aller(b.dataset.goto)));

/* la barre d'onglets déborde sur petit écran : on le signale et on la fait défiler */
const zoneNav=document.getElementById('nav-zone'), barreNav=document.getElementById('onglets');
function majFlecheNav(){
  const reste = barreNav.scrollWidth - barreNav.clientWidth - barreNav.scrollLeft;
  zoneNav.classList.toggle('deborde', reste > 8);
}
document.getElementById('nav-fleche').addEventListener('click',()=>{
  barreNav.scrollBy({left: barreNav.clientWidth*0.7, behavior:'smooth'});
});
barreNav.addEventListener('scroll',majFlecheNav);
window.addEventListener('resize',majFlecheNav);

/* listes cliquables */
document.getElementById('liste-balades').addEventListener('click',e=>{
  const b=e.target.closest('[data-balade]'); if(!b) return;
  document.querySelectorAll('#liste-balades .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerBalade(b.dataset.balade);
  ouvrirDetail('balade', b.dataset.balade);
});
document.getElementById('filtres-balades').addEventListener('click',e=>{
  const f=e.target.closest('.filtre'); if(!f) return;
  filtreBalade=f.dataset.lvl;
  if(baladeCourante && !baladesVisibles().some(b=>b.id===baladeCourante)){
    baladeCourante=null;
  }
  rendreBalades(); appliquerFiltreCarte();
});
document.getElementById('liste-vignoble').addEventListener('click',e=>{
  const b=e.target.closest('[data-vin]'); if(!b) return;
  document.querySelectorAll('#liste-vignoble .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerVin(b.dataset.vin);
  ouvrirDetail('vin', b.dataset.vin);
});
document.getElementById('liste-alsace').addEventListener('click',e=>{
  const b=e.target.closest('[data-als]'); if(!b) return;
  document.querySelectorAll('#liste-alsace .item').forEach(i=>i.classList.remove('actif'));
  b.classList.add('actif'); montrerAls(b.dataset.als);
  ouvrirDetail('als', b.dataset.als);
});

document.getElementById('liste-velos').addEventListener('click',e=>{
  const p=e.target.dataset.p, m=e.target.dataset.m;
  if(!p&&!m) return;
  const id=p||m, v=VELOS.find(x=>x.id===id), libre=dispo(v,document.getElementById('date').value);
  panier[id]=Math.max(0,Math.min(libre,(panier[id]||0)+(p?1:-1)));
  document.getElementById('q-'+id).textContent=panier[id];
  majRecap(); rendreCal();
});

document.getElementById('date').addEventListener('change',rendreVelos);
document.getElementById('duree').addEventListener('change',()=>{ rendreTarifs(); rendreVelos(); });

/* la demande en cours, figée à la validation ; le message WhatsApp est
   reconstruit à l'envoi, dans la langue affichée à ce moment-là */
let demandeWA=null;
const DUREE_CLE={demi:'book.half',jour:'book.full',j2:'book.d2',j3:'book.d3',j7:'book.d7'};
function messageWA(){
  if(!demandeWA) return '';
  const d=demandeWA, L=[];
  L.push(tr('wa.title'));
  L.push(tr('book.code')+' : '+d.code);
  L.push(tr('book.date')+' : '+d.date+', '+d.heure);
  L.push(tr('book.duration')+' : '+tr(DUREE_CLE[d.duree]));
  d.velos.forEach(v=>L.push('- '+v.q+' × '+v.nom[lang]));
  L.push(tr('book.total')+' : '+euros(d.total)+' ('+tr('wa.total')+')');
  L.push(tr('book.name')+' : '+d.nom);
  if(d.tel) L.push(tr('book.phone')+' : '+d.tel);
  return L.join('\n');
}
document.getElementById('valider').addEventListener('click',()=>{
  const n=Object.values(panier).reduce((a,b)=>a+b,0);
  const nom=document.getElementById('nom').value.trim(), mail=document.getElementById('mail').value.trim();
  if(!n||!nom||!mail){ alert(tr('book.alert')); return; }
  document.getElementById('ok-texte').textContent =
    tr('book.okTxt').replace('{d}',dateLisible()).replace('{h}',document.getElementById('heure').value).replace('{m}',mail);
  const code=nouveauCode();
  FILS[code]=[{auteur:'systeme',texte:'demo'}];
  document.getElementById('ok-code').textContent=code;
  demandeWA={
    code, nom, tel:document.getElementById('tel').value.trim(),
    date:dateLisible(), heure:document.getElementById('heure').value,
    duree:document.getElementById('duree').value,
    velos:VELOS.filter(v=>panier[v.id]>0).map(v=>({q:panier[v.id], nom:v.nom})),
    total:VELOS.reduce((s,v)=>s+(panier[v.id]||0)*tarif(v),0)
  };
  document.getElementById('etape-panier').style.display='none';
  document.getElementById('etape-ok').style.display='block';
});
document.getElementById('ok-whatsapp').addEventListener('click',()=>{
  window.open('https://wa.me/33630399531?text='+encodeURIComponent(messageWA()),'_blank');
});

/* Récapitulatif PDF, généré dans le navigateur (jsPDF servie en local,
   comme Leaflet : aucune requête externe). Contenu dans la langue affichée,
   conditions de location en annexe — le contrat, lui, se signe au retrait. */
function sansHTML(html){
  const d=document.createElement('div');
  d.innerHTML=String(html).replace(/<\/(p|h3|li|ul)>/gi,'$&\n');
  return d.textContent.replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
const LOGO_PDF='data:image/png;base64,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';
function telechargerPDF(){
  if(!demandeWA || !window.jspdf) return;
  const {jsPDF}=window.jspdf, d=demandeWA;
  const doc=new jsPDF({unit:'mm',format:'a4'});
  const L=15, W=180; let y;
  doc.setFillColor(68,93,71); doc.rect(0,0,210,26,'F');
  doc.setFillColor(243,238,234); doc.roundedRect(163,3.5,33,19,2.5,2.5,'F');
  doc.addImage(LOGO_PDF,'PNG',167.5,5.2,24,16.3);
  doc.setTextColor(243,238,234); doc.setFont('helvetica','bold'); doc.setFontSize(16);
  doc.text('VÉLI SAFE',L,11);
  doc.setFontSize(11); doc.setFont('helvetica','normal');
  doc.text(tr('wa.title'),L,19);
  doc.setTextColor(37,50,42); y=36; doc.setFontSize(11);
  const ligne=(k,v)=>{ doc.setFont('helvetica','bold'); doc.text(k,L,y);
    doc.setFont('helvetica','normal'); doc.text(String(v),80,y); y+=7; };
  ligne(tr('book.code'), d.code);
  ligne(tr('book.name'), d.nom);
  if(d.tel) ligne(tr('book.phone'), d.tel);
  ligne(tr('book.date'), d.date+', '+d.heure);
  ligne(tr('book.duration'), tr(DUREE_CLE[d.duree]));
  y+=2; doc.setFont('helvetica','bold'); doc.text(tr('home.thBike'),L,y);
  y+=6; doc.setFont('helvetica','normal');
  d.velos.forEach(v=>{ doc.text('- '+v.q+' × '+v.nom[lang],L+3,y); y+=6; });
  y+=2; doc.setFont('helvetica','bold');
  doc.text(tr('book.total')+' : '+euros(d.total),L,y); y+=8;
  doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(92,107,95);
  [tr('book.pay'), tr('home.priceNote'), tr('book.waNote')].forEach(txt=>{
    const ls=doc.splitTextToSize(txt,W); doc.text(ls,L,y); y+=ls.length*4.6+2.5;
  });
  doc.setTextColor(37,50,42);
  y+=3; doc.setDrawColor(183,193,175); doc.line(L,y,L+W,y); y+=8;
  doc.setFont('helvetica','bold'); doc.setFontSize(12);
  doc.text(tr('foot.terms'),L,y); y+=6;
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(122,90,18);
  const avert=doc.splitTextToSize(sansHTML(tr('legal.todo')),W);
  doc.text(avert,L,y); y+=avert.length*3.8+3;
  doc.setTextColor(37,50,42);
  const corps=sansHTML((LEGAL[lang]&&LEGAL[lang].terms)||LEGAL.fr.terms);
  corps.split('\n').map(s=>s.trim()).filter(Boolean).forEach(par=>{
    doc.splitTextToSize(par,W).forEach(ln=>{
      if(y>283){ doc.addPage(); y=15; }
      doc.text(ln,L,y); y+=3.9;
    });
    y+=1.8;
  });
  if(y>287){ doc.addPage(); y=15; }
  doc.setFontSize(8.5); doc.setTextColor(92,107,95);
  doc.text('VÉLI SAFE — Colmar · 06 30 39 95 31', L, y+5);
  doc.save('velisafe-'+d.code+'.pdf');
}
document.getElementById('ok-pdf').addEventListener('click',telechargerPDF);
document.getElementById('retour').addEventListener('click',()=>{
  Object.keys(panier).forEach(k=>panier[k]=0);
  document.getElementById('etape-ok').style.display='none';
  document.getElementById('etape-panier').style.display='block';
  rendreVelos();
});

/* les étiquettes permanentes des cartes suivent la langue affichée */
function majEtiquettes(){
  if(maps.vignoble && maps.vignoble.moteur==='l')
    VIGNOBLE.forEach(v=>{ const k=maps.vignoble.mk[v.id]; if(k&&k.setTooltipContent) k.setTooltipContent(v.nom[lang]); });
  if(maps.alsace && maps.alsace.moteur==='l')
    ALSACE.forEach(a=>{ const k=maps.alsace.mk[a.id]; if(k&&k.setTooltipContent) k.setTooltipContent(a.nom[lang]); });
}
document.getElementById('langue').addEventListener('change',e=>{
  lang=e.target.value;
  appliquerLangue();
  fermerBulles();
  majEtiquettes();
  if(location.protocol.startsWith('http')){
    const u=new URL(location); u.searchParams.set('lang',lang);
    history.replaceState(null,'',u);
  }
});

/* ===================== PAGES LÉGALES ===================== */
let surcoucheOuverte=null;
const TITRES_LEGAL = {mentions:'foot.legal', terms:'foot.terms', privacy:'foot.privacy', cookies:'foot.cookies'};
function peindreDoc(cle){
  const t = (LEGAL[lang] && LEGAL[lang][cle]) || LEGAL.fr[cle];
  document.getElementById('doc-titre').textContent = tr(TITRES_LEGAL[cle]);
  document.getElementById('doc-corps').innerHTML =
    `<div class="doc-avert">${tr('legal.todo')}</div>` + t +
    `<div class="doc-pied">${tr('legal.updated')} : ${LEGAL.maj}.` +
    (lang!=='fr' ? ' ' + tr('legal.prevail') : '') + `</div>`;
}
function ouvrirDoc(cle){
  surcoucheOuverte=cle;
  peindreDoc(cle);
  const s=document.getElementById('surcouche');
  s.classList.add('ouverte');
  s.scrollTop=0;
  document.body.style.overflow='hidden';
  document.getElementById('doc-fermer').focus();
}
function fermerDoc(){
  surcoucheOuverte=null;
  document.getElementById('surcouche').classList.remove('ouverte');
  document.body.style.overflow='';
}
document.querySelectorAll('[data-legal]').forEach(b=>
  b.addEventListener('click',()=>ouvrirDoc(b.dataset.legal)));
document.getElementById('doc-fermer').addEventListener('click',fermerDoc);
document.getElementById('surcouche').addEventListener('click',e=>{
  if(e.target.id==='surcouche') fermerDoc();
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape') return;
  if(detailCourant) fermerDetail();
  else if(surcoucheOuverte) fermerDoc();
});

/* ===================== FICHE DÉTAILLÉE (surcouche) =====================
   Ouverte au clic sur un élément des listes balades, vignoble et Alsace.
   Sur mobile, la carte de la page est loin sous la liste : la fiche montre
   tout d'un coup — carte zoomée (où les noms de rues sont visibles),
   chiffres et histoire du lieu. Une seule carte Leaflet, réutilisée. */
let detailCourant=null, mapDetail=null, coucheDetail=null;
function carteDetail(){
  if(!window.L) return null;
  if(!mapDetail){
    mapDetail=L.map('map-detail',{scrollWheelZoom:false}).setView(BASE,12);
    L.tileLayer(TUILES,{attribution:ATTR,maxZoom:19}).addTo(mapDetail);
    coucheDetail=L.layerGroup().addTo(mapDetail);
  }
  return mapDetail;
}
function peindreDetail(){
  if(!detailCourant) return;
  const {type,id}=detailCourant;
  let titre='', corps='';
  if(type==='balade'){ const b=BALADES.find(x=>x.id===id); titre=b.nom[lang]; corps=htmlBalade(b); }
  if(type==='vin'){ const v=VIGNOBLE.find(x=>x.id===id); titre=v.nom[lang]; corps=htmlVin(v); }
  if(type==='als'){ const a=ALSACE.find(x=>x.id===id); titre=a.nom[lang]; corps=htmlAls(a); }
  document.getElementById('det-titre').textContent=titre;
  document.getElementById('det-corps').innerHTML=corps;
}
function ouvrirDetail(type,id){
  detailCourant={type,id};
  peindreDetail();
  const s=document.getElementById('sur-detail');
  s.classList.add('ouverte'); s.scrollTop=0;
  document.body.style.overflow='hidden';
  document.getElementById('det-fermer').focus();
  setTimeout(()=>{
    const m=carteDetail(); if(!m) return;
    m.invalidateSize();
    coucheDetail.clearLayers();
    if(type==='balade'){
      const b=BALADES.find(x=>x.id===id);
      const tr_=L.polyline(b.pts,{color:b.couleur,weight:5,opacity:.85});
      coucheDetail.addLayer(tr_);
      coucheDetail.addLayer(L.marker(BASE,{icon:pastilleL('#8FDD1A','V')}));
      m.fitBounds(tr_.getBounds(),{padding:[26,26]});
    } else {
      const src = type==='vin' ? VIGNOBLE : ALSACE;
      const d = src.find(x=>x.id===id), i = src.indexOf(d);
      coucheDetail.addLayer(L.marker(d.pos,{icon:pastilleL(type==='vin'?'#9E4455':'#3E9FB0',String(i+1))}));
      m.setView(d.pos,16);
    }
  },90);
}
function fermerDetail(){
  detailCourant=null;
  document.getElementById('sur-detail').classList.remove('ouverte');
  document.body.style.overflow='';
}
document.getElementById('det-fermer').addEventListener('click',fermerDetail);
document.getElementById('sur-detail').addEventListener('click',e=>{ if(e.target.id==='sur-detail') fermerDetail(); });

/* ===================== MESSAGERIE PAR CODE =====================
   Pas de compte utilisateur : le code de réservation est la seule clé d'accès.
   Vide  -> mode démonstration, les messages vivent dans la page.
   Rempli -> vraie messagerie temps réel via Supabase.

   Table à créer dans l'éditeur SQL du projet :

     create table messages (
       id bigint generated always as identity primary key,
       code text not null,
       auteur text not null check (auteur in ('client','equipe')),
       texte text not null,
       cree_le timestamptz not null default now()
     );
     create index on messages (code, cree_le);
     alter table messages enable row level security;

   Attention : une clé anonyme dans une page publique laisse lire la table si
   la politique RLS est trop large. Le filtrage par code doit se faire côté
   serveur, dans une fonction edge, jamais dans le navigateur. À faire relire
   avant mise en ligne. */
const SUPABASE_URL = "";
const SUPABASE_ANON = "";
const useS = () => SUPABASE_URL.trim().length > 0 && SUPABASE_ANON.trim().length > 0;

let sb = null, filCourant = null, canal = null;
const FILS = {};
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
    return;
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
/* la messagerie est dormante (onglet masqué) : ne pas proposer de l'ouvrir
   après la réservation. Retirer la classe hidden de l'onglet la réactive. */
if(document.querySelector('.onglet.hidden[data-page="messagerie"]'))
  document.getElementById('ok-vers-msg').style.display='none';

/* ===================== CALENDRIER DE RÉSERVATION =====================
   Remplace le sélecteur de date du navigateur : grand, multilingue,
   jours passés bloqués, dimanche fermé (horaires lun–sam), et sous chaque
   jour le nombre de vélos disponibles — la sélection du client si elle
   existe, sinon l'ensemble de la flotte. Les disponibilités viennent de
   dispo(), la simulation stable déjà utilisée par la liste des vélos. */
let calMois=null;
function rendreCal(){
  const el=document.getElementById('cal'); if(!el) return;
  const sel=document.getElementById('date').value;
  if(!calMois){ const d=new Date(sel+'T12:00:00'); calMois=new Date(d.getFullYear(),d.getMonth(),1); }
  const loc={fr:'fr-FR',en:'en-GB',de:'de-DE',es:'es-ES',it:'it-IT'}[lang];
  const auj=new Date(); auj.setHours(0,0,0,0);
  const y=calMois.getFullYear(), m=calMois.getMonth();
  const nbj=new Date(y,m+1,0).getDate();
  const decal=(new Date(y,m,1).getDay()+6)%7;           /* lundi en tête */
  const pad=n=>String(n).padStart(2,'0');
  const choisis=VELOS.filter(v=>panier[v.id]>0);
  const precOK = new Date(y,m,1) > new Date(auj.getFullYear(),auj.getMonth(),1);
  let h='<div class="cal-haut">'+
    `<button type="button" class="cal-fl" data-cal="-1" aria-label="&#8592;" ${precOK?'':'disabled'}>&#8249;</button>`+
    `<b>${new Date(y,m,1).toLocaleDateString(loc,{month:'long',year:'numeric'})}</b>`+
    '<button type="button" class="cal-fl" data-cal="1" aria-label="&#8594;">&#8250;</button></div>'+
    '<div class="cal-grille">';
  for(let i=0;i<7;i++)
    h+=`<div class="cal-j">${new Date(2026,0,5+i).toLocaleDateString(loc,{weekday:'narrow'})}</div>`;
  for(let i=0;i<decal;i++) h+='<div class="cal-c vide"></div>';
  for(let j=1;j<=nbj;j++){
    const d=new Date(y,m,j), ds=`${y}-${pad(m+1)}-${pad(j)}`;
    const cls=['cal-c'], aujd=d.getTime()===auj.getTime();
    let bas='';
    if(d<auj) cls.push('passe');
    else if(d.getDay()===0){ cls.push('ferme'); bas=`<span class="n">${tr('book.closedDay')}</span>`; }
    else{
      cls.push('ouvrable');
      const n=choisis.length?Math.min(...choisis.map(v=>dispo(v,ds))):VELOS.reduce((s,v)=>s+dispo(v,ds),0);
      const seuil=choisis.length?2:5;
      bas=`<span class="n ${n===0?'dnul':n<=seuil?'dbas':'dok'}">${n===0?'0':n+' &#128690;'}</span>`;
      if(n===0){ cls.splice(cls.indexOf('ouvrable'),1); cls.push('complet'); }
    }
    if(ds===sel) cls.push('choisi');
    if(aujd) cls.push('aujd');
    h+=`<div class="${cls.join(' ')}" ${cls.includes('ouvrable')?`data-jour="${ds}"`:''}>${j}${bas}</div>`;
  }
  el.innerHTML=h+'</div>';
}
document.getElementById('cal').addEventListener('click',e=>{
  const fl=e.target.closest('[data-cal]');
  if(fl){ calMois=new Date(calMois.getFullYear(),calMois.getMonth()+ +fl.dataset.cal,1); rendreCal(); return; }
  const c=e.target.closest('[data-jour]'); if(!c) return;
  const inp=document.getElementById('date');
  inp.value=c.dataset.jour;
  inp.dispatchEvent(new Event('change'));
});

/* ===================== DÉMARRAGE ===================== */
const dd=new Date(); dd.setDate(dd.getDate()+1);
if(dd.getDay()===0) dd.setDate(dd.getDate()+1);        /* jamais un dimanche */
document.getElementById('date').value=dd.toISOString().slice(0,10);
document.getElementById('date').min=new Date().toISOString().slice(0,10);
/* langue : le paramètre ?lang= de l'URL (liens hreflang, partages) prime
   sur la langue du navigateur */
const nav=(navigator.language||'fr').slice(0,2);
if(T[nav]){ lang=nav; document.getElementById('langue').value=nav; }
const langURL=new URLSearchParams(location.search).get('lang');
if(langURL && T[langURL]){ lang=langURL; document.getElementById('langue').value=langURL; }
appliquerLangue();
majOngletActif();

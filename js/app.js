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
  majRecap();
});

document.getElementById('date').addEventListener('change',rendreVelos);
document.getElementById('duree').addEventListener('change',()=>{ rendreTarifs(); rendreVelos(); });

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

/* ===================== DÉMARRAGE ===================== */
const dd=new Date(); dd.setDate(dd.getDate()+1);
document.getElementById('date').value=dd.toISOString().slice(0,10);
document.getElementById('date').min=new Date().toISOString().slice(0,10);
const nav=(navigator.language||'fr').slice(0,2);
if(T[nav]){ lang=nav; document.getElementById('langue').value=nav; }
appliquerLangue();
majOngletActif();

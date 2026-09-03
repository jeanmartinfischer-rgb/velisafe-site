/* VÉLI SAFE — atelier du loueur.
   Colle le message WhatsApp d'une demande (cinq langues possibles) et produit
   le contrat de location PDF pré-rempli, à imprimer en deux exemplaires.
   Document de travail : à faire valider par un juriste avant usage réel. */

const LANGS = ['fr','en','de','es','it'];

/* ---------- lecture du message ---------- */
function analyser(txt){
  const lignes = txt.split('\n').map(l=>l.trim()).filter(Boolean);
  if(!lignes.length) return null;
  // langue : celle dont le titre wa.title apparaît dans le message
  let L = LANGS.find(l => lignes.some(x => x === T[l]['wa.title'])) || null;
  const d = {code:'', nom:'', tel:'', date:'', duree:'', total:'', velos:[]};
  // code toujours reconnaissable
  const mc = txt.match(/VS-[A-Z2-9]{6}/);
  if(mc) d.code = mc[0];
  if(!L){
    // secours : deviner la langue par l'étiquette du code
    L = LANGS.find(l => lignes.some(x => x.startsWith(T[l]['book.code']))) || 'fr';
  }
  const cle = (id) => T[L][id];
  const apres = (etiquette) => {
    const ligne = lignes.find(x => x.startsWith(etiquette + ' :') || x.startsWith(etiquette + ':'));
    return ligne ? ligne.slice(ligne.indexOf(':') + 1).trim() : '';
  };
  d.nom   = apres(cle('book.name'));
  d.tel   = apres(cle('book.phone'));
  d.date  = apres(cle('book.date'));
  d.total = apres(cle('book.total')).replace(/\(.*\)$/,'').trim();
  // durée : retrouver la clé et la redonner en français
  const dur = apres(cle('book.duration'));
  for(const k of ['book.half','book.full','book.d2','book.d3','book.d7'])
    if(dur && T[L][k] === dur) d.duree = T.fr[k];
  if(!d.duree) d.duree = dur;
  // vélos : lignes « - N × Nom », noms redonnés en français
  lignes.forEach(x=>{
    const m = x.match(/^-\s*(\d+)\s*×\s*(.+)$/);
    if(!m) return;
    const v = VELOS.find(v => LANGS.some(l => v.nom[l] === m[2].trim()));
    d.velos.push({q:+m[1], nom: v ? v.nom.fr : m[2].trim()});
  });
  return (d.code || d.nom) ? d : null;
}

/* ---------- logo (chargé depuis assets/, ignoré si indisponible) ---------- */
function chargerLogo(cb){
  const img = new Image();
  img.onload = ()=>{ try{
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img,0,0);
    cb(c.toDataURL('image/png'), img.naturalWidth/img.naturalHeight);
  }catch(e){ cb(null); } };
  img.onerror = ()=>cb(null);
  img.src = 'assets/logo.png';
}

/* ---------- contrat PDF ---------- */
function genererContrat(d){
  const {jsPDF} = window.jspdf;
  const doc = new jsPDF({unit:'mm',format:'a4'});
  const M=15, W=180; let y=14;
  const VERT=[68,93,71], GRIS=[92,107,95], AMBRE=[122,90,18], NOIR=[37,50,42];

  const titre=(t)=>{ saut(9); doc.setFont('helvetica','bold'); doc.setFontSize(11);
    doc.setTextColor(...VERT); doc.text(t,M,y); y+=5.5;
    doc.setTextColor(...NOIR); doc.setFont('helvetica','normal'); doc.setFontSize(9.5); };
  const para=(t,opt)=>{ const ls=doc.splitTextToSize(t,W);
    ls.forEach(l=>{ saut(4.5); doc.text(l,M,y); y+=4.4; }); if(!opt) y+=1.2; };
  const champ=(label, valeur)=>{ saut(6);
    doc.setFont('helvetica','bold'); doc.text(label+' :',M,y);
    const x = M + doc.getTextWidth(label+' : ') + 1;
    doc.setFont('helvetica','normal');
    if(valeur){ doc.text(String(valeur), x, y); }
    doc.setDrawColor(150,160,150); doc.line(x + (valeur?doc.getTextWidth(String(valeur))+3:0), y+0.8, M+W, y+0.8);
    y+=6.4; };
  const saut=(h)=>{ if(y+h>285){ doc.addPage(); y=14; } };

  const dessiner=(logo, ratio)=>{
    if(logo){ const lw=30, lh=lw/(ratio||1.47); doc.addImage(logo,'PNG',(210-lw)/2,y,lw,lh); y+=lh+3; }
    doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(...VERT);
    doc.text('CONTRAT DE LOCATION DE VÉLOS',105,y,{align:'center'}); y+=6;
    doc.setFontSize(9.5); doc.setFont('helvetica','normal'); doc.setTextColor(...GRIS);
    doc.text('VÉLI SAFE — Colmar, Alsace · 06 30 39 95 31',105,y,{align:'center'}); y+=7;
    doc.setFillColor(247,234,209); doc.rect(M,y-1,W,11,'F');
    doc.setTextColor(...AMBRE); doc.setFontSize(8);
    doc.text(doc.splitTextToSize('DOCUMENT DE TRAVAIL — à faire valider par un juriste avant utilisation. '+
      'Mentions entre crochets à compléter. Deux exemplaires, signés au retrait du matériel.',W-6),M+3,y+3);
    y+=13; doc.setTextColor(...NOIR); doc.setFontSize(9.5);

    titre('1. Parties');
    para('Le loueur : [raison sociale], [forme juridique], siège social [adresse], RCS [ville et numéro]. Téléphone : 06 30 39 95 31.');
    champ('Locataire — nom et prénom', d.nom);
    champ('Téléphone', d.tel);
    champ('Adresse', '');
    champ('Pièce d’identité (type et n°)', '');

    titre('2. Location');
    champ('Code de demande', d.code);
    champ('Retrait', d.date);
    champ('Durée', d.duree);
    champ('Retour prévu le', '');
    para('Lieu de retrait et de retour : [adresse du point de location], Colmar.');

    titre('3. Matériel loué');
    if(d.velos.length) d.velos.forEach(v=>champ(v.q+' × '+v.nom+' — n° d’identification', ''));
    else champ('Matériel', '');
    para('Accessoires remis : casque, antivol U et clé, sacoche ou panier, kit crevaison, éclairage ; batterie et chargeur pour les vélos électriques. Carte de la balade choisie et numéro d’assistance remis avec le matériel.');

    titre('4. État du matériel — contrôle contradictoire');
    para('Vérifié devant le locataire au départ et au retour : freins, pneus, direction, transmission, éclairage, avertisseur, batterie (VAE).');
    champ('Observations au départ', '');
    champ('Observations au retour', '');

    titre('5. Prix et paiement');
    champ('Total TTC, réglé sur place au retrait', d.total);
    para('Carte bancaire ou espèces. Aucun paiement en ligne : le site ne collecte aucune donnée bancaire.',1);

    titre('6. Dépôt de garantie');
    para('Caution déposée au retrait : [300 € vélo classique, 600 € vélo électrique, 150 € vélo enfant ou remorque — à valider], sous forme de [empreinte bancaire / chèque non encaissé — à valider]. Restituée au retour du matériel complet et en bon état, déduction faite des sommes dues au titre des articles 7 à 9.');

    titre('7. Obligations du locataire');
    para('Utiliser le matériel avec soin et respecter le code de la route ; porter les équipements obligatoires (casque pour les moins de 12 ans, gilet rétro-réfléchissant de nuit hors agglomération) ; attacher le vélo avec l’antivol fourni, cadre relié à un point fixe, à chaque arrêt ; ne pas prêter, sous-louer ni modifier le matériel ; ne pas rouler sous l’emprise de l’alcool ou de stupéfiants.');

    titre('8. Panne, casse, vol, retard');
    para('Panne ou incident : prévenir le loueur avant toute réparation. Dégradations facturées selon le barème remis au retrait [à établir], dans la limite de la valeur de remplacement. Vol : prévenir immédiatement et déposer plainte sous 24 heures, récépissé remis au loueur. Retard non convenu : [montant à compléter] par jour entamé.');

    titre('9. Responsabilité, données, médiation');
    para('Le locataire est responsable des dommages causés aux tiers (sa responsabilité civile). Le loueur est assuré auprès de [assureur, n° de police]. Données personnelles utilisées pour la seule gestion de la location. Médiateur de la consommation : [nom et coordonnées — désignation obligatoire].');

    titre('10. Signatures');
    para('Fait à Colmar, le ______ / ______ / __________, en deux exemplaires. Mention manuscrite du locataire : « J’ai reçu le matériel décrit ci-dessus en bon état de fonctionnement ».');
    saut(30);
    doc.setDrawColor(150,160,150);
    doc.rect(M, y, 85, 26); doc.rect(M+95, y, 85, 26);
    doc.setFontSize(8.5); doc.setTextColor(...GRIS);
    doc.text('Le loueur', M+2, y+5); doc.text('Le locataire', M+97, y+5);
    doc.save('contrat-'+(d.code||'velisafe')+'.pdf');
  };

  chargerLogo((logo,ratio)=>dessiner(logo,ratio));
}

/* ---------- page ---------- */
document.getElementById('generer').addEventListener('click',()=>{
  const err = document.getElementById('erreur');
  const d = analyser(document.getElementById('msg').value);
  if(!d){ err.textContent = 'Message non reconnu : collez le message WhatsApp complet, tel que reçu.';
          err.style.display='block'; return; }
  err.style.display='none';
  genererContrat(d);
});

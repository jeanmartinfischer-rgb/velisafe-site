# Contexte du projet — VÉLI SAFE

Site de location de vélos à Colmar, pour un client qui exploite déjà la
Conciergerie SAFE (conciergeriesafe.com, WordPress + Elementor, fait par
julien-meyer.com). Le site vélos est un projet séparé.

## Règles de travail

- Jean-Martin n'utilise pas le terminal. Aucune commande à lui faire taper.
  Les opérations Git passent par GitHub Desktop, qu'il pilote lui-même.
- Livrer des fichiers complets, prêts à coller d'un bloc. Jamais d'extraits à recoller.
- Ne jamais pousser sans qu'il écrive explicitement « pousse ».
- Ne pas citer d'article de loi, de tarif ou de fonctionnalité d'un prestataire
  sans l'avoir vérifié dans la séance.

## Structure

```
index.html      balisage seul
css/style.css   mise en forme, aucune police tierce
js/i18n.js      158 libellés d'interface dans 5 langues (fr, en, de, es, it)
js/data.js      vélos et tarifs, 11 balades, 17 villages viticoles,
                15 sites, 6 familles de partenaires
js/legal.js     4 pages légales dans les 5 langues
js/app.js       rendu, cartes, réservation, messagerie, surcouche légale
vendor/         Leaflet 1.9.4, servi en local
assets/         hero.jpg (paysage 1536 × 1024), logo.png
demo/           copie autonome en un seul fichier, pour envoi par mail
build/gen-demo.js  régénère ce fichier unique
```

Scripts classiques, pas de modules ES : le site doit s'ouvrir par double-clic
sur `index.html`, sans serveur local. Ordre de chargement :
`leaflet → i18n → data → legal → app`.

**Après toute modification des sources, régénérer `demo/` en lançant
`node build/gen-demo.js`.** Le script échoue si une ressource externe subsiste.

## Décisions déjà prises

- **Aucun paiement en ligne.** Règlement et caution sur place au retrait.
  Ne pas réintroduire de champ bancaire, ni de texte évoquant une empreinte
  bancaire ou une annulation payante : sans empreinte, rien n'est opposable.
- **Cartes sur OpenStreetMap, décision close le 03/09/2026.** Ne pas rouvrir le
  sujet Google Maps sans demande explicite de Jean-Martin. Vérifié ce jour-là :
  Google offre 10 000 chargements de carte gratuits par mois puis 7 $/1 000, mais
  exige un compte Cloud avec moyen de paiement, et la clé, visible dans le
  JavaScript de la page, doit être bridée par référent, par API et par quota.
  Le code des deux moteurs reste en place : remplir `GOOGLE_KEY` dans `js/app.js`
  suffirait à basculer. On le garde dormant, on ne le supprime pas.
- **Aucune ressource tierce au chargement.** Leaflet est servi depuis `vendor/`,
  les polices sont celles du système. Seuls les fonds de carte partent chez
  CARTO, et seulement quand le visiteur ouvre un onglet contenant une carte.
  C'est ce qui permet à la page « Cookies » d'être vraie. Ne pas réintroduire
  Google Fonts ni un CDN sans mettre la page à jour.
- **Thème clair depuis le 03/09/2026**, sur la carte de charte « Naturel &
  Apaisant » fournie par Jean-Martin : #445D47 (vert foncé), #82947C (sauge),
  #C7CFC0 (sauge clair), #C7CFC0 (sauge clair, fond de page), #F3EEEA (crème, textes sur fonds
  foncés) et un beige chaud,
  plus le teal #024F5F et le vert lime du logo en accents. L'ancien thème
  sombre est abandonné. Logo intégré en grand sur la photo d'accueil avec un
  halo clair (drop-shadow).
- **Pas de compte utilisateur.** La messagerie s'ouvre avec le code de réservation.
- **Durées de location** : demi-journée, journée, 2, 3 et 7 jours, tarif dégressif.
- **Site en une seule page depuis le 03/09/2026 (demande de Jean-Martin)** :
  les sept « pages » sont des sections empilées qui défilent ; les onglets
  font glisser vers leur section (`aller()` = scrollIntoView) et l'onglet
  actif suit le défilement (scroll-spy sur `offsetTop`). Les sections
  dormantes portent la classe `dormant` (display:none). Les cartes ne
  s'initialisent que quand leur section approche de l'écran
  (IntersectionObserver, marge 300 px) — ce qui garde vraie la promesse de
  la page Cookies, reformulée dans les cinq langues (« lorsqu'une carte
  apparaît à l'écran », plus de « onglets »).
- **Photos de vélos fournies par Jean-Martin le 03/09/2026** :
  `assets/velos/*.jpg` (ville = duo cadre femme/homme, vae, enfant, remorque),
  découpées depuis sa planche studio, + `assets/flotte.jpg` (panoramique de la
  gamme sur l'accueil, au-dessus des tarifs). Champ `photo` dans `VELOS`
  (data.js). Les anciens pictos `assets/velos/*.svg` restent en réserve.
  Crédits/licence des visuels : à confirmer par Jean-Martin (source de la
  planche non précisée). `build/gen-demo.js` inline ces chemins trouvés dans
  le JavaScript (svg et jpg). Pictogrammes d'onglets : Jean-Martin fournira
  ses propres logos — les pictos SVG actuels sont provisoires. Le bouton « Ouvrir la
  messagerie » après réservation se masque tant que l'onglet messagerie est
  dormant. Logo d'accueil agrandi (jusqu'à 280 px).
- **Fiche détaillée en surcouche (03/09/2026)** : cliquer un élément des
  listes balades, vignoble ou Alsace ouvre une fiche plein écran
  (`#sur-detail`) — carte Leaflet dédiée réutilisée, zoom 15 sur les villages
  et sites (noms de rues visibles sur Voyager), tracé complet pour les
  balades, chiffres et description. Conçue pour le mobile, où la carte de la
  page est loin sous la liste. L'ancienne fiche `#fiche-balade` sous la carte
  est supprimée. Échap, clic hors du cadre ou « Fermer » referment.
- **Étiquettes sur les cartes (03/09/2026)** : noms des villages et des sites
  affichés en permanence à côté des marqueurs (tooltips Leaflet, classe
  `.etiq`), nom + distance au survol des tracés de balades. Les étiquettes
  suivent la langue via `majEtiquettes()`.
- **Onglets Partenaires et Messagerie dormants depuis le 03/09/2026** : classe
  `hidden` sur les deux boutons de la nav (`display:none` en CSS). Les pages,
  le code et les traductions restent en place ; retirer la classe suffit à les
  réafficher. La messagerie reste accessible depuis la confirmation de
  réservation.
- **Fond de carte OpenStreetMap standard depuis le 03/09/2026, décision
  finale** (après dark_all puis Voyager, jugés illisibles par Jean-Martin) :
  `tile.openstreetmap.org`, le rendu OSM classique où rues et lieux sont
  nommés. Les fiches détaillées ouvrent au zoom 16. Les pages légales
  (mentions, données personnelles, cookies) citent la Fondation OpenStreetMap
  au lieu de CARTO dans les cinq langues — les garder synchrones si le fond
  change encore. Usage léger avec attribution : conforme à la politique des
  tuiles OSM pour un site de cette taille.
- **Encadré des domaines bio** : déplacé sous la carte du vignoble, restylé en
  teal discret, titre recentré sur les domaines (« Les domaines bio sur votre
  parcours ») — le bio n'est plus présenté comme une « spécialité alsacienne ».
- **Partenaires** : aucun partenaire réel n'est signé. Les emplacements sont
  affichés comme libres. Ne jamais afficher un nom d'entreprise sans accord écrit.
- **Pas de livraison ni de récupération de vélo.** Le retrait et le retour se font
  au point de location, toujours. Décision du 03/09/2026 : ne réintroduire aucune
  formulation qui promettrait un vélo livré, déposé ou repris ailleurs.
- **Ton des textes** : phrases courtes, pas de redondance d'un bloc à l'autre.
  Une information est dite à un seul endroit. Relire dans ce sens à chaque ajout.

## Les balades, et ce qui est mesuré

Les onze tracés sont calculés sur le réseau cyclable réel : données
OpenStreetMap, moteur BRouter, profil « trekking ». Distance, dénivelé cumulé
positif, altitude maximale et durée de pédalage sont mesurés sur ces tracés,
puis simplifiés par Douglas-Peucker à environ 60 mètres de tolérance.

| id | km | D+ | pédalage |
|----|----|----|----|
| ville | 11 | 3 | 31 min |
| egui | 22,8 | 129 | 1 h 15 |
| colmar | 22,2 | 182 | 1 h 16 |
| kayser | 29,7 | 241 | 1 h 40 |
| riqu | 39 | 447 | 2 h 25 |
| rouffach | 42 | 211 | 2 h 12 |
| canal | 43 | 16 | 2 h 01 |
| munster | 47,4 | 427 | 2 h 40 |
| rhin | 54,3 | 14 | 2 h 33 |
| hautkoe | 59,6 | 758 | 3 h 55 |
| ecomusee | 74,2 | 34 | 3 h 29 |

Ce ne sont pas des GPX officiels : le tracé suit le meilleur itinéraire cyclable
calculé entre les villages que nous avons choisis, pas un balisage sur le
terrain. Trois balades s'inspirent d'itinéraires réels et le disent dans leur
fiche : BL128, BL633 et BL617 d'Alsace à Vélo, plus la Véloroute du Vignoble
(section d'EuroVelo 5) et l'EuroVelo 15 le long du canal.

## Contenu provisoire, à ne pas prendre pour argent comptant

- Tarifs et cautions : inventés, à valider par le loueur.
- Partenaires : aucun n'est signé.
- Adresse et téléphone : repris de la conciergerie.
- Stock et disponibilités : simulés par une fonction de hachage sur la date.

Exacts en revanche, et vérifiés en séance : villages, grands crus et communes
de rattachement, coordonnées géographiques, faits historiques et patrimoniaux,
part du vignoble alsacien conduit en bio (près de 34 %, Chambre d'agriculture
d'Alsace), équipements obligatoires du cycliste.

## Pages légales

Quatre documents dans `js/legal.js`, affichés en surcouche depuis le pied de
page, dans les cinq langues : mentions légales, conditions de location, données
personnelles, cookies. **Ce sont des documents de travail.** Les mentions entre
crochets doivent être complétées par le loueur, et l'ensemble relu par un
juriste avant mise en ligne. Un bandeau ambre le rappelle en haut de chaque page.

Références vérifiées le 03/09/2026 :

- mentions obligatoires d'un site professionnel : loi n° 2004-575 du 21 juin
  2004 (LCEN), articles 6 et 19, et code de la consommation, article L111-1 ;
- médiation de la consommation : code de la consommation, L612-1, L616-1, R616-1 ;
- exceptions au droit de rétractation : code de la consommation, L221-28,
  « activités de loisirs fournies à une date ou selon une périodicité
  déterminée ». **La qualification de la location de vélo au regard de cette
  exception n'est pas tranchée** : c'est la position que prend le texte, à faire
  valider ;
- cookies : article 82 de la loi Informatique et Libertés ;
- équipement du cycliste : Sécurité routière — casque obligatoire sous 12 ans,
  gilet rétro-réfléchissant hors agglomération la nuit, freins, feux,
  catadioptres, avertisseur audible à 50 m, écouteurs interdits.

Le site ne dépose aucun cookie et n'utilise aucun stockage navigateur. Si cela
change, mettre à jour la page « Cookies » **et** poser un bandeau de
consentement avant tout dépôt.

## À compléter par le loueur

Raison sociale, forme juridique, capital, siège, RCS, TVA, courriel, directeur
de la publication, hébergeur, assureur et numéro de police, médiateur de la
consommation, crédits photo, durées de conservation des données, mesures de
sécurité, rayon d'assistance, montants de caution définitifs.

## Chantiers ouverts

1. ~~Arbitrage messagerie/WhatsApp~~ : **tranché le 03/09/2026 — WhatsApp.**
   La confirmation de réservation affiche « Envoyer la demande par WhatsApp » :
   lien wa.me/33664432803 avec message pré-rempli (code, date, durée, vélos,
   total indicatif, nom, téléphone), reconstruit dans la langue affichée.
   Le back-office du loueur est WhatsApp Business (étiquettes de suivi).
   Supabase écarté à ce stade : projets gratuits en pause après 1 semaine
   d'inactivité, plan Pro à 25 $/mois (vérifié le 03/09/2026 sur
   supabase.com/pricing). La messagerie par code reste dormante.
2. Sécurité Supabase si la messagerie passe en réel : filtrage par code côté
   serveur, jamais dans le navigateur.
3. Signer de vrais partenaires et remplacer les emplacements libres.
4. Faire relire les quatre pages légales par un juriste.
5. Balises Open Graph et `hreflang` pour les cinq langues, avant référencement.
6. ~~Dépôt Git imbriqué `velisafe/velisafe/`~~ : déplacé le 03/09/2026 dans
   `_to_delete/ancien-clone-git` (ignoré par Git). Jean-Martin peut supprimer
   `_to_delete/` quand il veut.

## Vérifications passées

**03/09/2026, première vérification.** Deux défauts trouvés et corrigés : bulles
des balades figées dans la langue du premier affichage, et texte de repli
évoquant une empreinte bancaire dans `index.html`.

**03/09/2026, après reconstruction.** Sources et fichier unique testés en
Chromium : sept onglets, cinq langues, filtres de balades, fiche détaillée,
parcours de réservation sur les cinq durées, messagerie, trois cartes, quatre
pages légales dans les cinq langues. Zéro erreur console, zéro requête échouée,
aucune clé de traduction manquante ou orpheline, aucun identifiant ou classe
CSS orphelin.

**03/09/2026, retouches d'interface.** Corrigé : les boutons `.item` (listes
balades, vignoble, Alsace) n'héritaient pas de la couleur du texte — les
navigateurs affichaient les titres en noir sur fond sombre. `color` est
désormais posé sur `.item`. Palette éclaircie et diversifiée (fonds moins
verts, accents teal à côté du lime), onglets Partenaires et Messagerie
masqués, encadré bio déplacé, tuiles Voyager. Testé en Chromium : cinq
onglets visibles, titres clairs, zéro erreur console hors tuiles bloquées
par le proxy de test.

**03/09/2026, fin de journée.** Fiche détaillée en surcouche testée en 390 × 844
(mobile) : ouverture depuis les trois listes, six chiffres des balades,
changement de langue fiche ouverte, fermeture par Échap, pages légales
intactes, zéro erreur JS. Commits locaux a4174fb puis 808b192 (fond sauge). **Dépôt publié le
03/09/2026 sur https://github.com/jeanmartinfischer-rgb/velisafe-site (privé)**
via GitHub Desktop. Le nom `velisafe` était pris : un ancien dépôt
jeanmartinfischer-rgb/velisafe existe sur le compte (source du vieux clone
parasite) ; il est inutilisé — à supprimer sur github.com à l'occasion. Les commandes git dans la VM locale laissent des
fichiers de verrou impossibles à supprimer (montage sans droit d'unlink) :
ils sont déplacés dans `_to_delete/` ; préférer GitHub Desktop pour les
opérations Git courantes.

**03/09/2026, audit de fin de journée — voir `AUDIT-2026-09-03.md`.**
24 tests utilisateur automatisés (Chromium, desktop 1280 × 900 et mobile
390 × 844) : 24/24 réussis. Audit statique : 12 contrôles validés, zéro
défaut — 162 clés i18n alignées sur les 5 langues, données complètes et
traduites, tarifs croissants, ids uniques, alt partout, seul hôte réseau
actif tile.openstreetmap.org. Restent non testables d'ici : l'arrivée réelle
du message WhatsApp sur le téléphone, et le rendu des tuiles (à valider dans
Safari — l'aperçu intégré de l'app Claude bloque internet).

## Mise en ligne

**Le site est en ligne depuis le 03/09/2026 :**
https://jeanmartinfischer-rgb.github.io/velisafe-site/
Dépôt passé en public par Jean-Martin, GitHub Pages activé (Deploy from a
branch, main, / root, HTTPS forcé). Chaque « Push origin » depuis GitHub
Desktop met le site à jour en une à deux minutes. Vérifié en ligne :
index.html, style.css (palette sauge) et app.js (tuiles OSM, lien WhatsApp)
servis correctement. Le bandeau « maquette de démonstration » reste affiché
tant que tarifs et pages légales ne sont pas validés. Prochaine étape
possible : un nom de domaine personnalisé (champ Custom domain de Pages).

**03/09/2026, soirée — PDF, contrat, SEO.**
- Récapitulatif PDF généré dans le navigateur (jsPDF 3.0.4 vendorisée dans
  `vendor/jspdf.js`, inlinée par gen-demo) : bouton à la confirmation, logo
  dans un cartouche, récap complet, conditions de location en annexe avec
  l'avertissement document de travail. L'envoi automatique de PDF par
  WhatsApp exigerait l'API payante de Meta : écarté, le client télécharge
  son PDF avant l'envoi.
- Contrat de location (docx, logo en tête) dans `documents-internes/`
  (gitignoré, jamais publié) : document de travail à faire valider par un
  juriste, champs [à compléter].
- SEO : canonical, Open Graph + image 1200×630 (`assets/og.jpg`), Twitter
  card, JSON-LD BikeStore (adresse minimale Colmar 68000, horaires
  provisoires du site), `?lang=` prioritaire sur la langue du navigateur +
  hreflang ×6, sitemap.xml, robots.txt. Les URL absolues pointent vers
  jeanmartinfischer-rgb.github.io/velisafe-site — À METTRE À JOUR partout
  (canonical, hreflang, OG, JSON-LD, sitemap, robots) si un domaine
  personnalisé arrive.
- Hors code, leviers à activer par Jean-Martin : fiche Google Business
  Profile (levier n° 1 en local), avis clients, domaine personnalisé.

**03/09/2026, atelier du loueur.** Le mécanisme wa.me ne transporte que du
texte : aucun fichier ne peut être joint à la demande WhatsApp (limitation
WhatsApp, pas un défaut du site). Le PDF récapitulatif reste côté client.
Pour le loueur : l'atelier est un FICHIER AUTONOME HORS LIGNE
(`documents-internes/atelier-velisafe.html`, jamais publié — retiré du site
le jour même à la demande de Jean-Martin : un outil interne n'a rien à faire
sur un dépôt public). Antoine l'ouvre d'un double-clic ; COLLER le message WhatsApp (Cmd+V
n'importe où sur la page, cinq langues acceptées) télécharge aussitôt le
contrat — l'automatisation complète (PDF sans aucun geste) exigerait un
serveur et l'API WhatsApp payante, écartés le 03/09/2026 : à reconsidérer
seulement si le volume dépasse ~10-15 locations/jour ; le parseur s'appuie sur les
libellés exacts de i18n.js et retraduit durée et noms de vélos en français,
puis produit le contrat de location PDF pré-rempli (jsPDF, logo chargé
depuis assets/) à imprimer en deux exemplaires. Testé : message italien →
contrat français complet, zéro erreur JS. Le format du message WhatsApp
(messageWA dans app.js) et le parseur (analyser dans atelier.js) doivent
évoluer ENSEMBLE.

**04/09/2026, domaine personnalisé EN LIGNE.** Le site est servi sur
https://velisafe.fr (HTTPS forcé). Jean-Martin a acheté velisafe.fr, .eu et
.com (sans accent) sur son compte Gandi « terrachef », sans hébergement
(GitHub Pages héberge déjà). Claude a câblé le DNS via le navigateur
intégré : zone Gandi de velisafe.fr = 4 enregistrements A sur @
(185.199.108.153, .109., .110., .111.) remplaçant l'ancien A Gandi, et
CNAME www → jeanmartinfischer-rgb.github.io. (remplaçant webredir). Côté
GitHub Pages : custom domain « velisafe.fr » enregistré, DNS check
successful, Enforce HTTPS coché. ATTENTION : GitHub a créé un commit
« CNAME » directement sur origin → toujours PULL avant PUSH dans GitHub
Desktop. Toutes les URL absolues (canonical, hreflang ×6, OG, JSON-LD,
sitemap.xml, robots.txt) basculées de github.io vers https://velisafe.fr/
— 19 remplacements, plus aucun github.io dans les sources ; démo
régénérée. Reste : redirections web Gandi de velisafe.com et velisafe.eu
vers https://velisafe.fr (action Jean-Martin, guidée), et re-signaler le
sitemap dans Google Search Console une fois la fiche Google Business créée.
Le PDF marche-a-suivre-antoine.pdf contient encore l'ancienne URL github.io
(mineur, à régénérer à l'occasion).

**04/09/2026, pictos d'onglets définitifs.** Jean-Martin a fourni sa planche
d'icônes VÉLI SAFE (PNG 1536×1024, fond sombre, style linéaire arrondi,
états normal/survol/actif/erreur). Les 7 pictos d'onglets provisoires sont
remplacés par des redessins SVG fidèles à la planche (trait currentColor,
donc adaptés au thème clair) : maison (accueil), calendrier (réservation),
vélo (balades), grappe (vignoble), carte pliée (découvrir), deux personnes
(partenaires, dormant), bulle (messagerie, dormant). À sa demande, les
bulles de texte des cartes (étiquettes .etiq et popups Leaflet) sont
passées d'arrondies à RECTANGULAIRES (border-radius:0). Démo régénérée.

**04/09/2026, fonds photographiques.** Trois photos fournies par Jean-Martin
(montagnes/vélos, Route des Vins, Vosges) converties en JPEG ≤1920px dans
`assets/fonds/`. Chaque `.page` a un fond photo pleine largeur en `::before`
(photo à 80 %, voile crème 20 %, variables `--fond`/`--fond-pos` par id de
page) ; `.entete` est passé en panneau translucide flouté pour la
lisibilité. gen-demo.js inline désormais aussi les `url(../assets/…)` du CSS.
Attribution des photos à préciser pour les mentions légales (origine IA ?).

**04/09/2026, verre dépoli + angles droits.** Bloc d'overrides en fin de
style.css : --r passé à 0 et border-radius:0 sur tous les composants
(cercles pleins conservés : numéros, flèche de nav). Effet verre
(fond translucide + backdrop-filter blur) sur les onglets de navigation,
l'onglet actif, le panneau .entete, les étiquettes .etiq, les popups
Leaflet et les bulles de messagerie. Toute évolution de rayon ou de fond
doit se faire dans CE bloc final, qui prime sur les règles d'origine.

**04/09/2026, transparence accrue + photo du Rhin.** Nouvelle photo fournie
(piste cyclable du Rhin) → assets/fonds/rhin.jpg, affectée à la section
Balades (les Vosges restent sur Découvrir l'Alsace). Voile crème des fonds
réduit de 20 % à 10 %, onglets verre passés de .38 à .20 d'opacité (actif
.68), panneau .entete à .28 avec texte foncé, bandeau d'en-tête à .55.

**04/09/2026, cartes de contenu en verre.** Tous les blocs blancs (.bloc,
.carte-info, .etape, .atout, .item, .part, .part-cta, .fil, .code-cadre,
.doc-avert, .chiffre, .encadre) passent en verre dépoli :
rgba(255,255,255,.58) + backdrop-filter blur(13px) — la photo de fond se
devine, le texte reste net. Si un mobile ancien rame au défilement,
réduire le blur de ces cartes en premier.

**04/09/2026, calendrier de réservation.** Le sélecteur de date natif du
navigateur (minuscule) est remplacé par un grand calendrier maison :
input#date passé en type=hidden (tout le code existant continue de lire
sa value), div#cal rendu par rendreCal() dans app.js. Jours passés
bloqués, dimanche fermé (horaires lun–sam du JSON-LD, la date par défaut
saute le dimanche), sous chaque jour le nombre de vélos disponibles —
la sélection du client si elle existe (min des types choisis), sinon la
somme de la flotte — calculé par la simulation dispo() existante, donc
INDICATIF : de vraies disponibilités exigeraient une base en ligne
(écartée). Deux clés i18n ajoutées ×5 (book.closedDay, book.calNote) →
165 clés. PIÈGE : ne jamais nommer une classe « ok » ou « nul » dans le
calendrier — .ok{display:none} et .stock.nul existent déjà (bug corrigé
en dok/dbas/dnul). rendreCal() est rappelé par rendreVelos() et par le
clic +/- ; le format du message WhatsApp est INCHANGÉ (atelier intact).

**04/09/2026, retest complet : 14/14.** Cinq langues, calendrier (clic,
mois, compteurs liés à la sélection, dimanches fermés), WhatsApp, fiches
détail, pages légales, mobile — zéro erreur JS. Correctif : sur mobile le
calendrier était comprimé (colonne de .champs) → .champs passe en une
colonne sous 640 px, calendrier pleine largeur.

**04/09/2026, atelier v2 : mini-application de gestion.** L'atelier hors
ligne (documents-internes/atelier-velisafe.html, 1,1 Mo, toujours
gitignoré) devient une petite app de gestion, habillée comme le site
(verre, angles droits, fond vignes) : coller un message WhatsApp télécharge
le contrat ET range la demande dans un REGISTRE local (localStorage de ce
navigateur, rien en ligne) avec statuts (Nouvelle/Confirmée/Vélos
sortis/Terminée/Annulée), recherche, filtres, re-génération du contrat
depuis une fiche, suppression, export CSV (point-virgule + BOM, ouvre
proprement dans Excel/Numbers). Même code = mise à jour de la fiche, pas
de doublon. Le fil WhatsApp reste la référence (dit dans la page).
Testé bout en bout : contrat, persistance après rechargement, statut,
export, recherche — zéro erreur JS. Sources et build-atelier.js dans le
scratchpad de la session cloud (éphémère) ; le fichier autonome reste la
référence. Le parseur dépend TOUJOURS de messageWA (app.js) : les faire
évoluer ensemble.

**04/09/2026, DÉCISION : plus aucun stock affiché.** Le site montrait des
disponibilités SIMULÉES (dispo() par hachage) : trompeur puisque rien ne
les relie à la réalité. Retiré partout — liste des vélos sans « X
disponibles », quantités bornées à la flotte (v.stock, silencieux),
calendrier sans compteurs (dates + dimanche fermé seulement), book.sub et
book.calNote réécrits ×5 (« le loueur confirme par WhatsApp »). dispo()
reste dans le code mais n'alimente plus aucun affichage. L'atelier perd
ses statuts (Antoine gère son suivi lui-même dans WhatsApp, réévaluer
dans un mois) : registre simple — fiches, recherche, contrat, suppression,
export CSV sans colonne statut. Champ statut disparu des nouvelles
fiches ; d'anciennes fiches localStorage peuvent en porter un, ignoré.
Retour possible : les statuts sont dans l'historique git du scratchpad
cloud (éphémère) et dans CE journal — les recréer est trivial.

**04/09/2026, l'atelier devient une application Mac.** Bundle fabriqué à la
main dans `documents-internes/Atelier VÉLI SAFE.app` (gitignoré, jamais
publié) : Info.plist + Contents/MacOS/atelier (script sh, chmod 755) +
Resources/{atelier.html, icone.icns}. L'icône .icns est assemblée par script
Python (chunks ic11/ic12/ic07/ic08/ic09/ic10, PNG du logo centré sur dégradé
crème→sauge). Au lancement le script copie atelier.html vers
`~/.atelier-velisafe/atelier.html` (chemin SANS espace : indispensable pour
l'URL file://) et ouvre Chrome/Edge/Brave/Chromium en mode `--app` avec
`--user-data-dir=~/.atelier-velisafe/profil` — donc un COFFRE DE DONNÉES
PROPRE À L'ATELIER, qu'un nettoyage du navigateur habituel n'efface pas et
qui se sauvegarde en copiant ce dossier. À défaut de navigateur Chromium :
`open` dans le navigateur par défaut. Pas de signature Apple : sur un autre
Mac (Antoine), premier lancement bloqué → Réglages Système > Confidentialité
et sécurité > « Ouvrir quand même » (vérifié sur support.apple.com le
04/09/2026). Une vraie app signée coûterait 99 $/an de compte développeur
pour zéro gain fonctionnel — écarté.
L'atelier détecte désormais un stockage indisponible (Safari sur fichier
local, navigation privée) et affiche un bandeau ambre au lieu de perdre les
demandes en silence ; repli en mémoire le temps de la session.
Mise à jour de l'app = remplacer Contents/Resources/atelier.html (la copie
vers ~/.atelier-velisafe se refait à chaque lancement). Les sources de
l'atelier vivent dans le scratchpad cloud (éphémère) ; le fichier autonome
`documents-internes/atelier-velisafe.html` fait foi et contient tout le code
en clair, de quoi repartir.

**10/09/2026, fausse alerte « les compteurs sont revenus ».** Jean-Martin
voyait encore les disponibilités sur velisafe.fr. Le code était bon depuis
le 04/09 (commit 1c03907) : ce sont les DEUX DERNIERS COMMITS DU 04/09 QUI
N'ÉTAIENT JAMAIS PARTIS EN LIGNE. Le site est resté figé six jours sur la
version de 23 h 07 (build Pages nº 10, commit e3df22e). Build nº 11 lancé
le 10/09 à 11 h 10 UTC sur 6d53fb6 : succès en 6 min 46 s, velisafe.fr sert
désormais app.js sans book.avail, la note du calendrier et book.sub
réécrits. MÉTHODE À RETENIR : après chaque « Push origin », vérifier que le
site a réellement changé (onglet Actions du dépôt = build « pages build and
deployment » en succès, puis Cmd+Maj+R sur le site). Les fichiers du site
sont servis avec max-age=600 : jusqu'à 10 minutes de cache après un
déploiement. Diagnostic express : comparer `last-modified` de
https://velisafe.fr/js/app.js avec la date du dernier commit.
NOTE : `git push` depuis la VM du pont échoue (identifiants GitHub dans le
trousseau macOS, invisibles depuis Linux) — la publication passe forcément
par GitHub Desktop.

**10/09/2026, animation au défilement.** Le site s'anime, sans rien changer
à la charte ni réintroduire d'angles arrondis. Effets ajoutés :
1. APPARITION AU DÉFILEMENT (scroll reveal) sur .entete .atout .carte-info
   .etape .bloc .tarifs-rapide .flotte .part .part-cta .encadre .filtres
   .velo. Deux voies : la moderne en CSS pur
   (`animation-timeline:view()`, `animation-range:entry 0% entry 42%`, sous
   `@supports`) — aucun JavaScript, donc aucun clignotement ; et un repli
   IntersectionObserver (.anim puis .vu) activé seulement si le navigateur
   ignore animation-timeline, avec filet de sécurité à 4 s. Les deux voies
   testées séparément : 27 blocs masqués puis révélés proprement.
2. PARALLAXE : `background-attachment:fixed` sur .page::before, ordinateur
   uniquement (`min-width:900px and hover:hover`) car saccadé sur iPhone.
   C'est ce qui enchaîne les photos d'une section à l'autre.
3. En-tête qui se compacte au-delà de 80 px (logo 48→38 px) + jauge de
   progression #jauge (dégradé teal→lime) ; boutons, onglets, filtres,
   jours du calendrier et vignettes de vélos réactifs au survol.
RÈGLE : ne jamais animer un élément contenant une carte Leaflet — une
transformation sur un parent déplace marqueurs et étiquettes. Le sélecteur
JS filtre déjà `:has(.map)` et les pages dormantes. Tout est coupé sous
`prefers-reduced-motion:reduce` (vérifié : blocs visibles, parallaxe en
scroll). Vérifié aussi : 35 marqueurs et 3 cartes intacts, 5 langues sans
erreur, mobile sans défilement horizontal.

**10/09/2026, animation v2 — « l'effet s'éteint après le premier écran ».**
Cause : les sections du bas sont faites de listes + cartes, exclues par
prudence ; seuls les titres bougeaient. Correctif : .liste, .item (dans le
défileur de la liste, le view() y est relatif), .reservation>* et les
cartes (.map en FONDU SEUL, jamais de déplacement) sont animés ; images-clés
en translate/scale plutôt que transform, pour laisser les survols libres
(.item:hover translateX conservé, vérifié). Blocs hauts (.liste .bloc
.flotte .tarifs-rapide) révélés dès 25 % d'entrée, cartes à 22 %, le reste
à 55 % — un bloc haut réglé à 55 % restait pâle trop longtemps sur mobile.
Filet de sécurité du repli JS corrigé : il ne révèle que ce qui est déjà à
l'écran (l'ancien révélait tout le site après 4 s, tuant l'effet en bas).
Fondu entre sections : 2e couche de fond sur .page::before (bande sauge
.94→0 sur 170 px) ; en parallaxe, attachement `scroll,scroll,fixed` (voile
et bande défilent, photo fixe). Safari 26 gère animation-timeline
(webkit.org, 10/09/2026). Test : défilement pas à pas de 300 px sur
7 222 px (ordinateur) et 16 130 px (mobile) — aucun bloc pâle dans la moitié
haute de l'écran, 35 marqueurs intacts, 5 langues sans erreur.

**10/09/2026, OFFRE 2026 D'ANTOINE (source : ses messages WhatsApp du
10/09, trois PDF de grilles + textes).** Gamme réduite à TROIS matériels :
VTC classique tout terrain (id `ville` CONSERVÉ — les balades y renvoient ;
modèle interne Riverside 500, non cité sur le site), VTT électrique VAE
(autonomie INCONNUE : « précisée au retrait », aucun chiffre), vélo enfant
(20" 6–9 ans, 24" 9–12 ans ; Riverside 100). Remorque RETIRÉE de VELOS,
bloc conservé en commentaire REMORQUE_EN_RESERVE dans data.js.
DURÉES : DUREES = demiAm, demiPm, jour, j2…j7 (9 formules) ; clés i18n
book.halfAm/halfPm/full/d2–d7 ; DUREE_CLE dans app.js ET liste des clés
dans analyser() de l'atelier — les deux mis à jour ensemble. Demi-journées :
heure de retrait imposée (9 h / 14 h, select #heure désactivé, majHeure()).
Grille (€) : VTC 15/15/25/45/60/75/90/105/120 ; VAE 29/29/45/85/120/150/
175/200/245 ; enfant 10/10/18/32/45/55/65/75/85. Tableau à 10 colonnes,
enveloppé dans .defile (défilement horizontal mobile).
OPTIONS (data.js, facturées UNE fois) : support téléphone 5 €, gilet
réfléchissant 3 € — panierOpt, rendreOptions(), #liste-options, dans le
récap, le message WhatsApp (lignes « - N × … »), le PDF et le contrat ;
l'atelier les reconnaît dans les 5 langues (OPTIONS.nom) et les retraduit.
INCLUS (home.inc1–6, a4d, legal ×5, contrat) : casque, antivol, kit
anti-crevaison + mini-pompe, panier amovible, sonnette, éclairage av/ar,
béquille. Plus de sacoche, plus de carte papier (Antoine : « tout
numérique »), plus d'assistance téléphonique dans la liste.
HORAIRES : lun–sam 9 h–18 h (JSON-LD closes 18:00), demi-journées 9–13 /
14–18, retour avant 18 h ; hours3 → « Fermé le dimanche et les jours
fériés » (ALIGNÉ SUR LE CALENDRIER, à confirmer avec Antoine — il n'a rien
dit du dimanche). Caution : plus de montants affichés, « peut être demandée »
(legal : « peut être constituée », montants restent [à compléter]).
174 clés i18n alignées ×5. Testé 11/11 : grille, heure imposée, total avec
options 128 €, message WA, atelier FR et IT → contrat, mobile, 5 langues.
Reste côté Antoine : autonomies VAE, montants de caution, dimanche, Google
Drive/QR des balades (idée à lui — le site fait déjà « tout numérique »).

**10/09/2026, retours de Jean-Martin sur l'offre 2026.** Le site en ligne
était à jour (vérifié : data.js servi à 13 h 04 UTC avec OPTIONS) ; les
options étaient simplement trop discrètes. Correctifs :
- OPTIONS visibles à trois endroits : deux lignes surlignées lime dans le
  tableau des tarifs (rendreTarifs, colspan sur les 9 durées, « facturé une
  fois »), cartes .velo.option avec picto dans la réservation (même poids
  visuel que les vélos), note sous le tableau.
- PICTOS AU TRAIT (style de la planche d'icônes, currentColor, angles
  droits) : casque, antivol, panier, kit, pompe, éclairage, sonnette,
  béquille, support téléphone, gilet, vélo, horloge, carte, bouclier.
  Dans « Compris dans chaque location » (li = svg + span data-t : NE JAMAIS
  mettre data-t sur le li, appliquerLangue écrase les enfants), dans les 4
  atouts (remplacent les emojis), dans les options (PICTO_OPT dans app.js).
- FLOTTE : assets/flotte-3velos.jpg = panoramique recadrée à 80,8 % de
  largeur, remorque hors champ ; flotte.jpg conservée en réserve.
- LIEN PAR BALADE au lieu du Google Drive proposé par Antoine :
  `?balade=<id>` (ids : ville egui colmar kayser riqu rouffach canal munster
  rhin hautkoe ecomusee) ouvre la fiche directement, dans la langue de
  `&lang=`. Dans la fiche : bouton « Copier le lien » (navigator.share sur
  mobile, presse-papiers sinon) et « Télécharger le tracé (GPX) » généré à
  la volée depuis b.pts (tracé simplifié, 20–111 points, identique à la
  carte). Clés i18n det.link / det.linkOk / det.gpx / book.once ×5 →
  178 clés. Planche documents-internes/qr-balades-antoine.pdf (12 QR :
  section + 11 balades, reportlab + qrcode, script dans le scratchpad).
  Position tenue : un Drive = 11 documents à entretenir, une dépendance
  Google, pas de multilingue ; le site fait déjà tout cela.
Testé 10/10 : pictos, lignes d'options, cartes d'options, GPX, copie du
lien, lien direct ?balade=egui en allemand, 5 langues.

**10/09/2026, AUDIT COMPLET — voir AUDIT-2026-09-10.md.** Neuf incohérences
corrigées : champ e-mail supprimé (collecté sans usage : absent du message
WhatsApp, aucun courriel envoyé — validation et book.alert ×5 réécrits,
book.okTxt sans {m}) ; « messagerie du site » → WhatsApp/téléphone dans
CGV art. 11 et 15 ×5 et book.cond5 ×5 ; page Données personnelles :
paragraphe « Demande par WhatsApp (Meta Platforms Ireland) », plus
d'adresse électronique, hébergeur GitHub Pages — GitHub, Inc., 88 Colin P.
Kelly Jr. St., San Francisco, CA 94107 (vérifié sur docs.github.com) —
avec transfert hors UE déclaré [encadrement juriste] ; mentions : hébergeur
rempli, crédits = « visuels générés par IA, non contractuels » ×5 ; contrat
atelier art. 6 sans remorque ni 300/600/150 ; marche-à-suivre PDF régénéré
sur velisafe.fr. RAPPEL FACTUEL : 300/600/150 € étaient des repères
INVENTÉS pour la maquette, jamais validés par Antoine — ne pas les
réintroduire sans son chiffre. Décisions Antoine et points juriste listés
dans le rapport (§3, §4). Compteur d'audience : bloqué sur la création du
compte GoatCounter par Jean-Martin. Contrôles : 178 clés ×5, 125 data-t et
49 tr() existants, ids uniques, alt partout, JSON-LD valide, 0 résidu,
7/7 tests dynamiques.

**10/09/2026, compteur d'audience DORMANT + dossier de remise.** Vérifié :
aucun compteur hébergé sérieux ne fonctionne sans compte (CounterAPI
compris). Donc câblage complet mais inactif : `AUDIENCE_CODE=''` dans
data.js (config partagée site + atelier). Si renseigné (ex. 'velisafe') :
app.js injecte gc.zgo.at/count.js avec data-goatcounter, l'atelier lit
https://CODE.goatcounter.com/counter/TOTAL.json (aujourd'hui / 7 jours /
total, nécessite « Allow adding visitor counter » dans les réglages
GoatCounter — à vérifier à l'activation, CORS compris) + bouton tableau de
bord. Vide = zéro requête (vérifié). À L'ACTIVATION : pages Cookies et
Données personnelles ×5 à réécrire (elles affirment aujourd'hui « aucun
traceur »), rebuild atelier + démo. Recommandation : que le compte soit
créé par ANTOINE (ses données, pas de transfert plus tard).
Dossier `documents-internes/Pour Antoine/` (3,3 Mo, gitignoré) : Atelier
VÉLI SAFE.app, atelier-velisafe.html (secours), contrat .docx, qr-balades,
marche-a-suivre, LISEZ-MOI.pdf (mode d'emploi, Gatekeeper, 3 règles),
decisions-attendues.pdf (12 questions + 4 points juriste). Script des PDF :
scratchpad/gen-dossier.py. À transmettre par AirDrop ou clé USB, jamais
par lien public.

**10/09/2026, NUMÉRO D'ANTOINE : 07 71 81 99 17** (remplace le 06 30 39 95 31
de Jean-Martin, qui servait aux tests). Formats à jour partout : wa.me/
33771819917 (app.js), +33771819917 (JSON-LD), +33 7 71 81 99 17 (i18n
en/de/es/it, legal ×5), 07 71 81 99 17 (fr, contrat atelier, docx, PDF
marche-à-suivre, QR, lisez-moi, décisions). Aucun résidu de l'ancien numéro
(vérifié : grep + rendu). **Directeur de la publication : Antoine Fischer,
directeur général** (mentions ×5) ; contrat atelier et docx : « représentée
par Antoine Fischer, directeur général », bloc de signature nommé. Raison
sociale et forme juridique toujours à compléter. Dossier « Pour Antoine »
resynchronisé (app, html, docx, 4 PDF). Scripts conservés dans le
scratchpad : gen-qr.py, gen-dossier.py + gen-dossier-docs.py, contrat.js,
marche.py — tous portent le nouveau numéro.

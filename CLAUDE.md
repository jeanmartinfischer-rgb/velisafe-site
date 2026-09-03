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

1. Interface côté loueur pour répondre dans la messagerie, ou bascule sur un
   bouton WhatsApp pré-rempli avec le code. Arbitrage non tranché.
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

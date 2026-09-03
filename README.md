# VÉLI SAFE — site de location de vélos, Colmar

Site vitrine avec prise de réservation pour un loueur de vélos à Colmar,
service rattaché à la Conciergerie SAFE.

Dépôt de travail, privé. Rien n'est en ligne.

## Arborescence

```
index.html                        la page, le balisage seul
css/style.css                     toute la mise en forme
js/i18n.js                        libellés des cinq langues
js/data.js                        vélos, balades, villages viticoles, sites
js/app.js                         rendu, cartes, réservation, messagerie
assets/hero.jpg                   photo d'accueil
assets/logo.png                   logo détouré, fond transparent
demo/velisafe-fichier-unique.html copie autonome, à envoyer par mail
```

Scripts classiques, pas de modules : le site s'ouvre par double-clic sur `index.html`,
sans serveur local. Chargés dans l'ordre `i18n → data → app`, ne pas intervertir.

Le fichier de `demo/` est une **copie figée**, pratique pour l'envoyer au client sans
lui expliquer comment ouvrir un dossier. Il ne se met pas à jour tout seul :
après une modification, il faut le régénérer.

## Ce que fait le site

- Six onglets : Accueil, Réservation, Balades, Vignoble, Découvrir l'Alsace, Messagerie.
- Réservation demi-journée ou journée, quatre types de vélos, stock variable selon la date.
- Aucun paiement en ligne : règlement et caution sur place au retrait.
- Cinq langues, détection de la langue du navigateur au chargement.
- Trois cartes : cinq boucles au départ de Colmar, huit villages viticoles, huit sites en Alsace.
- Messagerie par code de réservation, sans compte utilisateur.

Besoin d'internet pour les polices, les fonds de carte et la bibliothèque Leaflet.

## Les interrupteurs, en haut de `js/app.js`

```js
const GOOGLE_KEY    = "";   // vide -> OpenStreetMap sombre ; rempli -> Google Maps
const SUPABASE_URL  = "";   // vide -> messagerie en démonstration
const SUPABASE_ANON = "";   // rempli -> messagerie temps réel
```

Le SQL de création de la table `messages` est en commentaire au-dessus des constantes Supabase.

## Contenu provisoire

Ce qui est faux dans le fichier et qu'il faudra remplacer :

- **Tracés des balades** : reliés village par village à la main, pas des traces GPX officielles.
- **Tarifs** : inventés.
- **Domaines viticoles** : seulement des villages et leurs grands crus, aucun partenaire réel.
- **Adresse et téléphone** : repris de la conciergerie, à confirmer.

Les villages, les grands crus et les coordonnées géographiques sont exacts.

## Chantiers ouverts

1. Interface côté loueur pour répondre dans la messagerie — ou bascule sur WhatsApp.
2. Sécurité Supabase : filtrage par code côté serveur, pas dans le navigateur.
3. Cartes : rester sur OpenStreetMap ou passer à Google avec une clé au nom du client.
4. Pages légales et mention de rétractation, avant toute mise en ligne publique.

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
index.html      balisage seul, 11 Ko
css/style.css   mise en forme
js/i18n.js      libellés des 5 langues (fr, en, de, es, it)
js/data.js      vélos, balades, villages viticoles, sites à visiter
js/app.js       rendu, cartes, réservation, messagerie
assets/         hero.jpg, logo.png
demo/           copie autonome en un seul fichier, pour envoi par mail
```

Scripts classiques, pas de modules ES : le site doit s'ouvrir par double-clic
sur `index.html`, sans serveur local. Ordre de chargement `i18n → data → app`.

Le fichier de `demo/` est figé. Après toute modification des sources, le
régénérer en réinjectant CSS, JS et images en base64 dans une copie d'index.html.

## Décisions déjà prises

- **Aucun paiement en ligne.** Règlement et caution sur place au retrait.
  Ne pas réintroduire de champ bancaire.
- **Thème sombre**, palette imposée par le client : #445D47, #82947C, #C7CFC0,
  #F3EEEA, plus le teal #024F5F et le vert lime du logo.
- **Mise en page plein écran** : image d'accueil pleine largeur et pleine hauteur.
- **Pas de compte utilisateur.** La messagerie s'ouvre avec le code de réservation.
- **Cartes sur OpenStreetMap** par défaut. Google Maps possible en remplissant
  `GOOGLE_KEY` dans `js/app.js`, mais cela impose un compte Google Cloud avec
  moyen de paiement, au nom du client et pas de Jean-Martin.

## Contenu provisoire, à ne pas prendre pour argent comptant

- Tracés des cinq balades : reliés village par village à la main, pas des GPX officiels.
- Tarifs : inventés.
- Domaines viticoles : uniquement des villages et leurs grands crus, aucun partenaire réel.
- Adresse et téléphone : repris de la conciergerie.

Exacts en revanche : villages, grands crus, coordonnées géographiques, faits
historiques et patrimoniaux.

## Chantiers ouverts

1. Interface côté loueur pour répondre dans la messagerie, ou bascule sur un
   bouton WhatsApp pré-rempli avec le code. Arbitrage non tranché.
2. Sécurité Supabase si la messagerie passe en réel : filtrage par code côté
   serveur, jamais dans le navigateur.
3. Remplacement des tracés par de vrais GPX.
4. Pages légales, RGPD et mention de rétractation, avant toute mise en ligne
   publique. Formulation à faire valider par un juriste.

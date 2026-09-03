/* VÉLI SAFE — pages légales du pied de site, dans les cinq langues.

   DOCUMENT DE TRAVAIL. Les mentions entre crochets doivent être complétées
   par le loueur. L'ensemble doit être relu par un juriste avant toute mise
   en ligne publique : la qualification du contrat de location de vélo au
   regard du droit de la consommation, et notamment l'application de
   l'exception au droit de rétractation, n'est pas tranchée ici.

   Références vérifiées le 3 septembre 2026 :
   - mentions obligatoires d'un site professionnel : loi n° 2004-575 du
     21 juin 2004 pour la confiance dans l'économie numérique, articles 6
     et 19, et code de la consommation, article L111-1 ;
   - médiation de la consommation : code de la consommation, articles
     L612-1, L616-1 et R616-1 ;
   - exceptions au droit de rétractation : code de la consommation,
     article L221-28 ;
   - cookies et traceurs : article 82 de la loi Informatique et Libertés ;
   - équipement obligatoire du cycliste : Sécurité routière — casque pour
     les moins de 12 ans, gilet rétro-réfléchissant hors agglomération la
     nuit, freins, feux, catadioptres, avertisseur sonore audible à 50 m. */

const LEGAL = {
 maj:"3 septembre 2026",
 pages:['mentions','terms','privacy','cookies'],
 fr:{
  mentions:`
<h3>Éditeur du site</h3>
<p>[Raison sociale], [forme juridique] au capital de [montant] euros.<br>
Siège social : [adresse complète].<br>
Immatriculée au RCS de [ville] sous le numéro [numéro].<br>
Numéro de TVA intracommunautaire : [numéro].<br>
Téléphone : 06 30 39 95 31 · Courriel : [adresse].</p>
<p>Directeur de la publication : [nom et prénom].</p>
<h3>Hébergeur</h3>
<p>[Dénomination de l'hébergeur], [adresse complète], [téléphone].</p>
<h3>Assurance</h3>
<p>Responsabilité civile professionnelle souscrite auprès de [compagnie], police n° [numéro], couvrant l'activité de location de cycles sur le territoire [étendue géographique].</p>
<h3>Médiation de la consommation</h3>
<p>Conformément aux articles L612-1 et L616-1 du code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige qui l'oppose à un professionnel. Le médiateur désigné est [nom du médiateur], [adresse postale], [adresse du site internet].</p>
<h3>Propriété intellectuelle</h3>
<p>Les textes, les descriptions de parcours et la présentation du site sont la propriété de l'éditeur. Toute reproduction, même partielle, est soumise à autorisation écrite préalable.</p>
<h3>Cartographie et données</h3>
<p>Les fonds de carte proviennent d'OpenStreetMap, sous licence ODbL, affichés avec le rendu standard d'OpenStreetMap. Les tracés des balades sont calculés à partir des données OpenStreetMap au moyen du moteur BRouter, profil « trekking ». La bibliothèque d'affichage Leaflet est distribuée sous licence BSD à deux clauses. Les distances, dénivelés et durées affichés sont mesurés sur ces tracés : ils constituent une indication et non un engagement contractuel.</p>
<h3>Crédits photographiques</h3>
<p>[Auteur et origine de chaque photographie].</p>
<h3>Signaler une erreur</h3>
<p>Une inexactitude sur un parcours, un horaire ou un village ? Écrivez-nous : nous corrigeons et nous indiquons la date de mise à jour.</p>`,

  terms:`
<h3>1. Objet</h3>
<p>Les présentes conditions régissent la location de cycles, cycles à assistance électrique et accessoires par [raison sociale], ci-après « le loueur », à toute personne physique, ci-après « le locataire ».</p>
<h3>2. Réservation en ligne</h3>
<p>La réservation effectuée sur ce site vaut demande de mise à disposition. Elle ne constitue pas le contrat de location. <strong>Aucun paiement n'est demandé en ligne et aucune donnée bancaire n'est collectée par ce site.</strong> Le contrat de location, les présentes conditions et l'état du matériel sont remis, lus et signés au point de location, au moment du retrait.</p>
<h3>3. Conditions d'accès à la location</h3>
<ul>
<li>Le locataire doit être majeur et présenter une pièce d'identité en cours de validité, restituée au retour du matériel.</li>
<li>Les mineurs peuvent utiliser un vélo sous la responsabilité pleine et entière de l'adulte signataire du contrat, qui demeure responsable du matériel comme du comportement du mineur.</li>
<li>Le loueur se réserve le droit de refuser la remise d'un vélo à toute personne manifestement inapte à conduire, notamment sous l'emprise de l'alcool ou de stupéfiants.</li>
</ul>
<h3>4. Tarifs, durées et paiement</h3>
<p>Les tarifs affichés s'entendent par vélo, toutes taxes comprises, pour la durée choisie : demi-journée, journée, deux jours, trois jours ou sept jours. Le règlement s'effectue intégralement sur place, au retrait, par les moyens acceptés au point de location. Une caution est constituée sur place selon le matériel : [montant] euros par vélo classique, [montant] euros par vélo à assistance électrique, [montant] euros par vélo enfant ou remorque. Elle est restituée au retour du matériel en bon état.</p>
<h3>5. Location de plusieurs jours</h3>
<p>Pour toute location de deux jours ou plus, le matériel reste sous la garde du locataire, nuits comprises. Le locataire s'engage à le remiser dans un local fermé ou, à défaut, à l'attacher par le cadre à un point fixe au moyen de l'antivol fourni. La batterie d'un vélo à assistance électrique se recharge sur une prise domestique standard.</p>
<h3>6. Remise et restitution</h3>
<p>Le matériel est vérifié contradictoirement au départ et au retour : freins, pneumatiques, éclairage, transmission et, le cas échéant, niveau de batterie. La restitution intervient au point de location, aux jours et heures d'ouverture indiqués sur le contrat. Tout retard non annoncé peut donner lieu à la facturation d'une période supplémentaire, selon le tarif en vigueur.</p>
<h3>7. Équipement et règles de circulation</h3>
<p>Chaque location comprend un casque, un antivol, un kit de réparation et un éclairage conforme. Le locataire s'engage à respecter le code de la route. Il est rappelé que le port du casque est obligatoire pour le conducteur et le passager d'un cycle âgés de moins de douze ans, que le gilet rétro-réfléchissant est obligatoire hors agglomération la nuit ou par visibilité insuffisante, et que le port d'écouteurs est interdit en circulation.</p>
<h3>8. Obligations du locataire</h3>
<ul>
<li>Utiliser le matériel en bon père de famille, sur les voies ouvertes à la circulation et les chemins carrossables.</li>
<li>Ne pas le prêter, le sous-louer ni le céder à un tiers.</li>
<li>Ne pas l'utiliser en compétition, pour le transport de charges excédant les limites du constructeur, ni pour un usage acrobatique ou tout-terrain.</li>
<li>Ne procéder à aucune modification ni réparation autre que le remplacement d'une chambre à air.</li>
</ul>
<h3>9. Panne, crevaison et assistance</h3>
<p>Une assistance téléphonique est assurée pendant les heures d'ouverture. En cas d'immobilisation due à une défaillance mécanique non imputable au locataire, le loueur procède au dépannage ou à l'échange du matériel dans un rayon de [distance] kilomètres autour de Colmar, ou rembourse la fraction de location non utilisée.</p>
<h3>10. Vol, perte et dommages</h3>
<p>Le locataire est responsable du matériel pendant toute la durée de la location. En cas de vol, il doit déposer plainte sans délai et remettre le récépissé au loueur, accompagné de la clé de l'antivol. À défaut de dépôt de plainte ou de restitution de la clé, la valeur de remplacement du matériel reste due. Les dégradations constatées au retour sont facturées sur la base d'un devis de réparation communiqué au locataire.</p>
<h3>11. Annulation</h3>
<p>La réservation en ligne n'entraînant aucun paiement, elle peut être annulée à tout moment, sans frais ni justification, par la messagerie du site ou par téléphone. Le loueur demande seulement d'être prévenu afin de remettre le vélo à disposition. Le loueur peut de son côté annuler une réservation en cas d'indisponibilité du matériel ou de conditions météorologiques rendant la sortie dangereuse ; aucune somme n'ayant été versée, l'annulation ne donne lieu à aucun remboursement ni à aucune indemnité.</p>
<h3>12. Droit de rétractation</h3>
<p>L'article L221-28 du code de la consommation écarte le droit de rétractation pour les prestations de services d'hébergement, de transport, de restauration et d'activités de loisirs fournies à une date ou selon une périodicité déterminée. La location de cycles pour une date de retrait convenue relève de cette catégorie. En tout état de cause, la réservation en ligne ne donnant lieu à aucun paiement, elle peut être annulée librement dans les conditions de l'article 11.</p>
<h3>13. Assurance et responsabilité</h3>
<p>Le loueur est assuré au titre de sa responsabilité civile professionnelle. Il ne peut être tenu responsable des dommages corporels ou matériels subis par le locataire ou causés par lui à des tiers pendant la location. Il appartient au locataire de vérifier la couverture de sa propre responsabilité civile. [Préciser ici l'assurance éventuellement proposée en option et son étendue.]</p>
<h3>14. Données personnelles</h3>
<p>Les données transmises lors de la réservation sont traitées dans les conditions décrites à la page « Données personnelles » du présent site.</p>
<h3>15. Réclamations et médiation</h3>
<p>Toute réclamation peut être adressée au loueur par la messagerie du site, par téléphone ou par courrier. À défaut de solution amiable dans un délai de deux mois, le consommateur peut saisir gratuitement le médiateur de la consommation désigné dans les mentions légales, conformément aux articles L612-1 et suivants du code de la consommation.</p>
<h3>16. Droit applicable</h3>
<p>Les présentes conditions sont soumises au droit français. Elles sont rédigées en français ; les traductions proposées sur ce site sont fournies pour information et la version française fait foi.</p>`,

  privacy:`
<h3>Qui traite vos données</h3>
<p>Le responsable du traitement est [raison sociale], [adresse], joignable au 06 30 39 95 31 et à [adresse courriel]. [Coordonnées du délégué à la protection des données, s'il en est désigné un.]</p>
<h3>Ce que nous collectons, et pourquoi</h3>
<ul>
<li><strong>Réservation</strong> : nom, prénom, adresse électronique, numéro de téléphone, date, heure et durée souhaitées, matériel choisi. Ces données sont nécessaires à l'exécution du contrat que vous demandez et à la préparation du matériel.</li>
<li><strong>Messagerie</strong> : votre code de réservation et le contenu de vos messages, pour répondre à vos questions et suivre votre location.</li>
<li><strong>Contrat de location</strong> : les informations figurant sur le contrat signé au point de location, y compris la référence d'une pièce d'identité présentée, dans le cadre de l'exécution du contrat et de la conservation des pièces comptables.</li>
</ul>
<p>Nous ne collectons aucune donnée bancaire sur ce site. Nous n'établissons aucun profil, nous n'affichons aucune publicité et nous ne vendons ni ne louons vos données.</p>
<h3>Sur quelle base légale</h3>
<p>L'exécution du contrat ou des mesures précontractuelles prises à votre demande, au sens de l'article 6.1.b du règlement général sur la protection des données, pour la réservation et la location. Le respect d'obligations légales, au sens de l'article 6.1.c, pour la conservation des pièces comptables.</p>
<h3>Combien de temps</h3>
<p>Les données de réservation sont conservées [durée à fixer, par exemple trois ans] à compter du dernier contact. Les conversations de la messagerie sont supprimées [durée à fixer] après la fin de la location. Les pièces comptables sont conservées pendant la durée légale qui s'impose à l'entreprise.</p>
<h3>Qui y a accès</h3>
<p>Le personnel du loueur, dans la limite de ce que son travail exige. [Le cas échéant, l'hébergeur du site et le prestataire de messagerie, en qualité de sous-traitants, dont l'identité et la localisation des serveurs sont à préciser ici.] Aucun transfert hors de l'Union européenne n'est effectué [à confirmer selon l'hébergeur retenu].</p>
<h3>Ce que le site charge depuis l'extérieur</h3>
<p>Les pages du site n'appellent aucun service tiers, à une exception près : lorsqu'une carte apparaît à l'écran, son fond est téléchargé depuis les serveurs de la Fondation OpenStreetMap. Cette requête transmet votre adresse IP à ce fournisseur. Tant qu'aucune carte n'apparaît à l'écran, aucune donnée ne quitte votre navigateur vers un tiers.</p>
<h3>Vos droits</h3>
<p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur les données qui vous concernent. Vous pouvez les exercer en écrivant à [adresse courriel] ou à l'adresse postale du siège. Si la réponse ne vous satisfait pas, vous pouvez introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés, dont les coordonnées figurent sur le site cnil.fr.</p>
<h3>Sécurité</h3>
<p>[Décrire ici les mesures effectivement mises en œuvre : chiffrement des échanges, restriction des accès, sauvegardes. Ne pas annoncer une mesure qui n'est pas en place.]</p>`,

  cookies:`
<h3>Ce site ne dépose aucun cookie</h3>
<p>Aucun cookie n'est déposé sur votre appareil par ce site : ni cookie publicitaire, ni traceur de mesure d'audience, ni cookie de réseau social. C'est la raison pour laquelle vous ne voyez aucun bandeau de consentement en arrivant : il n'y a rien à accepter ni à refuser.</p>
<h3>Ce que dit la règle</h3>
<p>L'article 82 de la loi Informatique et Libertés soumet au consentement préalable de l'internaute toute lecture ou écriture d'informations dans son terminal, à l'exception de ce qui est strictement nécessaire au service demandé. La Commission nationale de l'informatique et des libertés admet en outre une exemption étroite pour certaines mesures d'audience anonymes. Ce site n'utilise ni les unes ni les autres.</p>
<h3>Ce que le site conserve dans votre navigateur</h3>
<p>Rien. Le code de réservation affiché après une demande et les messages échangés en mode démonstration vivent dans la page et disparaissent dès que vous la rechargez ou la fermez.</p>
<h3>Les cartes, seule exception</h3>
<p>Les cartes des sections « Balades », « Vignoble » et « Découvrir l'Alsace » affichent des fonds téléchargés depuis les serveurs de la Fondation OpenStreetMap. Ces requêtes ne partent que lorsque vous faites défiler la page jusqu'à l'une de ces cartes. Elles transmettent votre adresse IP au fournisseur, qui applique sa propre politique. Si vous ne souhaitez pas que cette requête ait lieu, il suffit de ne pas faire défiler la page jusqu'à ces cartes : le reste du site fonctionne sans.</p>
<h3>Si cela change</h3>
<p>L'ajout d'un outil de statistiques, d'une carte interactive tierce ou d'un module de réservation externe modifierait ce constat. Le jour où ce sera le cas, cette page sera mise à jour et un bandeau de consentement sera mis en place avant tout dépôt.</p>`
 },
 en:{
  mentions:`
<h3>Site publisher</h3>
<p>[Company name], [legal form] with share capital of [amount] euros.<br>
Registered office: [full address].<br>
Registered with the Trade and Companies Register of [town] under number [number].<br>
EU VAT number: [number].<br>
Telephone: +33 6 30 39 95 31 · E-mail: [address].</p>
<p>Publication director: [name].</p>
<h3>Hosting provider</h3>
<p>[Host name], [full address], [telephone].</p>
<h3>Insurance</h3>
<p>Professional liability insurance with [insurer], policy no. [number], covering cycle hire in [geographical scope].</p>
<h3>Consumer mediation</h3>
<p>Under articles L612-1 and L616-1 of the French Consumer Code, every consumer is entitled to free access to a consumer mediator to settle a dispute with a professional out of court. The appointed mediator is [name], [postal address], [website].</p>
<h3>Intellectual property</h3>
<p>The texts, route descriptions and design of this site belong to the publisher. Any reproduction, even partial, requires prior written permission.</p>
<h3>Mapping and data</h3>
<p>Map backgrounds come from OpenStreetMap under the ODbL licence, with the standard OpenStreetMap rendering. Ride tracks are computed from OpenStreetMap data using the BRouter engine, "trekking" profile. The Leaflet display library is distributed under the two-clause BSD licence. Distances, elevation gains and times shown are measured on those tracks: they are an indication, not a contractual commitment.</p>
<h3>Photo credits</h3>
<p>[Author and source of each photograph].</p>
<h3>Reporting an error</h3>
<p>Found something wrong about a route, an opening time or a village? Write to us: we correct it and show the update date.</p>`,
  terms:`
<h3>1. Purpose</h3>
<p>These terms govern the hire of bicycles, electrically assisted bicycles and accessories by [company name], "the hirer", to any individual, "the customer".</p>
<h3>2. Online booking</h3>
<p>A booking made on this site is a request for the equipment to be made available. It is not the hire contract. <strong>No payment is requested online and no bank details are collected by this site.</strong> The hire contract, these terms and the condition report are handed over, read and signed at the shop, when you collect the bike.</p>
<h3>3. Who may hire</h3>
<ul>
<li>The customer must be of full age and present valid photo identification, which is returned when the equipment comes back.</li>
<li>Minors may ride under the full responsibility of the adult who signs the contract, who remains liable for the equipment and for the minor's conduct.</li>
<li>The hirer may refuse to hand over a bike to anyone visibly unfit to ride, in particular under the influence of alcohol or drugs.</li>
</ul>
<h3>4. Prices, durations and payment</h3>
<p>Prices are per bike, all taxes included, for the chosen duration: half-day, full day, two days, three days or seven days. Payment is made in full on site, at collection, by the means accepted at the shop. A deposit is taken on site: [amount] euros per classic bike, [amount] euros per electrically assisted bike, [amount] euros per child's bike or trailer. It is returned when the equipment comes back in good order.</p>
<h3>5. Hire over several days</h3>
<p>For two days or more, the equipment stays in the customer's keeping, nights included. The customer undertakes to store it in a locked room or, failing that, to secure it by the frame to a fixed point using the lock provided. An electrically assisted bike charges from a standard domestic socket.</p>
<h3>6. Handover and return</h3>
<p>The equipment is checked jointly on departure and on return: brakes, tyres, lights, transmission and, where applicable, battery level. Return takes place at the shop, on the days and at the times stated in the contract. Any unannounced delay may be charged as an additional period at the prevailing rate.</p>
<h3>7. Equipment and road rules</h3>
<p>Every hire includes a helmet, a lock, a repair kit and compliant lights. The customer undertakes to obey the French highway code. Please note that a helmet is compulsory for riders and passengers under twelve years of age, that a reflective vest is compulsory outside built-up areas at night or in poor visibility, and that wearing earphones while riding is prohibited.</p>
<h3>8. Customer's obligations</h3>
<ul>
<li>Use the equipment with due care, on roads open to traffic and on passable tracks.</li>
<li>Do not lend, sub-let or transfer it to a third party.</li>
<li>Do not use it in competition, to carry loads beyond the manufacturer's limits, or for stunt or off-road riding.</li>
<li>Make no modification or repair other than replacing an inner tube.</li>
</ul>
<h3>9. Breakdown, punctures and assistance</h3>
<p>Telephone assistance is provided during opening hours. If the bike is immobilised by a mechanical failure not attributable to the customer, the hirer will repair or exchange the equipment within [distance] kilometres of Colmar, or refund the unused part of the hire.</p>
<h3>10. Theft, loss and damage</h3>
<p>The customer is responsible for the equipment throughout the hire. In the event of theft, the customer must report it to the police without delay and give the hirer the report together with the lock key. Without a police report or the key, the replacement value remains due. Damage found on return is charged on the basis of a repair quotation given to the customer.</p>
<h3>11. Cancellation</h3>
<p>As the online booking involves no payment, it may be cancelled at any time, free of charge and without justification, through the site's message thread or by telephone. The hirer simply asks to be told, so the bike can be released. The hirer may likewise cancel a booking if the equipment is unavailable or if weather makes the outing dangerous; as no money has been paid, no refund or compensation arises.</p>
<h3>12. Right of withdrawal</h3>
<p>Article L221-28 of the French Consumer Code sets aside the right of withdrawal for accommodation, transport, catering and leisure services supplied on a specific date or during a specific period. Cycle hire for an agreed collection date falls within that category. In any event, since the online booking involves no payment, it may be cancelled freely under article 11.</p>
<h3>13. Insurance and liability</h3>
<p>The hirer carries professional liability insurance. It cannot be held liable for personal injury or property damage suffered by the customer, or caused by the customer to third parties, during the hire. Customers should check their own liability cover. [State here any optional insurance offered and its scope.]</p>
<h3>14. Personal data</h3>
<p>Data provided when booking is processed as described on the "Personal data" page of this site.</p>
<h3>15. Complaints and mediation</h3>
<p>Complaints may be sent to the hirer through the site's message thread, by telephone or by post. Failing an amicable settlement within two months, the consumer may refer the matter free of charge to the consumer mediator named in the legal notice, under articles L612-1 et seq. of the Consumer Code.</p>
<h3>16. Governing law</h3>
<p>These terms are governed by French law. They are written in French; the translations offered on this site are for information and the French version prevails.</p>`,
  privacy:`
<h3>Who processes your data</h3>
<p>The controller is [company name], [address], reachable on +33 6 30 39 95 31 and at [e-mail]. [Contact details of the data protection officer, if one is appointed.]</p>
<h3>What we collect, and why</h3>
<ul>
<li><strong>Booking</strong>: surname, first name, e-mail address, telephone number, requested date, time and duration, equipment chosen. This is needed to perform the contract you are asking for and to prepare the equipment.</li>
<li><strong>Messages</strong>: your booking code and the content of your messages, to answer your questions and follow your hire.</li>
<li><strong>Hire contract</strong>: the information on the contract signed at the shop, including the reference of identification presented, for the performance of the contract and the keeping of accounting records.</li>
</ul>
<p>We collect no bank details on this site. We build no profiles, we display no advertising, and we neither sell nor rent your data.</p>
<h3>Legal basis</h3>
<p>Performance of the contract or of pre-contractual steps taken at your request, within the meaning of article 6.1.b of the General Data Protection Regulation, for booking and hire. Compliance with legal obligations, within the meaning of article 6.1.c, for the keeping of accounting records.</p>
<h3>How long</h3>
<p>Booking data is kept for [period to be set, for example three years] from the last contact. Message threads are deleted [period to be set] after the hire ends. Accounting records are kept for the statutory period applicable to the business.</p>
<h3>Who has access</h3>
<p>The hirer's staff, only as far as their work requires. [Where applicable, the site host and the messaging provider, as processors, whose identity and server locations are to be stated here.] No transfer outside the European Union takes place [to be confirmed once the host is chosen].</p>
<h3>What the site loads from outside</h3>
<p>The pages call no third-party service, with one exception: when a map comes into view, its background is downloaded from the OpenStreetMap Foundation's servers. That request passes your IP address to that provider. As long as no map comes into view, no data leaves your browser to a third party.</p>
<h3>Your rights</h3>
<p>You have rights of access, rectification, erasure, restriction, objection and portability over data concerning you. Exercise them by writing to [e-mail] or to the registered office. If the reply does not satisfy you, you may lodge a complaint with the French data protection authority, whose details are on cnil.fr.</p>
<h3>Security</h3>
<p>[Describe here the measures actually in place: encryption in transit, restricted access, backups. Do not announce a measure that is not implemented.]</p>`,
  cookies:`
<h3>This site sets no cookies</h3>
<p>No cookie is placed on your device by this site: no advertising cookie, no analytics tracker, no social network cookie. That is why you see no consent banner on arrival: there is nothing to accept or refuse.</p>
<h3>What the rule says</h3>
<p>Article 82 of the French Data Protection Act makes any reading or writing of information on a user's device subject to prior consent, except what is strictly necessary for the service requested. The French data protection authority also allows a narrow exemption for certain anonymous audience measurements. This site uses neither.</p>
<h3>What the site keeps in your browser</h3>
<p>Nothing. The booking code shown after a request, and the messages exchanged in demonstration mode, live in the page and disappear as soon as you reload or close it.</p>
<h3>Maps, the only exception</h3>
<p>The maps in the "Rides", "Vineyards" and "Discover Alsace" sections display backgrounds downloaded from the OpenStreetMap Foundation's servers. Those requests are only sent when you scroll to one of those maps. They pass your IP address to the provider, which applies its own policy. If you would rather that did not happen, simply do not scroll down to those maps: the rest of the site works without them.</p>
<h3>If this changes</h3>
<p>Adding a statistics tool, a third-party interactive map or an external booking module would change this. On the day that happens, this page will be updated and a consent banner will be put in place before anything is stored.</p>`
 },
 de:{
  mentions:`
<h3>Herausgeber der Website</h3>
<p>[Firmenname], [Rechtsform] mit einem Kapital von [Betrag] Euro.<br>
Sitz: [vollständige Anschrift].<br>
Eingetragen im Handelsregister von [Stadt] unter der Nummer [Nummer].<br>
Umsatzsteuer-Identifikationsnummer: [Nummer].<br>
Telefon: +33 6 30 39 95 31 · E-Mail: [Adresse].</p>
<p>Verantwortlich für den Inhalt: [Name].</p>
<h3>Hosting</h3>
<p>[Name des Hosters], [vollständige Anschrift], [Telefon].</p>
<h3>Versicherung</h3>
<p>Betriebshaftpflicht bei [Versicherer], Police Nr. [Nummer], für die Fahrradvermietung im Gebiet [geografischer Geltungsbereich].</p>
<h3>Verbrauchermediation</h3>
<p>Nach den Artikeln L612-1 und L616-1 des französischen Verbrauchergesetzbuchs hat jeder Verbraucher das Recht, zur gütlichen Beilegung einer Streitigkeit mit einem Unternehmen kostenlos einen Verbrauchermediator anzurufen. Benannter Mediator ist [Name], [Postanschrift], [Website].</p>
<h3>Urheberrecht</h3>
<p>Texte, Tourenbeschreibungen und Gestaltung dieser Website gehören dem Herausgeber. Jede auch teilweise Vervielfältigung bedarf der vorherigen schriftlichen Zustimmung.</p>
<h3>Kartografie und Daten</h3>
<p>Die Kartenhintergründe stammen von OpenStreetMap unter der ODbL-Lizenz, im Standard-Rendering von OpenStreetMap. Die Tourenverläufe werden aus OpenStreetMap-Daten mit der BRouter-Engine, Profil „trekking", berechnet. Die Anzeigebibliothek Leaflet steht unter der BSD-Lizenz mit zwei Klauseln. Angezeigte Distanzen, Höhenmeter und Zeiten sind auf diesen Verläufen gemessen: Sie sind ein Anhaltspunkt, keine vertragliche Zusage.</p>
<h3>Bildnachweise</h3>
<p>[Urheber und Herkunft jeder Aufnahme].</p>
<h3>Fehler melden</h3>
<p>Etwas stimmt nicht bei einer Tour, einer Öffnungszeit oder einem Dorf? Schreiben Sie uns: Wir korrigieren es und nennen das Datum der Aktualisierung.</p>`,
  terms:`
<h3>1. Gegenstand</h3>
<p>Diese Bedingungen regeln die Vermietung von Fahrrädern, Pedelecs und Zubehör durch [Firmenname], nachfolgend „der Vermieter", an natürliche Personen, nachfolgend „der Mieter".</p>
<h3>2. Online-Buchung</h3>
<p>Eine über diese Website vorgenommene Buchung ist eine Anfrage zur Bereitstellung. Sie ist nicht der Mietvertrag. <strong>Online wird keine Zahlung verlangt, und diese Website erhebt keine Bankdaten.</strong> Mietvertrag, diese Bedingungen und das Übergabeprotokoll werden im Laden bei der Abholung ausgehändigt, gelesen und unterschrieben.</p>
<h3>3. Wer mieten darf</h3>
<ul>
<li>Der Mieter muss volljährig sein und einen gültigen Lichtbildausweis vorlegen, der bei der Rückgabe zurückgegeben wird.</li>
<li>Minderjährige dürfen unter der vollen Verantwortung des unterzeichnenden Erwachsenen fahren, der für Material und Verhalten des Minderjährigen haftet.</li>
<li>Der Vermieter kann die Übergabe an offensichtlich fahruntüchtige Personen verweigern, insbesondere unter Einfluss von Alkohol oder Betäubungsmitteln.</li>
</ul>
<h3>4. Preise, Dauer und Zahlung</h3>
<p>Die Preise gelten pro Rad, inklusive Steuern, für die gewählte Dauer: halber Tag, ganzer Tag, zwei Tage, drei Tage oder sieben Tage. Die Zahlung erfolgt vollständig vor Ort bei der Abholung mit den im Laden akzeptierten Mitteln. Vor Ort wird eine Kaution hinterlegt: [Betrag] Euro pro Cityrad, [Betrag] Euro pro Pedelec, [Betrag] Euro pro Kinderrad oder Anhänger. Sie wird bei ordnungsgemäßer Rückgabe erstattet.</p>
<h3>5. Miete über mehrere Tage</h3>
<p>Ab zwei Tagen verbleibt das Material in der Obhut des Mieters, Nächte eingeschlossen. Der Mieter verpflichtet sich, es in einem abschließbaren Raum unterzustellen oder andernfalls mit dem gestellten Schloss am Rahmen an einem festen Punkt anzuschließen. Ein Pedelec-Akku lädt an einer normalen Haushaltssteckdose.</p>
<h3>6. Übergabe und Rückgabe</h3>
<p>Das Material wird bei Abfahrt und Rückgabe gemeinsam geprüft: Bremsen, Reifen, Licht, Antrieb und gegebenenfalls Akkustand. Die Rückgabe erfolgt im Laden zu den im Vertrag genannten Tagen und Zeiten. Unangekündigte Verspätung kann als zusätzlicher Zeitraum zum geltenden Tarif berechnet werden.</p>
<h3>7. Ausrüstung und Verkehrsregeln</h3>
<p>Jede Miete umfasst Helm, Schloss, Reparaturset und vorschriftsmäßige Beleuchtung. Der Mieter verpflichtet sich, die französische Straßenverkehrsordnung einzuhalten. Es wird darauf hingewiesen, dass für Fahrer und Mitfahrer unter zwölf Jahren Helmpflicht besteht, dass außerorts bei Nacht oder schlechter Sicht eine Warnweste zu tragen ist und dass Kopfhörer während der Fahrt verboten sind.</p>
<h3>8. Pflichten des Mieters</h3>
<ul>
<li>Das Material sorgfältig nutzen, auf für den Verkehr geöffneten Wegen und befahrbaren Pfaden.</li>
<li>Es nicht verleihen, untervermieten oder an Dritte weitergeben.</li>
<li>Es nicht im Wettkampf, für Lasten über den Herstellergrenzen oder für Sprünge und Geländefahrten nutzen.</li>
<li>Keine Änderung oder Reparatur außer dem Wechsel eines Schlauchs vornehmen.</li>
</ul>
<h3>9. Panne, Reifenschaden und Hilfe</h3>
<p>Während der Öffnungszeiten besteht telefonische Hilfe. Bei einem Stillstand durch einen technischen Defekt, den der Mieter nicht zu vertreten hat, repariert oder tauscht der Vermieter das Material im Umkreis von [Entfernung] Kilometern um Colmar oder erstattet den ungenutzten Teil der Miete.</p>
<h3>10. Diebstahl, Verlust und Schäden</h3>
<p>Der Mieter haftet für das Material während der gesamten Mietzeit. Bei Diebstahl ist unverzüglich Anzeige zu erstatten und dem Vermieter die Bestätigung samt Schlossschlüssel zu übergeben. Ohne Anzeige oder Schlüssel bleibt der Wiederbeschaffungswert geschuldet. Bei Rückgabe festgestellte Schäden werden auf Grundlage eines dem Mieter mitgeteilten Kostenvoranschlags berechnet.</p>
<h3>11. Stornierung</h3>
<p>Da die Online-Buchung keine Zahlung auslöst, kann sie jederzeit kostenfrei und ohne Begründung über die Nachrichtenfunktion oder telefonisch storniert werden. Der Vermieter bittet lediglich um Bescheid, um das Rad wieder freizugeben. Der Vermieter kann eine Buchung ebenfalls stornieren, wenn das Material nicht verfügbar ist oder das Wetter die Ausfahrt gefährlich macht; da nichts gezahlt wurde, entstehen weder Erstattung noch Entschädigung.</p>
<h3>12. Widerrufsrecht</h3>
<p>Artikel L221-28 des französischen Verbrauchergesetzbuchs schließt das Widerrufsrecht für Beherbergung, Beförderung, Bewirtung und Freizeitleistungen aus, die zu einem bestimmten Zeitpunkt oder in einem bestimmten Zeitraum erbracht werden. Die Fahrradmiete zu einem vereinbarten Abholdatum fällt in diese Kategorie. Da die Online-Buchung ohnehin keine Zahlung auslöst, kann sie nach Artikel 11 frei storniert werden.</p>
<h3>13. Versicherung und Haftung</h3>
<p>Der Vermieter ist betriebshaftpflichtversichert. Er haftet nicht für Personen- oder Sachschäden, die der Mieter während der Miete erleidet oder Dritten zufügt. Der Mieter sollte seinen eigenen Haftpflichtschutz prüfen. [Hier eine optional angebotene Versicherung und ihren Umfang angeben.]</p>
<h3>14. Personenbezogene Daten</h3>
<p>Die bei der Buchung übermittelten Daten werden nach den Angaben auf der Seite „Datenschutz" dieser Website verarbeitet.</p>
<h3>15. Beschwerden und Mediation</h3>
<p>Beschwerden können über die Nachrichtenfunktion, telefonisch oder schriftlich an den Vermieter gerichtet werden. Kommt binnen zwei Monaten keine gütliche Einigung zustande, kann der Verbraucher den in den Impressumsangaben genannten Verbrauchermediator kostenlos anrufen, nach Artikel L612-1 ff. des Verbrauchergesetzbuchs.</p>
<h3>16. Anwendbares Recht</h3>
<p>Diese Bedingungen unterliegen französischem Recht. Sie sind auf Französisch verfasst; die auf dieser Website angebotenen Übersetzungen dienen der Information, maßgeblich ist die französische Fassung.</p>`,
  privacy:`
<h3>Wer Ihre Daten verarbeitet</h3>
<p>Verantwortlich ist [Firmenname], [Anschrift], erreichbar unter +33 6 30 39 95 31 und [E-Mail]. [Kontaktdaten des Datenschutzbeauftragten, falls bestellt.]</p>
<h3>Was wir erheben, und wofür</h3>
<ul>
<li><strong>Buchung</strong>: Name, Vorname, E-Mail-Adresse, Telefonnummer, gewünschtes Datum, Uhrzeit und Dauer, gewähltes Material. Das ist zur Erfüllung des von Ihnen gewünschten Vertrags und zur Vorbereitung des Materials erforderlich.</li>
<li><strong>Nachrichten</strong>: Ihr Buchungscode und der Inhalt Ihrer Nachrichten, um Ihre Fragen zu beantworten und die Miete zu begleiten.</li>
<li><strong>Mietvertrag</strong>: die Angaben im im Laden unterschriebenen Vertrag, einschließlich der Referenz eines vorgelegten Ausweises, zur Vertragserfüllung und zur Aufbewahrung der Buchhaltungsunterlagen.</li>
</ul>
<p>Auf dieser Website werden keine Bankdaten erhoben. Wir erstellen keine Profile, zeigen keine Werbung und verkaufen oder vermieten Ihre Daten nicht.</p>
<h3>Rechtsgrundlage</h3>
<p>Erfüllung des Vertrags oder vorvertraglicher Maßnahmen auf Ihre Anfrage im Sinne von Artikel 6.1.b der Datenschutz-Grundverordnung für Buchung und Miete. Erfüllung rechtlicher Pflichten im Sinne von Artikel 6.1.c für die Aufbewahrung der Buchhaltungsunterlagen.</p>
<h3>Wie lange</h3>
<p>Buchungsdaten werden [Frist festzulegen, etwa drei Jahre] ab dem letzten Kontakt aufbewahrt. Nachrichtenverläufe werden [Frist festzulegen] nach Ende der Miete gelöscht. Buchhaltungsunterlagen werden für die gesetzlich vorgeschriebene Dauer aufbewahrt.</p>
<h3>Wer Zugriff hat</h3>
<p>Das Personal des Vermieters, nur soweit die Arbeit es erfordert. [Gegebenenfalls der Hoster und der Nachrichtendienstleister als Auftragsverarbeiter, deren Identität und Serverstandorte hier zu nennen sind.] Eine Übermittlung außerhalb der Europäischen Union findet nicht statt [nach Wahl des Hosters zu bestätigen].</p>
<h3>Was die Website von außen lädt</h3>
<p>Die Seiten rufen keinen Drittdienst auf, mit einer Ausnahme: Sobald eine Karte sichtbar wird, werden die Kartenhintergründe von den Servern der OpenStreetMap Foundation geladen. Diese Anfrage übermittelt Ihre IP-Adresse an diesen Anbieter. Solange keine Karte sichtbar wird, verlassen keine Daten Ihren Browser Richtung Dritte.</p>
<h3>Ihre Rechte</h3>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit. Wenden Sie sich an [E-Mail] oder an die Anschrift des Sitzes. Sind Sie mit der Antwort nicht zufrieden, können Sie sich bei der französischen Datenschutzbehörde beschweren; die Kontaktdaten finden Sie auf cnil.fr.</p>
<h3>Sicherheit</h3>
<p>[Hier die tatsächlich umgesetzten Maßnahmen beschreiben: Transportverschlüsselung, Zugriffsbeschränkung, Sicherungen. Keine Maßnahme ankündigen, die nicht besteht.]</p>`,
  cookies:`
<h3>Diese Website setzt keine Cookies</h3>
<p>Diese Website legt kein Cookie auf Ihrem Gerät ab: kein Werbecookie, keinen Analyse-Tracker, kein Social-Media-Cookie. Deshalb sehen Sie beim Aufruf kein Einwilligungsbanner: Es gibt nichts anzunehmen oder abzulehnen.</p>
<h3>Was die Regel sagt</h3>
<p>Artikel 82 des französischen Datenschutzgesetzes macht jedes Lesen oder Schreiben von Informationen auf dem Endgerät von der vorherigen Einwilligung abhängig, außer wenn es für den angeforderten Dienst unbedingt erforderlich ist. Die französische Datenschutzbehörde lässt zudem eine enge Ausnahme für bestimmte anonyme Reichweitenmessungen zu. Diese Website nutzt weder das eine noch das andere.</p>
<h3>Was die Website in Ihrem Browser speichert</h3>
<p>Nichts. Der nach einer Anfrage angezeigte Buchungscode und die im Demo-Modus ausgetauschten Nachrichten leben in der Seite und verschwinden beim Neuladen oder Schließen.</p>
<h3>Karten, die einzige Ausnahme</h3>
<p>Die Karten in den Abschnitten „Touren", „Weinberge" und „Elsass entdecken" zeigen Hintergründe, die von den Servern der OpenStreetMap Foundation geladen werden. Diese Anfragen gehen nur ab, wenn Sie bis zu einer dieser Karten scrollen. Sie übermitteln Ihre IP-Adresse an den Anbieter, der seine eigene Richtlinie anwendet. Wenn Sie das nicht möchten, scrollen Sie einfach nicht bis zu diesen Karten: Der Rest der Website funktioniert auch ohne.</p>
<h3>Falls sich das ändert</h3>
<p>Ein Statistikwerkzeug, eine fremde interaktive Karte oder ein externes Buchungsmodul würden das ändern. An dem Tag wird diese Seite aktualisiert und vor jeder Speicherung ein Einwilligungsbanner eingerichtet.</p>`
 },
 es:{
  mentions:`
<h3>Editor del sitio</h3>
<p>[Razón social], [forma jurídica] con un capital de [importe] euros.<br>
Domicilio social: [dirección completa].<br>
Inscrita en el Registro Mercantil de [ciudad] con el número [número].<br>
Número de IVA intracomunitario: [número].<br>
Teléfono: +33 6 30 39 95 31 · Correo electrónico: [dirección].</p>
<p>Director de la publicación: [nombre y apellidos].</p>
<h3>Alojamiento web</h3>
<p>[Nombre del proveedor], [dirección completa], [teléfono].</p>
<h3>Seguro</h3>
<p>Responsabilidad civil profesional suscrita con [compañía], póliza n.º [número], que cubre la actividad de alquiler de bicicletas en [ámbito geográfico].</p>
<h3>Mediación de consumo</h3>
<p>Conforme a los artículos L612-1 y L616-1 del Código de Consumo francés, todo consumidor tiene derecho a recurrir gratuitamente a un mediador de consumo para resolver amistosamente un litigio con un profesional. El mediador designado es [nombre], [dirección postal], [sitio web].</p>
<h3>Propiedad intelectual</h3>
<p>Los textos, las descripciones de los recorridos y la presentación del sitio son propiedad del editor. Toda reproducción, incluso parcial, requiere autorización escrita previa.</p>
<h3>Cartografía y datos</h3>
<p>Los fondos de mapa proceden de OpenStreetMap, bajo licencia ODbL, con la representación estándar de OpenStreetMap. Los trazados de las rutas se calculan a partir de datos de OpenStreetMap mediante el motor BRouter, perfil «trekking». La biblioteca de visualización Leaflet se distribuye bajo licencia BSD de dos cláusulas. Las distancias, desniveles y duraciones mostrados se miden sobre esos trazados: son una indicación, no un compromiso contractual.</p>
<h3>Créditos fotográficos</h3>
<p>[Autor y origen de cada fotografía].</p>
<h3>Señalar un error</h3>
<p>¿Algo incorrecto en una ruta, un horario o un pueblo? Escríbanos: lo corregimos e indicamos la fecha de actualización.</p>`,
  terms:`
<h3>1. Objeto</h3>
<p>Estas condiciones regulan el alquiler de bicicletas, bicicletas de asistencia eléctrica y accesorios por [razón social], en adelante «el arrendador», a toda persona física, en adelante «el arrendatario».</p>
<h3>2. Reserva en línea</h3>
<p>La reserva realizada en este sitio constituye una solicitud de puesta a disposición. No es el contrato de alquiler. <strong>No se solicita ningún pago en línea y este sitio no recoge ningún dato bancario.</strong> El contrato, estas condiciones y el estado del material se entregan, se leen y se firman en el punto de alquiler, en el momento de la recogida.</p>
<h3>3. Quién puede alquilar</h3>
<ul>
<li>El arrendatario debe ser mayor de edad y presentar un documento de identidad en vigor, que se le devuelve al entregar el material.</li>
<li>Los menores pueden usar una bicicleta bajo la plena responsabilidad del adulto firmante del contrato, responsable del material y de la conducta del menor.</li>
<li>El arrendador se reserva el derecho de no entregar una bicicleta a quien esté manifiestamente incapacitado para conducir, en particular bajo los efectos del alcohol o de estupefacientes.</li>
</ul>
<h3>4. Tarifas, duraciones y pago</h3>
<p>Las tarifas se entienden por bicicleta, impuestos incluidos, para la duración elegida: media jornada, jornada, dos días, tres días o siete días. El pago se efectúa íntegramente en el local, al recoger, por los medios admitidos. Se deposita una fianza en el local: [importe] euros por bicicleta clásica, [importe] euros por eléctrica, [importe] euros por bicicleta infantil o remolque. Se devuelve al restituir el material en buen estado.</p>
<h3>5. Alquiler de varios días</h3>
<p>A partir de dos días, el material queda bajo la custodia del arrendatario, noches incluidas. Este se compromete a guardarlo en un local cerrado o, en su defecto, a atarlo por el cuadro a un punto fijo con el candado facilitado. La batería de una bicicleta eléctrica se recarga en un enchufe doméstico normal.</p>
<h3>6. Entrega y devolución</h3>
<p>El material se revisa de forma contradictoria a la salida y a la vuelta: frenos, neumáticos, luces, transmisión y, en su caso, nivel de batería. La devolución se hace en el punto de alquiler, en los días y horas indicados en el contrato. Todo retraso no avisado puede facturarse como un periodo adicional, según la tarifa vigente.</p>
<h3>7. Equipamiento y normas de circulación</h3>
<p>Cada alquiler incluye casco, candado, kit de reparación y luces reglamentarias. El arrendatario se compromete a respetar el código de circulación francés. Se recuerda que el casco es obligatorio para conductor y pasajero menores de doce años, que el chaleco reflectante es obligatorio fuera de poblado de noche o con visibilidad insuficiente, y que está prohibido llevar auriculares al circular.</p>
<h3>8. Obligaciones del arrendatario</h3>
<ul>
<li>Usar el material con diligencia, en vías abiertas al tráfico y caminos transitables.</li>
<li>No prestarlo, subarrendarlo ni cederlo a un tercero.</li>
<li>No usarlo en competición, para transportar cargas superiores a los límites del fabricante, ni para acrobacias o campo a través.</li>
<li>No realizar ninguna modificación ni reparación distinta del cambio de una cámara.</li>
</ul>
<h3>9. Avería, pinchazo y asistencia</h3>
<p>Se presta asistencia telefónica en horario de apertura. En caso de inmovilización por un fallo mecánico no imputable al arrendatario, el arrendador repara o cambia el material en un radio de [distancia] kilómetros alrededor de Colmar, o reembolsa la parte no utilizada del alquiler.</p>
<h3>10. Robo, pérdida y daños</h3>
<p>El arrendatario es responsable del material durante todo el alquiler. En caso de robo debe denunciarlo sin demora y entregar el justificante al arrendador junto con la llave del candado. Sin denuncia o sin llave, se adeuda el valor de reposición. Los desperfectos constatados a la vuelta se facturan según un presupuesto de reparación comunicado al arrendatario.</p>
<h3>11. Anulación</h3>
<p>Como la reserva en línea no implica pago alguno, puede anularse en cualquier momento, sin gastos ni justificación, por los mensajes del sitio o por teléfono. El arrendador solo pide que se le avise para liberar la bicicleta. El arrendador puede a su vez anular una reserva si el material no está disponible o si la meteorología hace peligrosa la salida; al no haberse abonado nada, no procede reembolso ni indemnización.</p>
<h3>12. Derecho de desistimiento</h3>
<p>El artículo L221-28 del Código de Consumo francés excluye el derecho de desistimiento para los servicios de alojamiento, transporte, restauración y actividades de ocio prestados en una fecha o durante un periodo determinado. El alquiler de bicicletas para una fecha de recogida acordada entra en esa categoría. En todo caso, al no implicar pago, la reserva en línea puede anularse libremente conforme al artículo 11.</p>
<h3>13. Seguro y responsabilidad</h3>
<p>El arrendador tiene suscrito un seguro de responsabilidad civil profesional. No responde de los daños personales o materiales sufridos por el arrendatario ni de los causados por él a terceros durante el alquiler. Corresponde al arrendatario comprobar su propia cobertura. [Indicar aquí el seguro opcional ofrecido y su alcance.]</p>
<h3>14. Datos personales</h3>
<p>Los datos facilitados al reservar se tratan según lo descrito en la página «Datos personales» de este sitio.</p>
<h3>15. Reclamaciones y mediación</h3>
<p>Toda reclamación puede dirigirse al arrendador por los mensajes del sitio, por teléfono o por correo. A falta de solución amistosa en dos meses, el consumidor puede acudir gratuitamente al mediador de consumo designado en el aviso legal, conforme a los artículos L612-1 y siguientes del Código de Consumo.</p>
<h3>16. Ley aplicable</h3>
<p>Estas condiciones se someten al derecho francés. Están redactadas en francés; las traducciones ofrecidas en este sitio son informativas y prevalece la versión francesa.</p>`,
  privacy:`
<h3>Quién trata sus datos</h3>
<p>El responsable del tratamiento es [razón social], [dirección], localizable en el +33 6 30 39 95 31 y en [correo electrónico]. [Datos del delegado de protección de datos, si se designa uno.]</p>
<h3>Qué recogemos y para qué</h3>
<ul>
<li><strong>Reserva</strong>: nombre, apellidos, correo electrónico, teléfono, fecha, hora y duración deseadas, material elegido. Es necesario para ejecutar el contrato solicitado y preparar el material.</li>
<li><strong>Mensajes</strong>: su código de reserva y el contenido de sus mensajes, para responder a sus preguntas y seguir el alquiler.</li>
<li><strong>Contrato de alquiler</strong>: la información del contrato firmado en el local, incluida la referencia de un documento de identidad presentado, para la ejecución del contrato y la conservación de los documentos contables.</li>
</ul>
<p>No recogemos ningún dato bancario en este sitio. No elaboramos perfiles, no mostramos publicidad y no vendemos ni alquilamos sus datos.</p>
<h3>Base jurídica</h3>
<p>La ejecución del contrato o de las medidas precontractuales adoptadas a petición suya, en el sentido del artículo 6.1.b del Reglamento General de Protección de Datos, para la reserva y el alquiler. El cumplimiento de obligaciones legales, en el sentido del artículo 6.1.c, para la conservación de los documentos contables.</p>
<h3>Cuánto tiempo</h3>
<p>Los datos de reserva se conservan [plazo por fijar, por ejemplo tres años] desde el último contacto. Las conversaciones se suprimen [plazo por fijar] tras el fin del alquiler. Los documentos contables se conservan durante el plazo legal aplicable a la empresa.</p>
<h3>Quién accede</h3>
<p>El personal del arrendador, en la medida en que su trabajo lo exija. [En su caso, el proveedor de alojamiento y el de mensajería, como encargados del tratamiento, cuya identidad y ubicación de servidores debe indicarse aquí.] No se realiza ninguna transferencia fuera de la Unión Europea [por confirmar según el proveedor elegido].</p>
<h3>Qué carga el sitio desde fuera</h3>
<p>Las páginas no llaman a ningún servicio de terceros, con una excepción: cuando un mapa aparece en pantalla, su fondo se descarga de los servidores de la Fundación OpenStreetMap. Esa petición transmite su dirección IP a dicho proveedor. Mientras ningún mapa aparezca en pantalla, ningún dato sale de su navegador hacia un tercero.</p>
<h3>Sus derechos</h3>
<p>Dispone de derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad sobre sus datos. Puede ejercerlos escribiendo a [correo electrónico] o a la dirección del domicilio social. Si la respuesta no le satisface, puede reclamar ante la autoridad francesa de protección de datos, cuyos datos figuran en cnil.fr.</p>
<h3>Seguridad</h3>
<p>[Describir aquí las medidas realmente aplicadas: cifrado de los intercambios, restricción de accesos, copias de seguridad. No anunciar medidas que no existan.]</p>`,
  cookies:`
<h3>Este sitio no deposita ninguna cookie</h3>
<p>Este sitio no coloca ninguna cookie en su dispositivo: ni publicitaria, ni de medición de audiencia, ni de red social. Por eso no ve ningún banner de consentimiento al llegar: no hay nada que aceptar ni rechazar.</p>
<h3>Lo que dice la norma</h3>
<p>El artículo 82 de la ley francesa de protección de datos somete al consentimiento previo toda lectura o escritura de información en el terminal del usuario, salvo lo estrictamente necesario para el servicio solicitado. La autoridad francesa admite además una exención estrecha para ciertas mediciones de audiencia anónimas. Este sitio no usa ni lo uno ni lo otro.</p>
<h3>Qué guarda el sitio en su navegador</h3>
<p>Nada. El código de reserva mostrado tras una solicitud y los mensajes intercambiados en modo demostración viven en la página y desaparecen al recargarla o cerrarla.</p>
<h3>Los mapas, única excepción</h3>
<p>Los mapas de las secciones «Rutas», «Viñedos» y «Descubrir Alsacia» muestran fondos descargados de los servidores de la Fundación OpenStreetMap. Esas peticiones solo se envían cuando se desplaza hasta uno de esos mapas. Transmiten su dirección IP al proveedor, que aplica su propia política. Si prefiere evitarlo, basta con no desplazarse hasta esos mapas: el resto del sitio funciona igual.</p>
<h3>Si esto cambia</h3>
<p>Añadir una herramienta de estadísticas, un mapa interactivo de terceros o un módulo de reserva externo cambiaría este panorama. Ese día, esta página se actualizará y se instalará un banner de consentimiento antes de cualquier depósito.</p>`
 },
 it:{
  mentions:`
<h3>Editore del sito</h3>
<p>[Ragione sociale], [forma giuridica] con capitale di [importo] euro.<br>
Sede legale: [indirizzo completo].<br>
Iscritta al Registro delle imprese di [città] con il numero [numero].<br>
Partita IVA intracomunitaria: [numero].<br>
Telefono: +33 6 30 39 95 31 · E-mail: [indirizzo].</p>
<p>Direttore della pubblicazione: [nome e cognome].</p>
<h3>Hosting</h3>
<p>[Nome del fornitore], [indirizzo completo], [telefono].</p>
<h3>Assicurazione</h3>
<p>Responsabilità civile professionale sottoscritta presso [compagnia], polizza n. [numero], a copertura dell'attività di noleggio di cicli sul territorio [ambito geografico].</p>
<h3>Mediazione del consumo</h3>
<p>Ai sensi degli articoli L612-1 e L616-1 del Codice del consumo francese, ogni consumatore ha diritto di rivolgersi gratuitamente a un mediatore del consumo per la risoluzione amichevole di una controversia con un professionista. Il mediatore designato è [nome], [indirizzo postale], [sito internet].</p>
<h3>Proprietà intellettuale</h3>
<p>I testi, le descrizioni dei percorsi e la presentazione del sito appartengono all'editore. Ogni riproduzione, anche parziale, richiede autorizzazione scritta preventiva.</p>
<h3>Cartografia e dati</h3>
<p>Le basi cartografiche provengono da OpenStreetMap, con licenza ODbL, con la resa standard di OpenStreetMap. I tracciati dei percorsi sono calcolati a partire dai dati OpenStreetMap con il motore BRouter, profilo «trekking». La libreria di visualizzazione Leaflet è distribuita con licenza BSD a due clausole. Distanze, dislivelli e durate indicati sono misurati su tali tracciati: costituiscono un'indicazione, non un impegno contrattuale.</p>
<h3>Crediti fotografici</h3>
<p>[Autore e origine di ogni fotografia].</p>
<h3>Segnalare un errore</h3>
<p>Un'inesattezza su un percorso, un orario o un villaggio? Scriveteci: correggiamo e indichiamo la data di aggiornamento.</p>`,
  terms:`
<h3>1. Oggetto</h3>
<p>Le presenti condizioni disciplinano il noleggio di biciclette, biciclette a pedalata assistita e accessori da parte di [ragione sociale], di seguito «il noleggiatore», a qualsiasi persona fisica, di seguito «il cliente».</p>
<h3>2. Prenotazione online</h3>
<p>La prenotazione effettuata su questo sito vale come richiesta di messa a disposizione. Non costituisce il contratto di noleggio. <strong>Nessun pagamento è richiesto online e questo sito non raccoglie alcun dato bancario.</strong> Il contratto, le presenti condizioni e lo stato del materiale sono consegnati, letti e firmati presso il punto di noleggio, al momento del ritiro.</p>
<h3>3. Chi può noleggiare</h3>
<ul>
<li>Il cliente deve essere maggiorenne e presentare un documento d'identità in corso di validità, restituito alla riconsegna del materiale.</li>
<li>I minori possono utilizzare una bici sotto la piena responsabilità dell'adulto firmatario del contratto, che risponde del materiale e del comportamento del minore.</li>
<li>Il noleggiatore si riserva di non consegnare una bici a chi sia manifestamente inidoneo alla guida, in particolare sotto effetto di alcol o stupefacenti.</li>
</ul>
<h3>4. Tariffe, durate e pagamento</h3>
<p>Le tariffe si intendono per bici, tasse incluse, per la durata scelta: mezza giornata, giornata, due giorni, tre giorni o sette giorni. Il pagamento avviene interamente in sede, al ritiro, con i mezzi accettati al punto di noleggio. In sede è versata una cauzione: [importo] euro per bici classica, [importo] euro per bici a pedalata assistita, [importo] euro per bici bambino o rimorchio. È restituita alla riconsegna del materiale in buono stato.</p>
<h3>5. Noleggio di più giorni</h3>
<p>Da due giorni in su il materiale resta in custodia al cliente, notti comprese. Il cliente si impegna a riporlo in un locale chiuso o, in mancanza, a legarlo per il telaio a un punto fisso con il lucchetto fornito. La batteria di una bici elettrica si ricarica a una normale presa domestica.</p>
<h3>6. Consegna e riconsegna</h3>
<p>Il materiale è verificato in contraddittorio alla partenza e al rientro: freni, pneumatici, luci, trasmissione e, se del caso, livello di batteria. La riconsegna avviene al punto di noleggio, nei giorni e orari indicati nel contratto. Ogni ritardo non annunciato può essere fatturato come periodo aggiuntivo, alla tariffa in vigore.</p>
<h3>7. Attrezzatura e regole di circolazione</h3>
<p>Ogni noleggio comprende casco, lucchetto, kit di riparazione e luci a norma. Il cliente si impegna a rispettare il codice della strada francese. Si ricorda che il casco è obbligatorio per conducente e passeggero sotto i dodici anni, che il giubbotto catarifrangente è obbligatorio fuori dai centri abitati di notte o con scarsa visibilità, e che è vietato indossare auricolari durante la marcia.</p>
<h3>8. Obblighi del cliente</h3>
<ul>
<li>Usare il materiale con diligenza, su strade aperte al traffico e sterrati percorribili.</li>
<li>Non prestarlo, subaffittarlo né cederlo a terzi.</li>
<li>Non usarlo in competizione, per trasportare carichi oltre i limiti del costruttore, né per acrobazie o fuoristrada.</li>
<li>Non effettuare modifiche o riparazioni diverse dalla sostituzione di una camera d'aria.</li>
</ul>
<h3>9. Guasto, foratura e assistenza</h3>
<p>L'assistenza telefonica è garantita negli orari di apertura. In caso di fermo dovuto a un guasto meccanico non imputabile al cliente, il noleggiatore ripara o sostituisce il materiale entro [distanza] chilometri da Colmar, oppure rimborsa la parte di noleggio non utilizzata.</p>
<h3>10. Furto, perdita e danni</h3>
<p>Il cliente è responsabile del materiale per tutta la durata del noleggio. In caso di furto deve sporgere denuncia senza indugio e consegnare la ricevuta al noleggiatore insieme alla chiave del lucchetto. In mancanza di denuncia o della chiave, resta dovuto il valore di sostituzione. I danni riscontrati al rientro sono fatturati sulla base di un preventivo di riparazione comunicato al cliente.</p>
<h3>11. Annullamento</h3>
<p>Poiché la prenotazione online non comporta alcun pagamento, può essere annullata in qualsiasi momento, senza costi né giustificazione, tramite i messaggi del sito o per telefono. Il noleggiatore chiede solo di essere avvisato per rimettere la bici a disposizione. Anche il noleggiatore può annullare una prenotazione in caso di indisponibilità del materiale o di condizioni meteo che rendano pericolosa l'uscita; non essendo stato versato nulla, non spettano rimborsi né indennizzi.</p>
<h3>12. Diritto di recesso</h3>
<p>L'articolo L221-28 del Codice del consumo francese esclude il diritto di recesso per i servizi di alloggio, trasporto, ristorazione e attività di svago forniti a una data o in un periodo determinato. Il noleggio di cicli per una data di ritiro concordata rientra in tale categoria. In ogni caso, non comportando pagamento, la prenotazione online può essere annullata liberamente ai sensi dell'articolo 11.</p>
<h3>13. Assicurazione e responsabilità</h3>
<p>Il noleggiatore è assicurato per la responsabilità civile professionale. Non risponde dei danni fisici o materiali subiti dal cliente o da lui causati a terzi durante il noleggio. Spetta al cliente verificare la propria copertura. [Indicare qui l'eventuale assicurazione opzionale e la sua estensione.]</p>
<h3>14. Dati personali</h3>
<p>I dati trasmessi al momento della prenotazione sono trattati come descritto nella pagina «Dati personali» di questo sito.</p>
<h3>15. Reclami e mediazione</h3>
<p>Ogni reclamo può essere rivolto al noleggiatore tramite i messaggi del sito, per telefono o per posta. In mancanza di soluzione amichevole entro due mesi, il consumatore può rivolgersi gratuitamente al mediatore del consumo indicato nelle note legali, ai sensi degli articoli L612-1 e seguenti del Codice del consumo.</p>
<h3>16. Legge applicabile</h3>
<p>Le presenti condizioni sono soggette al diritto francese. Sono redatte in francese; le traduzioni offerte su questo sito sono fornite a titolo informativo e fa fede la versione francese.</p>`,
  privacy:`
<h3>Chi tratta i vostri dati</h3>
<p>Il titolare del trattamento è [ragione sociale], [indirizzo], raggiungibile al +33 6 30 39 95 31 e a [e-mail]. [Contatti del responsabile della protezione dei dati, se nominato.]</p>
<h3>Cosa raccogliamo e perché</h3>
<ul>
<li><strong>Prenotazione</strong>: nome, cognome, indirizzo e-mail, numero di telefono, data, ora e durata richieste, materiale scelto. Serve a eseguire il contratto richiesto e a preparare il materiale.</li>
<li><strong>Messaggi</strong>: il vostro codice di prenotazione e il contenuto dei messaggi, per rispondere alle domande e seguire il noleggio.</li>
<li><strong>Contratto di noleggio</strong>: le informazioni riportate nel contratto firmato al punto di noleggio, compreso il riferimento di un documento presentato, per l'esecuzione del contratto e la conservazione dei documenti contabili.</li>
</ul>
<p>Su questo sito non raccogliamo alcun dato bancario. Non creiamo profili, non mostriamo pubblicità e non vendiamo né affittiamo i vostri dati.</p>
<h3>Base giuridica</h3>
<p>L'esecuzione del contratto o di misure precontrattuali adottate su vostra richiesta, ai sensi dell'articolo 6.1.b del Regolamento generale sulla protezione dei dati, per prenotazione e noleggio. L'adempimento di obblighi di legge, ai sensi dell'articolo 6.1.c, per la conservazione dei documenti contabili.</p>
<h3>Per quanto tempo</h3>
<p>I dati di prenotazione sono conservati [periodo da stabilire, per esempio tre anni] dall'ultimo contatto. Le conversazioni sono cancellate [periodo da stabilire] dopo la fine del noleggio. I documenti contabili sono conservati per la durata di legge applicabile all'impresa.</p>
<h3>Chi vi accede</h3>
<p>Il personale del noleggiatore, nei limiti di quanto richiesto dal lavoro. [Se del caso, il fornitore di hosting e quello di messaggistica, quali responsabili del trattamento, la cui identità e ubicazione dei server vanno indicate qui.] Non è effettuato alcun trasferimento fuori dall'Unione europea [da confermare in base al fornitore scelto].</p>
<h3>Cosa carica il sito dall'esterno</h3>
<p>Le pagine non richiamano alcun servizio di terzi, con un'eccezione: quando una mappa appare sullo schermo, il suo sfondo è scaricato dai server della OpenStreetMap Foundation. Questa richiesta trasmette il vostro indirizzo IP a tale fornitore. Finché nessuna mappa appare sullo schermo, nessun dato lascia il vostro browser verso terzi.</p>
<h3>I vostri diritti</h3>
<p>Avete diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità sui dati che vi riguardano. Potete esercitarli scrivendo a [e-mail] o all'indirizzo della sede. Se la risposta non vi soddisfa, potete presentare reclamo all'autorità francese di protezione dei dati, i cui recapiti figurano su cnil.fr.</p>
<h3>Sicurezza</h3>
<p>[Descrivere qui le misure effettivamente attuate: cifratura degli scambi, limitazione degli accessi, backup. Non annunciare misure non in essere.]</p>`,
  cookies:`
<h3>Questo sito non usa cookie</h3>
<p>Questo sito non deposita alcun cookie sul vostro dispositivo: né pubblicitario, né di misurazione del pubblico, né di social network. Per questo non vedete alcun banner di consenso all'arrivo: non c'è nulla da accettare o rifiutare.</p>
<h3>Cosa dice la regola</h3>
<p>L'articolo 82 della legge francese sulla protezione dei dati subordina al consenso preventivo ogni lettura o scrittura di informazioni sul terminale dell'utente, salvo quanto strettamente necessario al servizio richiesto. L'autorità francese ammette inoltre un'esenzione ristretta per alcune misurazioni anonime del pubblico. Questo sito non usa né le une né le altre.</p>
<h3>Cosa conserva il sito nel vostro browser</h3>
<p>Nulla. Il codice di prenotazione mostrato dopo una richiesta e i messaggi scambiati in modalità dimostrativa vivono nella pagina e spariscono appena la ricaricate o la chiudete.</p>
<h3>Le mappe, unica eccezione</h3>
<p>Le mappe delle sezioni «Itinerari», «Vigneti» e «Scoprire l'Alsazia» mostrano basi scaricate dai server della OpenStreetMap Foundation. Queste richieste partono solo quando scorrete fino a una di quelle mappe. Trasmettono il vostro indirizzo IP al fornitore, che applica la propria politica. Se preferite evitarlo, basta non scorrere fino a quelle mappe: il resto del sito funziona lo stesso.</p>
<h3>Se qualcosa cambia</h3>
<p>L'aggiunta di uno strumento di statistiche, di una mappa interattiva di terzi o di un modulo di prenotazione esterno cambierebbe questo quadro. In quel giorno la pagina sarà aggiornata e sarà predisposto un banner di consenso prima di qualsiasi deposito.</p>`
 }
};

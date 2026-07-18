# Formation 1 — Construire un portfolio de développeur qui marche

*Un guide complet, pour tous les niveaux. Pas de théorie abstraite : des règles concrètes, des erreurs à éviter, et une checklist finale. Que tu sois débutant qui cherche son premier stage ou senior qui vise des clients, les principes sont les mêmes — seule l'ambition d'exécution change.*

---

## Partie 0 — Avant d'ouvrir ton éditeur

### 0.1 Un portfolio a UN travail

Décide d'abord à qui il s'adresse, car tout en découle :

| Cible | Ce qu'elle cherche | Ce que ton site doit faire |
|---|---|---|
| **Recruteur** | Réduire son risque | Prouver que tu sais livrer (projets réels, code lisible) |
| **Client** | Résoudre son problème | Inspirer confiance (résultats, process, contact facile) |
| **Pairs / communauté** | Apprendre de toi | Partager (articles, expérimentations, open source) |

Un portfolio qui vise tout le monde ne convainc personne. Choisis une cible principale ; les autres seront servies par ricochet.

### 0.2 La règle des 30 secondes

Un visiteur décide en moins de 30 secondes. Dans ce temps, il doit pouvoir répondre à trois questions : **qui es-tu, que fais-tu, comment te contacter**. Si l'une des trois demande un scroll ou un clic de plus, tu perds des opportunités.

---

## Partie 1 — Le contenu (80 % de la valeur)

### 1.1 Trois bons projets valent mieux que dix moyens

Le réflexe débutant est de tout montrer. C'est une erreur : ton portfolio est jugé sur son **pire** projet visible. Sélectionne 3 à 5 projets et assume le tri. Critères d'un bon projet de portfolio :

- Il résout un **problème réel** (même petit) — pas un énième clone de tutoriel
- Il est **en ligne et cliquable** (un lien mort ou un « démo bientôt » détruit la confiance)
- Tu peux en parler en profondeur (choix techniques, difficultés, ce que tu referais autrement)

> **Si tu débutes et n'as pas de « vrais » projets** : construis-en un pour quelqu'un de réel — une association, un commerce local, un ami artisan. Un vrai utilisateur transforme un exercice en expérience.

### 1.2 Présente chaque projet comme une histoire, pas une fiche

Le format qui fonctionne : **contexte → problème → solution → résultat**.

❌ « Application de gestion de tâches. React, Node.js, MongoDB. »

✅ « Une équipe de 12 personnes perdait ses demandes clients dans WhatsApp. J'ai construit un outil de suivi en temps réel (React, Socket.io) ; les demandes perdues sont passées de ~15 % à zéro. »

Les chiffres, même modestes, sont magiques : nombre d'utilisateurs, temps gagné, score Lighthouse, visiteurs. Pas de chiffres ? Décris le **avant/après**.

### 1.3 La preuve, toujours la preuve

Chaque affirmation doit être vérifiable : lien vers le site en production, lien vers le code (si ouvrable), captures d'écran réelles (jamais de mockups d'images de stock), et idéalement le site **vivant** montré directement (vidéo courte, GIF, ou aperçu embarqué). Un recruteur qui peut cliquer et utiliser ton travail est déjà à moitié convaincu.

### 1.4 La page « à propos » : humain, pas CV

Les gens engagent des personnes, pas des listes de technologies. Écris à la **première personne**, raconte ce qui t'anime, ce qui te rend différent (une autre passion, un parcours atypique, une ville, une conviction). Ta liste de compétences vient APRÈS ton histoire, jamais à la place.

> Le détail qui marche : une vraie photo de toi (pas un avatar), ta localisation, ta disponibilité. Les infos qui font de toi quelqu'un de réel.

---

## Partie 2 — Le design

### 2.1 Ton portfolio EST une démonstration

C'est le seul projet où le visiteur voit à la fois le produit et le producteur. Un site lent, cassé sur mobile ou visuellement générique dit : « voilà ce que je livrerai ». L'inverse est aussi vrai : le soin visible ici te crédite pour tout le reste.

### 2.2 Échapper au look « template »

Les portfolios se ressemblent tous parce qu'ils copient les mêmes sources. Les tics à éviter : le hero « Hi, I'm X 👋 », les mêmes combinaisons de polices vues partout, les cartes identiques alignées par trois, les dégradés violets, les compteurs de compétences en pourcentage (que signifie « JavaScript 85 % » ?).

**La méthode pour être personnel** : pars de TOI. Ta ville, ta culture, ton autre passion, ton histoire — c'est là que se trouvent une palette, une métaphore, un ton que personne d'autre ne peut copier. Un pianiste peut penser son site comme une partition ; quelqu'un de Cotonou peut prendre le jaune des motos-taxis comme accent. Le design devient alors une signature, pas un habillage.

### 2.3 Les règles de base qui suffisent presque toujours

- **Une palette disciplinée** : un fond, une couleur de texte, UN accent. C'est l'usage répété et cohérent de l'accent qui crée l'identité.
- **Deux polices maximum** (une pour les titres, une pour le texte), avec une vraie hiérarchie de tailles.
- **De l'espace** : le blanc est ce qui distingue un design pro d'un design amateur. Dans le doute, double tes marges.
- **La typographie porte le design** : de grands titres bien réglés (interlignage serré, graisse assumée) font plus d'effet que n'importe quelle image de fond.

### 2.4 L'animation : un ingrédient, pas un plat

Une bonne animation **raconte quelque chose** : révéler le contenu au scroll, confirmer une action, guider l'œil. Une mauvaise animation décore. Trois règles :

1. Chaque animation doit avoir une raison exprimable en une phrase.
2. Respecte `prefers-reduced-motion` — certains visiteurs sont incommodés par le mouvement.
3. Un seul effet « wow » bien exécuté (une transition de page signature, un élément 3D interactif qui a du sens) vaut mieux que dix effets moyens.

---

## Partie 3 — La technique

### 3.1 La stack n'impressionne personne — l'exécution, si

Personne ne t'engagera parce que ton portfolio est en Next.js plutôt qu'en HTML pur. Choisis l'outil que tu maîtrises et soigne : la **vitesse** (vise 90+ sur Lighthouse), le **mobile** (la moitié de tes visiteurs), et la **fiabilité** (zéro lien mort, zéro erreur console).

### 3.2 Les fondamentaux non négociables

- **Performance** : images optimisées (WebP/AVIF, lazy loading), polices limitées (2-3 fichiers max), pas de librairie chargée « au cas où ».
- **SEO & partage** : title et meta description par page, balises Open Graph avec une vraie image (c'est ce qui s'affiche quand ton lien est partagé sur LinkedIn/WhatsApp — teste-le !), un nom de domaine à toi (`prenom.dev` vaut mieux que `prenom.vercel.app`).
- **Accessibilité** : contrastes suffisants, focus visible au clavier, textes alternatifs, HTML sémantique. Ce n'est pas du bonus, c'est du métier.
- **Analytics léger** (Plausible, Umami…) : savoir quelles pages sont vues t'apprend ce qui intéresse vraiment.

### 3.3 Centralise ce qui changera

Ton portfolio vivra des années et sera refondu plusieurs fois. Prépare-le : couleurs et polices en variables (tokens CSS) définies à UN endroit, contenus (projets, expériences) dans des données séparées du rendu (fichier JSON, CMS, base). Une refonte devient alors un changement de peau, pas une réécriture.

### 3.4 Prévois les cas dégradés

Que se passe-t-il si ta base de données est vide ? Si une image ne charge pas ? Si le JavaScript échoue ? Un portfolio pro a une réponse à chaque question (contenu de secours, dégradation progressive). C'est précisément le genre de réflexe qui se voit en entretien.

---

## Partie 4 — Les erreurs classiques

1. **Le portfolio éternellement « en construction »** — publie une version simple et complète plutôt qu'une version ambitieuse et inachevée. Tu itéreras.
2. **Les liens morts et placeholders oubliés** (`wa.me/0000000`, LinkedIn vers `#`, « Lorem ipsum ») — audite ton contenu comme ton code : chaque lien, cliqué, sur mobile aussi.
3. **Parler de soi à la troisième personne** ou comme une plaquette d'agence — tu es une personne, écris comme une personne.
4. **Copier un portfolio célèbre** — l'inspiration se prend au niveau des principes (hiérarchie, rythme, ton), jamais au niveau des pixels. Le visiteur qui reconnaît la source te classe immédiatement.
5. **Optimiser le paraître avant le être** — un site somptueux qui mène vers deux repos vides fait plus de mal que de bien. Le fond d'abord.
6. **Ne jamais le mettre à jour** — un portfolio dont le dernier projet date de trois ans travaille contre toi. Prévois une heure par trimestre.

---

## Partie 5 — Selon ton niveau

### 🌱 Débutant
Un objectif : **exister proprement**. Une page suffit : qui tu es, 2-3 projets cliquables présentés en problème/solution, un email. HTML/CSS soigné ou un framework que tu maîtrises. Pas de 3D, pas d'animations complexes — de la netteté. Ce qui te distinguera : des projets pour de vraies personnes et un texte qui sonne humain.

### 🌿 Intermédiaire
Un objectif : **te différencier**. C'est le moment d'une vraie identité visuelle (palette personnelle, typographie choisie, un élément signature), d'études de cas approfondies avec chiffres, et d'une exécution irréprochable (Lighthouse 90+, responsive parfait, dark/light). Ajoute ce qui prouve la profondeur : un article technique, une contribution open source.

### 🌳 Avancé
Un objectif : **faire vivre une expérience**. À ce niveau, le portfolio est lui-même une démonstration : interactions scroll maîtrisées, élément 3D ou génératif *qui a du sens*, transitions de page, micro-détails (heure locale, contenu vivant). Mais la hiérarchie reste : l'expérience sert le contenu, jamais l'inverse. Et le niveau se voit aussi dans ce qui ne se voit pas : accessibilité complète, performance malgré la richesse, cas dégradés tous couverts.

---

## Checklist finale avant publication

**Contenu**
- [ ] Qui / quoi / contact visibles en moins de 30 secondes
- [ ] 3-5 projets max, tous cliquables, format problème → solution → résultat
- [ ] Page à propos à la première personne, avec vraie photo
- [ ] Zéro placeholder, zéro lien mort, zéro faute (fais-toi relire)

**Design**
- [ ] Une palette (fond + texte + UN accent), deux polices max
- [ ] Identité personnelle justifiable (« pourquoi ce choix pour moi ? »)
- [ ] Parfait sur mobile (teste sur un vrai téléphone)
- [ ] Animations avec raison d'être + `prefers-reduced-motion`

**Technique**
- [ ] Lighthouse ≥ 90 (performance, accessibilité, SEO)
- [ ] Open Graph testé (partage le lien dans WhatsApp pour voir)
- [ ] Domaine personnalisé + HTTPS
- [ ] Testé sur Chrome, Firefox, Safari + navigation clavier

**Vie du site**
- [ ] Analytics en place
- [ ] Formulaire de contact testé de bout en bout (le mail arrive ?)
- [ ] Rappel trimestriel pour mise à jour

---

*Dernier conseil, le plus important : un portfolio publié et imparfait bat un portfolio parfait et invisible. Publie, partage, itère.*

# PLAN - CV Builder One Page

## Objectif

Créer une app Next.js 16 qui permet de construire un CV one-page élégant, éditable via une modal `Settings`, avec sauvegarde automatique en `localStorage`, upload d'une photo de profil, et export du rendu final en `PDF` ou `PNG`.

Le rendu visuel doit s'inspirer de l'exemple dans `public/images/elon-musk-one-page-resume-elon-musk-original-one-page-resume.png` :

- photo de profil centrée en haut
- nom fort et lisible
- mise en page premium, claire, compacte, pensée pour un CV une page
- colonnes ou blocs bien hiérarchisés
- typographie plus belle que la base Next par défaut

## Expérience cible

L'écran principal affiche directement le CV, sans écran d'accueil inutile.

En haut à droite :

- un bouton `Settings` avec icône `lucide-react`
- un bouton `Export` juste à côté

Le bouton `Settings` ouvre une modal animée avec `framer-motion` pour :

- ajouter / modifier les données du CV
- changer les couleurs par défaut
- choisir une taille de police globale : `Petite`, `Moyenne`, `Grande`
- uploader / remplacer la photo de profil

Le bouton `Export` ouvre un petit menu ou popover pour :

- exporter en `PDF`
- exporter en `PNG`

Toutes les données utilisateur sont persistées en `localStorage`.

## Contraintes techniques

- Next.js 16 + App Router
- garder les parties statiques en Server Components
- isoler l'éditeur, la modal, l'export et `localStorage` dans des Client Components avec `"use client"`
- utiliser `next/image` pour les images du CV
- utiliser `next/font` pour une typographie propre et performante
- conserver une mise en page adaptée au ratio A4, surtout sur desktop

## Direction UI

### Style visuel

- fond de page sobre avec profondeur légère, pas un simple blanc plat
- carte CV centrale avec proportions proches d'une page imprimée
- accents colorés maîtrisés pour titres, séparateurs et jauges
- ombres fines, bordures propres, hiérarchie nette
- animation légère uniquement sur la modal, les boutons et l'apparition initiale

### Typographie

Prévoir une combinaison plus éditoriale que `Geist` seul, chargée via `next/font`.

Exemple de direction :

- titres : une fonte élégante et structurée
- texte courant : une fonte très lisible
- 3 tailles globales pilotées par variables CSS

Mapping recommandé :

- `small` : CV plus dense
- `medium` : défaut
- `large` : meilleure lisibilité, contenu plus aéré

### Mise en page du CV

Structure visée :

1. Header avec nom, accroche, photo centrée, coordonnées.
2. Corps principal en deux zones.
3. Colonne large : expériences, formation, projets éventuels.
4. Colonne secondaire : compétences, certifications, langues, centres d'intérêt.

La photo de profil doit reprendre l'idée de `public/images/profil-page.png` : portrait centré, bien découpé, valorisé visuellement.

## Données à gérer

### Modèle de données

Prévoir une structure unique `ResumeData` :

- `personal`
- `summary`
- `experience[]`
- `education[]`
- `skills[]`
- `certifications[]`
- `languages[]`
- `interests[]`
- `links[]`
- `theme`

### Champs principaux

`personal`

- fullName
- title
- email
- phone
- location
- website
- avatar

`experience`

- id
- role
- company
- location
- startDate
- endDate
- current
- highlights[]

`education`

- id
- degree
- school
- location
- startDate
- endDate

`skills`

- id
- label
- level

`theme`

- primaryColor
- accentColor
- textColor
- mutedColor
- backgroundColor
- fontScale (`small | medium | large`)

## Stockage local

Utiliser une clé claire, par exemple :

`cv-builder:resume`

Comportement attendu :

- au premier chargement, hydrater depuis des données par défaut
- si `localStorage` contient déjà des données, les restaurer
- sauvegarde automatique après chaque modification
- bouton de reset optionnel dans la modal pour revenir au template initial

## Architecture proposée

### Arborescence cible

```txt
app/
  layout.tsx
  page.tsx
components/
  cv-builder.tsx
  resume-preview.tsx
  topbar-actions.tsx
  settings-modal.tsx
  export-menu.tsx
  profile-image-upload.tsx
  sections/
    resume-header.tsx
    experience-section.tsx
    education-section.tsx
    skills-section.tsx
    sidebar-section.tsx
data/
  default-resume.ts
lib/
  storage.ts
  export.ts
  theme.ts
types/
  resume.ts
```

### Répartition Server / Client

`app/page.tsx`

- Server Component minimal
- rend le shell de page
- monte un composant client principal

`components/cv-builder.tsx`

- Client Component racine
- charge les données depuis `localStorage`
- gère l'état global du CV
- pilote la modal et l'export

`components/resume-preview.tsx`

- rendu du CV prêt à être exporté
- expose une `ref` pour capture `PNG/PDF`

## Modal Settings

La modal doit être pensée comme un vrai panneau d'édition, pas juste un formulaire brut.

Blocs recommandés :

1. `Informations générales`
2. `Expériences`
3. `Formation`
4. `Compétences`
5. `Langues / centres d'intérêt / liens`
6. `Apparence`
7. `Photo de profil`

Dans `Apparence` :

- 3 presets de taille de police
- sélecteurs de couleurs
- aperçu en direct

## Export PDF / PNG

### Besoin

Exporter le CV tel qu'affiché, avec un rendu fidèle.

### Stratégie recommandée

Ajouter une dépendance d'export dédiée côté client, par exemple :

- `html-to-image` pour générer le `PNG`
- `jspdf` pour encapsuler l'image dans une page `A4` en `PDF`

Pipeline :

1. capturer le noeud du CV
2. générer une image haute résolution
3. télécharger en `.png`
4. pour le PDF, injecter l'image dans un document A4 avec marges contrôlées

Points d'attention :

- qualité d'image suffisante
- fond blanc forcé à l'export
- masquer les boutons UI pendant la capture
- conserver les proportions d'une page imprimable

## Image de profil

Support attendu :

- upload local depuis l'utilisateur
- prévisualisation immédiate
- stockage en base64 ou data URL dans `localStorage`
- affichage centré en haut du CV
- recadrage simple via `object-fit: cover`

Si la photo n'est pas définie :

- utiliser une image par défaut ou un placeholder élégant

## Phases d'implémentation

### Phase 1 - Fondations

- nettoyer le template Next par défaut
- définir les types TypeScript
- créer les données par défaut
- mettre en place la top bar avec `Settings` et `Export`

### Phase 2 - Preview du CV

- construire la carte CV one-page
- intégrer le header avec photo centrée
- composer les sections principales et secondaires
- poser la base responsive desktop/mobile

### Phase 3 - Édition

- créer la modal `Settings`
- brancher tous les champs du formulaire
- sauvegarder automatiquement en `localStorage`
- ajouter les réglages de couleur et de taille de police

### Phase 4 - Export

- implémenter l'export `PNG`
- implémenter l'export `PDF`
- vérifier le rendu A4

### Phase 5 - Finition UI

- améliorer la typographie
- ajouter les animations `framer-motion`
- affiner les espacements, contrastes et alignements
- tester différents volumes de contenu

## Critères d'acceptation

- le CV est visible immédiatement à l'ouverture de l'app
- `Settings` est en haut à droite et ouvre une modal fluide
- `Export` est à côté de `Settings`
- les données sont modifiables et persistent après refresh
- la photo de profil est uploadable et centrée en haut du CV
- les couleurs sont personnalisables
- les 3 tailles de police fonctionnent sur l'ensemble du document
- le rendu reste proche d'un CV one-page premium
- l'export `PDF` et `PNG` produit un fichier exploitable

## Risques / vigilance

- un contenu trop long peut casser le format une page
- stocker une grande image en base64 peut alourdir `localStorage`
- le rendu exporté peut différer légèrement du rendu écran si l'échelle n'est pas maîtrisée
- il faudra limiter les animations dans la zone exportable pour garder un rendu propre

## Décisions recommandées

- pas de backend
- état local unique pour tout le CV
- sauvegarde automatique, pas de bouton `Save`
- thème par défaut sobre avec accent chaud ou rouge discret inspiré de l'exemple
- focus sur une seule template premium avant d'envisager plusieurs templates

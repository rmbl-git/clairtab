# ClairTab

ClairTab est une extension Chrome de nouvel onglet centrée sur une action principale : capturer une tâche ou lancer une recherche, avec des raccourcis personnels et un fond photographique thématique.

> Statut : **cadrage terminé — bootstrap prêt à démarrer avec réserves documentées**.

## Problème

Un nouvel onglet est une transition fréquente, mais il ne transforme pas toujours l’intention de l’utilisateur en action utile. Les alternatives peuvent devenir surchargées, collecter trop de données ou modifier la recherche de manière inattendue.

## Proposition

ClairTab affiche immédiatement :

- un mode principal configurable : **Focus** ou **Recherche** ;
- une liste de tâches locale et volontairement simple ;
- une grille de raccourcis ajoutés manuellement ;
- un fond renouvelé selon un thème choisi ;
- un fallback local si le réseau échoue.

Toutes les fonctions servent un seul objectif : **démarrer la prochaine action depuis le nouvel onglet**.

## MVP

Le MVP doit permettre de :

1. charger l’extension en mode unpacked ;
2. ouvrir un nouvel onglet personnalisé ;
3. ajouter, terminer, restaurer et supprimer une tâche ;
4. basculer vers un formulaire de recherche Google ;
5. créer, modifier, ouvrir et supprimer un raccourci ;
6. choisir un thème de fond ;
7. afficher une image distante conforme et son attribution ;
8. conserver les données localement ;
9. rester utilisable hors ligne.

## Non-objectifs

Le MVP n’est pas :

- un gestionnaire de tâches avancé ;
- un dashboard à widgets ;
- un outil de synchronisation ;
- un agrégateur de navigation ;
- un remplacement du moteur de recherche Chrome ;
- un produit avec compte, publicité ou analytics.

## Stack prévue

- Chrome Extension Manifest V3
- React
- TypeScript
- Vite
- Tailwind CSS
- `chrome.storage.local`
- Vitest
- React Testing Library
- Playwright
- Cloudflare Worker pour le proxy d’images

## Comment utiliser ce repository

Ce repository contient d'abord le **brief et le système de travail**, puis recevra le code.

- Commencer par `START-HERE.md` pour comprendre chaque fichier.
- Utiliser `AI-IMPLEMENTATION-PROMPT.md` pour lancer un agent de coding.
- Tout agent doit lire `AGENTS.md`, puis `docs/STATE.md`.
- La direction visuelle de référence est dans `docs/UI-DIRECTION.md`.
- Le code sera ajouté à la même racine lors de la tâche de bootstrap.

Le PDF de synthèse est destiné à la lecture humaine. Les fichiers Markdown restent la source de vérité versionnée.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le serveur de développement sert la page `newtab.html` localement.

## Build

```bash
npm run build
```

Le dossier `dist/` contient :

- `manifest.json`
- `newtab.html`
- les assets JavaScript et CSS compilés (chemins relatifs)
- les icônes dans `icons/`

### Charger l'extension en mode unpacked

1. Ouvrir `chrome://extensions` dans Chrome.
2. Activer le **Mode développeur** (en haut à droite).
3. Cliquer **Load unpacked**.
4. Sélectionner le dossier `dist/`.

L'extension apparaît dans la liste. Ouvrir un nouvel onglet pour voir le shell ClairTab.

### Vérifications

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Variables d’environnement

### Extension

Aucun secret ne doit être présent dans le bundle de l’extension.

Variable publique envisagée :

```text
VITE_BACKGROUND_PROXY_URL=
```

Elle contient uniquement l’URL publique du proxy.

### Proxy Cloudflare Worker

Secret serveur :

```text
UNSPLASH_ACCESS_KEY=
```

Options non secrètes possibles :

```text
ALLOWED_THEMES=landscapes,architecture,minimal,nature
CACHE_TTL_SECONDS=3600
```

## Démonstration actuelle

Le build produit une extension Manifest V3 minimale affichant un shell local ClairTab. Les fonctionnalités métier (tâches, recherche, raccourcis, photos) seront ajoutées dans les tâches suivantes.

Le démarrage actuel valide :

- l’ouverture d’un nouvel onglet avec le shell ClairTab ;
- l’absence d’erreur console inattendue ;
- l’absence de requête réseau inattendue ;
- le manifeste avec permissions minimales ;
- le chargement unpacké sans erreur.

## Limites connues

- Chrome desktop uniquement au départ.
- Pas de synchronisation multi-appareils.
- Pas de compte.
- Google est le seul moteur proposé.
- Les thèmes sont prédéfinis.
- L’intégration d’images dépend d’un fournisseur externe et d’un proxy.
- Le produit ne remplace pas le nouvel onglet en navigation privée.
- Le nom `ClairTab` est provisoire.

## Structure documentaire

```text
START-HERE.md
AI-IMPLEMENTATION-PROMPT.md
PRODUCT-BRIEF.md
README.md
AGENTS.md
docs/
  PRD.md
  UI-DIRECTION.md
  ARCHITECTURE.md
  STATE.md
  QUALITY.md
  acceptance/
  decisions/
  evidence/
  work-records/
```

Commencer toute session par `AGENTS.md`, puis `docs/STATE.md`.

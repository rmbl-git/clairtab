# START HERE — Comment utiliser ce package

## Ce que contient réellement le dossier

Ce package n'est pas un seul prompt géant. C'est une **mémoire de projet versionnée** que peuvent lire :

- toi, pour comprendre et arbitrer le produit ;
- un développeur, pour implémenter sans deviner ;
- un agent IA de coding, pour travailler par tâches contrôlées ;
- un futur intervenant, pour reprendre le projet sans relire les conversations.

Les fichiers Markdown jouent des rôles différents. Certains décrivent le produit, certains donnent des règles à l'IA, d'autres cadrent une tâche précise et d'autres servent à enregistrer les preuves.

## Les quatre catégories de fichiers

### 1. Documents produit

Ils disent **ce qu'il faut construire et pourquoi**.

- `PRODUCT-BRIEF.md` : synthèse du concept, du MVP, des risques et des arbitrages.
- `docs/PRD.md` : exigences détaillées, parcours, états, données et critères.
- `docs/UI-DIRECTION.md` : direction visuelle et comportementale issue de la référence fournie.

Ces documents ne sont pas des prompts à exécuter mot pour mot. Ce sont les spécifications de référence.

### 2. Documents d'architecture et de qualité

Ils disent **comment construire et comment vérifier**.

- `docs/ARCHITECTURE.md` : stack, composants, flux, sécurité et déploiement.
- `docs/QUALITY.md` : Definition of Done, tests, validation runtime et preuves.

### 3. Instructions permanentes pour les agents

Ils disent **comment un agent doit travailler dans le repository**.

- `AGENTS.md` : contrat court que l'agent doit lire à chaque session.
- `docs/STATE.md` : état opérationnel actuel et prochaine action.
- `AI-IMPLEMENTATION-PROMPT.md` : prompt de lancement à copier dans un agent de coding.

`AGENTS.md` et le prompt de lancement sont les fichiers les plus proches de ce que tu imaginais comme « invitation pour l'IA ».

### 4. Contrats et mémoire de travail

Ils évitent que l'IA construise tout d'un coup ou affirme avoir terminé sans preuve.

- `docs/work-records/` : périmètre autorisé pour une tâche.
- `docs/acceptance/` : comportements observables attendus.
- `docs/evidence/` : résultats des tests, captures et validations.
- `docs/decisions/` : décisions durables et leur justification.

## Où placer les fichiers

Oui : place le package **dans le repository du projet**, en conservant exactement la structure.

```text
clairtab/
├── START-HERE.md
├── AI-IMPLEMENTATION-PROMPT.md
├── AGENTS.md
├── PRODUCT-BRIEF.md
├── README.md
├── docs/
│   ├── PRD.md
│   ├── UI-DIRECTION.md
│   ├── ARCHITECTURE.md
│   ├── QUALITY.md
│   ├── STATE.md
│   ├── assets/
│   ├── acceptance/
│   ├── decisions/
│   ├── evidence/
│   └── work-records/
└── ... code créé ensuite par l'agent
```

Le code applicatif sera ajouté ensuite à la même racine : `src/`, `public/`, `tests/`, `package.json`, etc.

## Workflow recommandé

### Étape 1 — Créer le repository

1. Créer un dossier vide `clairtab`.
2. Copier tout le contenu du package à sa racine.
3. Initialiser Git.
4. Faire un premier commit documentaire.

Commit recommandé :

```text
docs: establish ClairTab product and delivery baseline
```

### Étape 2 — Lancer l'agent

Ouvrir le repository dans VS Code, Kilo Code, Cursor, Claude Code ou un agent équivalent.

Copier le contenu de `AI-IMPLEMENTATION-PROMPT.md` dans la conversation de l'agent.

L'agent doit alors :

1. lire `AGENTS.md` ;
2. lire `docs/STATE.md` ;
3. ouvrir la tâche active ;
4. lire ses scénarios d'acceptation ;
5. implémenter uniquement cette tâche ;
6. exécuter les contrôles ;
7. enregistrer les preuves ;
8. mettre à jour l'état ;
9. s'arrêter avant la tâche suivante.

### Étape 3 — Valider avant de continuer

Ne pas demander « construis toute l'application ». Demander plutôt :

```text
Exécute uniquement le work record actif et arrête-toi après le handoff.
```

Après revue des preuves, autoriser la tâche suivante.

## À quoi sert le PDF

Le PDF est utile comme :

- document de présentation ;
- brief lisible par un humain ;
- support de décision ;
- document à partager.

Il est moins adapté comme source de travail quotidienne d'un agent de coding, car l'agent doit retrouver, modifier et versionner des sections précises. Les fichiers Markdown sont plus efficaces pour cela.

La bonne combinaison est donc :

- **PDF** : vue d'ensemble humaine ;
- **Markdown dans Git** : source de vérité opérationnelle ;
- **prompt de lancement** : instruction de démarrage pour l'agent.

## Version minimale du package

Pour une expérimentation très légère, les fichiers indispensables sont :

```text
AGENTS.md
docs/STATE.md
docs/PRD.md
docs/UI-DIRECTION.md
docs/ARCHITECTURE.md
docs/work-records/001-bootstrap-extension.md
docs/acceptance/001-bootstrap-extension.md
AI-IMPLEMENTATION-PROMPT.md
```

Le package complet est préférable dès que plusieurs sessions ou agents interviennent.

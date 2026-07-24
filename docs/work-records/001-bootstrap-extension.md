---
task: 001-bootstrap-extension
status: closed
owner_agent: unassigned
created: 2026-07-24
last_updated: 2026-07-24
---

# Bootstrap de l’extension ClairTab

## Goal

Créer un repository React + TypeScript + Vite capable de produire une extension Chrome Manifest V3 chargeable en mode unpacked, dont la page Nouvel onglet affiche un shell local identifiable.

## In Scope

- initialisation npm ;
- React, TypeScript, Vite et Tailwind ;
- configuration stricte TypeScript ;
- scripts `dev`, `typecheck`, `lint`, `test`, `build` ;
- `manifest.json` Manifest V3 ;
- `chrome_url_overrides.newtab` ;
- permission `storage` uniquement ;
- `newtab.html` ;
- shell visuel minimal ;
- icônes temporaires locales ;
- configuration de test minimale ;
- structure documentaire existante conservée ;
- instructions de chargement unpacked dans README.

## Out Of Scope

- tâches fonctionnelles ;
- recherche Google ;
- raccourcis ;
- intégration photo distante ;
- proxy Worker ;
- stockage métier ;
- onboarding ;
- analytics ;
- publication Web Store ;
- refonte du concept ou ajout de widgets.

## Readiness Verdict

**Verdict:** `PASS`

### Findings

- Le périmètre est indépendant des clés API.
- Les scénarios sont observables.
- Le manifeste peut rester très limité.
- Aucun backend n’est requis.

### Blocking Items

- Aucun.

### Concerns To Carry Forward

- La CSP exacte doit être vérifiée dans le navigateur.
- La version minimale de Chrome doit être décidée à partir des APIs réellement utilisées.
- Les assets temporaires ne doivent pas être confondus avec l’identité finale.

## Relevant Context

- `AGENTS.md`
- `docs/STATE.md`
- `docs/PRD.md` sections 7, 11, 21
- `docs/ARCHITECTURE.md` sections Stack, Structure, Manifest, CSP
- `docs/decisions/001-manifest-v3-local-first.md`
- `docs/acceptance/001-bootstrap-extension.md`

## Planned Work

1. Initialiser `package.json`.
2. Installer les dépendances minimales.
3. Configurer TypeScript strict, lint et tests.
4. Créer `newtab.html` et le point d’entrée React.
5. Placer `manifest.json` et les icônes dans les assets copiés au build.
6. Créer un shell minimal sans fonctionnalité métier.
7. Vérifier la sortie `dist/`.
8. Charger le build dans Chrome.
9. Ouvrir un nouvel onglet et inspecter console et manifeste.
10. Mettre à jour README, STATE et evidence.

## Planned Checks

- [x] `npm install`
- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] inspecter `dist/manifest.json`
- [x] rechercher secrets et permissions inattendues dans `dist/`
- [x] charger l’extension unpacked
- [x] ouvrir un nouvel onglet
- [x] vérifier le titre et le shell
- [x] inspecter la console
- [x] vérifier qu’aucune requête réseau inattendue n’est émise

## Expected Evidence

- sortie des commandes ;
- arbre de `dist/` ;
- capture du nouvel onglet ;
- capture de `chrome://extensions` ;
- manifeste final ;
- console sans erreur inattendue ;
- evidence record `docs/evidence/001-bootstrap-extension.md`.

## Rollback Strategy

Supprimer les fichiers de bootstrap ou revenir au commit documentaire précédent. Aucune donnée utilisateur ni migration n’existe à ce stade.

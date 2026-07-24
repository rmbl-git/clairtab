# Project State

- Dernière mise à jour : 2026-07-24
- Commit ou version : bootstrap vérifié en runtime, tâche 001 clos
- Phase actuelle : bootstrap vérifié, tâche 002 prête à démarrer
- Work record actif : `docs/work-records/001-bootstrap-extension.md` (clos)
- Prochaine tâche : `docs/work-records/002-first-vertical-slice.md`
- État du build : `npm run build` passe et produit `dist/` valide
- État des tests : 1 test vitest passé
- État de la validation runtime : validée en navigateur Chrome
- URL de preview : aucune

## Objectif actuel

Obtenir une extension Manifest V3 minimale, chargeable en mode unpacked, affichant un shell ClairTab local et produisant un build `dist/` reproductible.

## Ce qui fonctionne

- Repository applicatif initialisé (React, TypeScript, Vite, TailwindCSS)
- Manifeste V3 avec permissions minimales (storage uniquement)
- Build `npm run build` produit un `dist/` valide
- Vitest pass\u00e9 (1 test)
- Extension chargeable en mode unpacked et valid\u00e9e dans Chrome
- Shell ClairTab affich\u00e9 correctement dans le nouvel onglet
- Console propre, aucune requ\u00eate r\u00e9seau inattendue

## Ce qui est partiellement impl\u00e9ment\u00e9

- Bootstrap du code r\u00e9alis\u00e9 et valid\u00e9 en runtime (React, TypeScript, Vite, Tailwind, manifeste V3, shell minimal, tests Vitest pass\u00e9s, icônes locales, README mis \u00e0 jour).
- Int\u00e9gration Unsplash non provisionn\u00e9e (attend un proxy).

## Ce qui ne fonctionne pas

- Aucun proxy d\u00e9ploy\u00e9
- Int\u00e9gration photo distante non disponible

## Risques actifs

- Confirmation du nom.
- Confirmation du mode Focus par d\u00e9faut.
- Confirmation de l'usage d'une phrase d'ambiance dans le MVP.
- Compte et cl\u00e9 Unsplash non confirm\u00e9s.
- Proxy non d\u00e9ploy\u00e9.
- Politique de confidentialit\u00e9 non publi\u00e9e.
- Conditions du fournisseur \u00e0 revalider avant release.
- Version minimale de Chrome non d\u00e9cid\u00e9e.
- Risque de scope creep vers un dashboard multi-widget.

## D\u00e9cisions r\u00e9centes

- Manifest V3 et architecture local-first.
- Pas de content scripts.
- Pas de synchronisation dans le MVP.
- Recherche Google explicite sans modification des r\u00e9glages Chrome.
- Unsplash via proxy ; Lummi non automatis\u00e9.
- Raccourcis manuels, sans acc\u00e8s \u00e0 l\u2019historique.
- Aucune analytique MVP.
- Composition visuelle : fond plein \u00e9cran, groupe central, surface sombre translucide, raccourcis compacts et attribution en bas.

## Preuves r\u00e9centes

- Documentation produit et technique cr\u00e9\u00e9e le 2026-07-24.
- Bootstrap r\u00e9alis\u00e9 le 2026-07-24. Preuve dans `docs/evidence/001-bootstrap-extension.md`.
- Validation runtime Chrome confirm\u00e9e manuellement le 2026-07-24.

## Blocages

Aucun blocage pour le bootstrap.

Blocages pour la cl\u00f4ture de l\u2019int\u00e9gration photo :

- secret fournisseur ;
- URL du proxy ;
- validation des quotas et conditions ;
- politique de confidentialit\u00e9.

## Prochaine t\u00e2che recommand\u00e9e

`docs/work-records/002-first-vertical-slice.md`
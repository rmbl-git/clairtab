# Project State

- Dernière mise à jour : 2026-07-24
- Commit ou version : tâche 002 validée manuellement dans Chrome
- Phase actuelle : tâche 002 validée et clôturée, tâche 003 en cours de démarrage
- Work record actif : `docs/work-records/003-critical-path-robustness.md` (`in_progress`)
- État du build : `npm run build` passe et produit `dist/` valide
- État des tests : 35 tests vitest passés
- État de la validation runtime : validée manuellement dans Chrome le 2026-07-24
- URL de preview : aucune

## Objectif actuel

Obtenir une extension Manifest V3 minimale, chargeable en mode unpacked, affichant un shell ClairTab local et produisant un build `dist/` reproductible.

## Ce qui fonctionne

- Repository applicatif initialisé (React, TypeScript, Vite, TailwindCSS)
- Manifeste V3 avec permissions minimales (storage + favicon)
- Build `npm run build` produit un `dist/` valide
- Vitest passé (35 tests)
- Extension chargeable en mode unpacked et validée dans Chrome
- Shell ClairTab affiché correctement dans le nouvel onglet
- Console propre, aucune requête réseau inattendue
- Fonctionnalités locales implémentées :
  - 4 thèmes de fond locaux avec fallback
  - Mode Focus avec ajout, complétion et suppression de tâches
  - Mode Recherche avec navigation Google explicite
  - Bascule entre modes persistée
  - Raccourcis avec CRUD et validation URL
  - Favicon automatique des raccourcis avec fallback monogramme
  - Bouton crayon circulaire superposé, masqué au repos, visible au hover/focus tactile
  - Suppression uniquement depuis la modale avec confirmation explicite
  - Panneau de réglages (mode, thème, voile, citations, animations)
  - Barre de recherche avec bouton loupe SVG monochrome
  - Citation d'ambiance locale
  - Stockage via chrome.storage.local avec fallback localStorage et mémoire
  - Centrage de l'interface (flex, 100dvh)
  - Modale de raccourci (ajout/édition, validation, focus trap)
  - Fallback SVG local pour chaque thème (V1)
  - Composants accessibles (clavier, focus visible, responsive)

## Ce qui est partiellement implémenté

- Intégration de photographies automatiques en arrière-plan (tâche 003 en cours).

## Ce qui ne fonctionne pas

- Aucun blocage connu pour le MVP à ce stade.

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
- Premi\u00e8re tranche verticale locale impl\u00e9ment\u00e9e le 2026-07-24. Preuve dans `docs/evidence/002-first-vertical-slice.md`.

## Blocages

Aucun blocage pour le bootstrap.

Blocages pour la cl\u00f4ture de l\u2019int\u00e9gration photo :

- secret fournisseur ;
- URL du proxy ;
- validation des quotas et conditions ;
- politique de confidentialit\u00e9.

## Prochaine t\u00e2che recommand\u00e9e
## Prochaine t�che recommand�e

docs/work-records/003-critical-path-robustness.md (t�che 003 active, int�gration des photographies automatiques)

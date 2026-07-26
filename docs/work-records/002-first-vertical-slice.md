---
task: 002-first-vertical-slice
status: closed
owner_agent: unassigned
created: 2026-07-24
last_updated: 2026-07-24
---

# Première tranche verticale locale

## Goal

Démontrer la proposition de valeur dans un nouvel onglet réel : afficher un fond local simulé, ajouter et terminer une tâche, basculer vers Recherche, soumettre une requête Google et ouvrir un raccourci, avec persistance locale.

## In Scope

- modèle d’état versionné ;
- adapter `chrome.storage.local` ;
- mode Focus ;
- ajout, complétion, restauration et suppression de tâche ;
- mode Recherche et navigation Google explicite ;
- sélecteur de mode persisté ;
- trois raccourcis fixtures ou état vide guidé ;
- création d’un raccourci simple ;
- validation URL centrale ;
- catalogue local de fonds simulés ;
- composition immersive centrée conforme à `docs/UI-DIRECTION.md` ;
- zone de phrase d'ambiance locale, activable ou masquable ;
- surface commune pour Recherche et Focus ;
- attribution simulée ;
- réglages minimaux mode + thème ;
- tests unitaires et composants ;
- premier test Playwright du nouvel onglet ;
- états vides essentiels.

## Out Of Scope

- appel Unsplash réel ;
- Cloudflare Worker ;
- synchronisation ;
- drag-and-drop ;
- import/export ;
- plusieurs moteurs ;
- tâches avec dates ou priorités ;
- analytics ;
- publication ;
- favicon automatique récupéré pour l'URL dans l'extension Chrome, avec fallback monogramme généré à partir du libellé sur localhost ou en cas d'échec de chargement ;
- raccourcis sans gestion de modale d'édition, avec bouton crayon circulaire, modale d'édition avec champs préremplis, sauvegarde et suppression avec confirmation.
- Les images automatiques de fond sont réservées à la tâche 003 et ne doivent pas être commencées dans la tâche 002.

## Readiness Verdict

**Verdict:** `PASS`

### Findings

- Toutes les dépendances distantes peuvent être simulées.
- Le parcours peut être testé sans secret.
- Le stockage local suffit.
- Le nombre de fonctionnalités est acceptable si chaque composant reste simple.

### Blocking Items

- La tâche 001 doit être `Verified`.

### Concerns To Carry Forward

- Les choix visuels doivent rester provisoires.
- La persistance doit prévoir les migrations dès la version 1.
- Le formulaire Google ne doit pas donner l’impression de modifier le moteur Chrome.
- La validation URL doit être centralisée dès cette tâche.

## Relevant Context

- `docs/PRD.md` sections 12 à 17 et 20
- `docs/UI-DIRECTION.md`
- `docs/assets/visual-reference-new-tab.png`
- `docs/ARCHITECTURE.md` flux, modèle de données et sécurité
- décisions 001 et 003
- `docs/acceptance/002-first-vertical-slice.md`
- evidence de la tâche 001

## Planned Work

1. Définir les types de domaine et `schemaVersion: 1`.
2. Créer le repository de stockage.
3. Hydrater l'application avec état de chargement local.
4. Implémenter le sélecteur de mode.
5. Implémenter les tâches.
6. Implémenter la recherche.
7. Implémenter la validation URL et un raccourci créable.
8. Créer le provider local de fonds.
9. Construire la composition visuelle centrale et la rangée de raccourcis.
10. Ajouter les réglages minimaux et la phrase d'ambiance locale.
11. Couvrir logique et composants.
12. Exécuter le parcours dans Chrome.
13. Enregistrer preuves et état.
14. Implémenter le favicon automatique des raccourcis dans l'extension Chrome.
15. Implémenter le fallback monogramme sur localhost ou en cas d'échec.
16. Supprimer la croix de suppression visible sur les tuiles de raccourcis.
17. Ne conserver que le bouton crayon circulaire superposé, masqué au repos sur desktop et visible au hover/focus tactile.
18. Ouvrir la modale existante pour modifier le nom et l'URL.
19. Implémenter la suppression depuis la modale avec confirmation et restauration du focus.
20. Finaliser la disposition visuelle des raccourcis : rangée centrée, tuiles 60x60 px, libellé sous l'icône (2 lignes max), bouton Ajouter 60x60 en fin de flux, favicon via chrome.runtime.getURL('/_favicon/') avec pageUrl et size=64 et permission favicon, bouton crayon 32 px en angle supérieur droit avec chevauchement, suppression uniquement dans la modale.
21. Modifier la barre de recherche : remplacer l'indication texte « Ctrl K » par un bouton loupe SVG monochrome sans fond/bordure/coins arrondis, hover par opacity 0.6, focus discret 1px, aria-label « Lancer la recherche », soumission vide bloquée, Entrée conservée.

## Planned Checks

- [x] typecheck
- [x] lint
- [x] tests unitaires
- [x] build
- [x] chargement unpacked
- [x] ajout et persistance d'une tâche
- [x] complétion et restauration
- [x] recherche vide refusée
- [x] recherche valide naviguant vers Google
- [x] URL dangereuse refusée
- [x] raccourci valide ouvert
- [x] mode et thème persistés
- [x] navigation clavier
- [x] cohérence visuelle avec la référence sur desktop et 320 px
- [x] lisibilité sur fond clair et fond sombre
- [x] console et réseau inspectés
- [x] aucune donnée utilisateur dans les logs
- [x] persistance chrome.storage.local (Chrome)
- [x] persistance localStorage (localhost test)
- [x] favicon automatique des raccourcis dans l'extension Chrome
- [x] fallback monogramme sur localhost ou en cas d'échec
- [x] bouton crayon circulaire superposé sur chaque raccourci
- [x] ouverture de la modale existante pour modifier le nom et l'URL
- [x] suppression depuis la modale avec confirmation
- [x] accessibilité clavier du bouton d'édition
- [x] aucune croix de suppression visible sur les tuiles
- [x] crayon masqué au repos sur desktop, visible au hover/focus tactile
- [x] clic tuile ouvre le site, clic crayon ouvre la modale
- [x] modale préremplie avec suppression confirmée
- [x] restauration du focus sur le crayon après fermeture modale
- [x] raccourcis en rangée centrée, flex-wrap, max-width module principal
- [x] carrés d'icônes 60x60 px avec libellé externe
- [x] bouton Ajouter 60x60 en fin de flux DOM avec libellé
- [x] favicon via chrome.runtime.getURL('/_favicon/') avec pageUrl et size=64, permission favicon
- [x] bouton crayon 32 px, top-right, chevauchement -9px, overflow visible
- [x] aucune croix de suppression sur les tuiles
- [x] favicon 24x24 px centré avec object-fit: contain
- [x] gap horizontal réduit à 18 px
- [x] crayon disparaît après fermeture modale si souris hors tuile
- [x] focus restauré sur le lien principal après fermeture modale
- [x] crayon visible au focus clavier

## Expected Evidence

- résultats de tests (33 tests passés) ;
- build `dist/` produit sans erreur avec SVG dans dist/backgrounds/ ;
- evidence record `docs/evidence/002-first-vertical-slice.md`.

## Rollback Strategy

Conserver le shell bootstrap. Revenir au commit de la tâche 001 et supprimer la version de schéma locale uniquement dans le profil de test, jamais dans un profil utilisateur réel.



---
task: 002-first-vertical-slice
status: ready
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
- favicon distant ;
- tâches avec dates ou priorités ;
- analytics ;
- publication.

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
3. Hydrater l’application avec état de chargement local.
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

## Planned Checks

- [ ] typecheck
- [ ] lint
- [ ] tests unitaires
- [ ] tests composants
- [ ] build
- [ ] chargement unpacked
- [ ] ajout et persistance d’une tâche
- [ ] complétion et restauration
- [ ] recherche vide refusée
- [ ] recherche valide naviguant vers Google
- [ ] URL dangereuse refusée
- [ ] raccourci valide ouvert
- [ ] mode et thème persistés
- [ ] navigation clavier
- [ ] cohérence visuelle avec la référence sur desktop et 320 px
- [ ] lisibilité sur fond clair et fond sombre
- [ ] console et réseau inspectés
- [ ] aucune donnée utilisateur dans les logs

## Expected Evidence

- résultats de tests ;
- capture Focus ;
- capture Recherche ;
- capture raccourcis ;
- vidéo ou séquence de persistance ;
- preuve d’une URL dangereuse refusée ;
- preuve que la requête n’est pas stockée ;
- evidence record `docs/evidence/002-first-vertical-slice.md`.

## Rollback Strategy

Conserver le shell bootstrap. Revenir au commit de la tâche 001 et supprimer la version de schéma locale uniquement dans le profil de test, jamais dans un profil utilisateur réel.

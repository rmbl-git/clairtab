# Evidence: 002-first-vertical-slice

Date: 2026-07-24
Task: Première tranche verticale locale

## Controls réalisés

### typecheck
- Réussi. Aucune erreur TypeScript.

### lint
- Réussi. Aucune erreur ESLint dans src/.

### tests unitaires
- 35 tests passés (validators: task title, shortcut label, URL normalization, dangerous URL rejection, Google search URL builder, localhost detection, favicon URL + storage adapter selection, hydration merge, persistence, module visibility + ShortcutGrid: monogram fallback, modal open/close, pre-filled fields, focus restoration, delete only in edit mode, confirmation flow).

### build
- Réussi. Sortie dans dist/ sans erreur. Fichiers SVG présents dans dist/backgrounds/.

## Distribution de dist/

```
dist/
  manifest.json
  newtab.html
  assets/newtab-*.css
  assets/newtab-*.js
  icons/icon16.png
  icons/icon32.png
  icons/icon48.png
  icons/icon128.png
  backgrounds/landscapes.svg
  backgrounds/architecture.svg
  backgrounds/minimal.svg
  backgrounds/nature.svg
```

## Scénarios d'acceptation

| Scénario | Statut |
|----------|--------|
| AC-1 Ajouter une tâche | ? Validé dans Chrome |
| AC-2 Refuser une tâche vide | ? Validé dans Chrome |
| AC-3 Terminer et restaurer | ? Validé dans Chrome |
| AC-4 Basculer de mode | ? Validé dans Chrome |
| AC-5 Soumettre une recherche | ? Validé dans Chrome |
| AC-6 Ne pas stocker la requête | ? Validé dans Chrome |
| AC-7 Créer un raccourci valide | ? Validé dans Chrome |
| AC-8 Refuser un raccourci dangereux | ? Validé dans Chrome |
| AC-9 Ouvrir un raccourci | ? Validé dans Chrome |
| AC-10 Fond local simulé | ? Validé dans Chrome |
| AC-11 Utilisation clavier | ? Validé dans Chrome |
| AC-12 Composition immersive | ? Validé dans Chrome |
| AC-13 Silhouette stable entre les modes | ? Validé dans Chrome |
| AC-14 Phrase d'ambiance non bloquante | ? Validé dans Chrome |
| AC-15 Centrage de l'interface | ? Validé dans Chrome |
| AC-16 Centrage avec réglages ouverts | ? Validé dans Chrome |
| AC-17 Modale de raccourci | ? Validé dans Chrome |
| AC-18 Persistance des tâches | ? Validé dans Chrome |
| AC-19 Persistance des préférences | ? Validé dans Chrome |
| AC-20 Pas d'écrasement par défaut | ? Validé dans Chrome |
| AC-21 Fallback thématique | ? Validé dans Chrome |
| AC-22 Favicon ou fallback automatique | ? Validé dans Chrome |
| AC-23 Clic sur la tuile ouvrant le site | ? Validé dans Chrome |
| AC-24 Clic sur le crayon ouvrant la modale sans ouvrir le site | ? Validé dans Chrome |
| AC-25 Champs préremplis en édition | ? Validé dans Chrome |
| AC-26 Sauvegarde des modifications | ? Validé dans Chrome |
| AC-27 Annulation sans modification | ? Validé dans Chrome |
| AC-28 Suppression depuis la modale avec confirmation | ? Validé dans Chrome |
| AC-29 Accessibilité clavier du bouton d'édition | ? Validé dans Chrome |
| AC-30 Aucune croix de suppression visible sur les tuiles | ? Validé dans Chrome |
| AC-31 Crayon masqué au repos sur desktop, visible au hover/focus tactile | ? Validé dans Chrome |
| AC-32 Clic tuile ouvre le site, clic crayon ouvre la modale | ? Validé dans Chrome |
| AC-33 Modale préremplie avec suppression confirmée | ? Validé dans Chrome |
| AC-34 Fermeture sans modification et restauration du focus | ? Validé dans Chrome |
| AC-35 Raccourcis centrés horizontalement | ? Validé dans Chrome |
| AC-36 Retour à la ligne des raccourcis | ? Validé dans Chrome |
| AC-37 Tuile de raccourci avec libellé visible | ? Validé dans Chrome |
| AC-38 Bouton Ajouter en fin de flux | ? Validé dans Chrome |
| AC-39 Crayon en angle supérieur droit | ? Validé dans Chrome |
| AC-40 Aucune action de suppression sur la tuile | ? Validé dans Chrome |
| AC-41 Favicon Chrome avec fallback monogramme | ? Validé dans Chrome |
| AC-42 Carré d'icône 60 × 60 px | ? Validé dans Chrome |
| AC-43 Libellé sous le carré | ? Validé dans Chrome |
| AC-44 Favicon cadré sans étirement | ? Validé dans Chrome |
| AC-45 Crayon en angle supérieur droit | ? Validé dans Chrome |
| AC-46 Favicon 24 × 24 px centré | ? Validé dans Chrome |
| AC-47 Espace horizontal réduit entre raccourcis | ? Validé dans Chrome |
| AC-48 Disparition du crayon après fermeture modale hors hover | ? Validé dans Chrome |
| AC-49 Focus restauré sur le lien principal | ? Validé dans Chrome |
| AC-50 Crayon visible au focus clavier | ? Validé dans Chrome |
| AC-51 Bouton loupe dans la barre de recherche | ? Validé dans Chrome |

## Observations runtime (2026-07-24)

- Recherche et To-do visibles ?
- Panneau Settings fonctionne ? (inclut toggles visibility modules, contrainte au moins un module)
- Thèmes et voile proposés ?
- Fichiers SVG locaux ajoutés pour chaque thème comme fallback V1 ?
- Contraste des menus déroulants corrigé ?
- Réglage Réduire les animations connecté aux transitions CSS ?
- Centrage vertical et horizontal corrigé (100dvh, flex) ?
- Modale de raccourci remplaçant le formulaire inline ?
- Persistance corrigée (chrome.storage.local + localStorage fallback + mergeWithDefaults) ?
- Favicon automatique via chrome.runtime.getURL('/_favicon/') avec pageUrl et size=64, permission favicon ajoutée ?
- Bouton crayon circulaire 32px en angle supérieur droit, masqué au repos ?
- Suppression uniquement depuis la modale avec confirmation ?
- Raccourcis en rangée flex-wrap centrée, tuiles 60x60px, libellé sous icône (2 lignes max) ?
- Bouton Ajouter 60x60 en fin de flux DOM avec libellé ?
- Favicon 24x24px centré avec object-fit: contain ?
- Gap horizontal réduit à 18px ?
- Crayon disparaît après fermeture modale si souris hors tuile ?
- Focus restauré sur le lien principal après fermeture modale ?
- Crayon visible au focus clavier ?
- Bouton loupe SVG monochrome dans la barre de recherche ?
- Validation Chrome manuelle réussie le 2026-07-24 ?

## Corrections appliquées

1. Centrage de l'interface : shell.css mis à jour avec 100dvh, flex centering, settings en overlay fixe
2. Modale de raccourci : ShortcutGrid réécrit avec overlay, dialog modale, focus trap, restauration du focus
3. Persistance : storage.ts réécrit avec chrome.storage.local + localStorage fallback + mergeWithDefaults pour ne pas écraser les données par défaut
4. Fallback SVG : fichiers SVG dans public/backgrounds/ pour chaque thème, documentés comme fallback V1
5. Réglages : options Recherche et To-do conservées, contrainte au moins un module actif
6. Favicon automatique des raccourcis : getFaviconUrl utilise chrome.runtime.getURL('/_favicon/') en contexte extension avec pageUrl et size=64 ; localhost et échecs affichent un monogramme (initiale du libellé)
7. Permission favicon ajoutée dans manifest.json
8. Bouton crayon circulaire superposé : .claritab-shortcut-edit est désormais 32px, en angle supérieur droit (top: -9px, right: -9px), masqué au repos sur desktop, visible au hover/focus-within ou sur tactile
9. Disposition flex-wrap : .claritab-shortcut-grid utilise flex-wrap avec justify-content: center, column-gap: 36px, row-gap: 24px, max-width identique au module principal
10. Tuiles restructurées : IconTile 60x60px (.claritab-shortcut-icon-area) avec favicon/monogramme cadré (object-fit: contain, max 46px), libellé externe sous le carré avec line-clamp 2
11. Suppression retirée des tuiles : aucune croix visible ; suppression uniquement dans la modale avec bouton "Supprimer cet élément" puis confirmation
12. Bouton Ajouter : 60x60px, dernier enfant du flux DOM, avec libellé "Ajouter" sous le "+"
13. Tests : 35 tests passés (validators + storage + ShortcutGrid)

## Contrôles sautés

Aucun pour les contrôles automatisés. Les scénarios AC-15 à AC-45 nécessitent une validation manuelle dans Chrome.

# Acceptance Scenarios

Feature: Première tranche verticale locale  
Primary user or system: utilisateur de ClairTab

## Scenarios

### AC-1 — Ajouter une tâche

GIVEN le mode Focus avec un champ vide.  
WHEN l’utilisateur saisit un titre valide et confirme.  
THEN la tâche apparaît, le champ est vidé et la tâche reste présente après réouverture du nouvel onglet.

### AC-2 — Refuser une tâche vide

GIVEN le mode Focus.  
WHEN l’utilisateur confirme une saisie vide ou composée d’espaces.  
THEN aucune tâche n’est créée et une indication accessible explique la correction.

### AC-3 — Terminer et restaurer

GIVEN une tâche active.  
WHEN l’utilisateur la termine puis la restaure.  
THEN son état visuel et persistant reflète chaque action.

### AC-4 — Basculer de mode

GIVEN le mode Focus visible.  
WHEN l’utilisateur choisit Recherche.  
THEN le module Recherche remplace le module Focus et le choix est conservé après réouverture.

### AC-5 — Soumettre une recherche

GIVEN le mode Recherche et une requête valide.  
WHEN l’utilisateur confirme.  
THEN le navigateur navigue vers des résultats Google correspondant à la requête encodée.

### AC-6 — Ne pas stocker la requête

GIVEN une recherche soumise.  
WHEN le stockage ClairTab est inspecté.  
THEN le texte de la requête n’est pas présent.

### AC-7 — Créer un raccourci valide

GIVEN de la place dans la grille.  
WHEN l’utilisateur saisit un libellé et un domaine valide.  
THEN l’URL est normalisée, la tuile apparaît et reste présente après réouverture.

### AC-8 — Refuser un raccourci dangereux

GIVEN le formulaire de raccourci.  
WHEN l’utilisateur saisit une URL utilisant `javascript:` ou `data:`.  
THEN la sauvegarde est bloquée et une erreur accessible est affichée.

### AC-9 — Ouvrir un raccourci

GIVEN une tuile valide.  
WHEN l’utilisateur l’active.  
THEN le navigateur navigue vers l’URL enregistrée.

### AC-10 — Fond local simulé

GIVEN un thème sélectionné.  
WHEN l’utilisateur ouvre un nouvel onglet.  
THEN un fond local correspondant ou le fallback est visible sans requête distante.

### AC-11 — Utilisation clavier

GIVEN la page chargée.  
WHEN l’utilisateur navigue sans souris.  
THEN il peut changer de mode, ajouter une tâche, ouvrir un raccourci et accéder aux réglages avec un focus visible.

### AC-12 — Composition immersive

GIVEN un nouvel onglet sur desktop.  
WHEN le shell local est affiché.  
THEN la photo occupe le viewport, le groupe principal est centré, le module d'action précède les raccourcis et aucun grand panneau opaque ne masque inutilement le fond.

### AC-13 — Silhouette stable entre les modes

GIVEN le mode Recherche visible.  
WHEN l'utilisateur passe au mode Focus.  
THEN le module principal conserve une largeur, une position et un langage visuel cohérents sans déplacer brutalement les raccourcis.

### AC-14 — Phrase d'ambiance non bloquante

GIVEN la phrase d'ambiance activée, désactivée ou absente.  
WHEN l'utilisateur ouvre le nouvel onglet.  
THEN l'action principale reste au même niveau de priorité et la composition demeure équilibrée.

### AC-15 — Centrage de l'interface

GIVEN le nouvel onglet ouvert sur desktop.  
WHEN le shell local est affiché.  
THEN le contenu principal est centré horizontalement et verticalement dans le viewport, la citation, le sélecteur de modules, le module actif et les raccourcis forment une seule colonne centrale, et la largeur maximale est maîtrisée.

### AC-16 — Centrage avec réglages ouverts

GIVEN les réglages ouverts sur desktop.  
WHEN le panneau Réglages est affiché.  
THEN le contenu principal derrière lui reste centré, le panneau est une couche fixe ou une colonne explicitement gérée, et le centrage vertical n'est pas rompu.

### AC-17 — Modale de raccourci

GIVEN le formulaire de raccourci.  
WHEN l'utilisateur ouvre l'ajout ou l'édition d'un raccourci.  
THEN une modale centrée s'affiche avec overlay, titre, champs étiquetés, boutons Enregistrer/Annuler/X, et Escape ferme sans sauvegarder.

### AC-18 — Persistance des tâches

GIVEN une tâche ajoutée.  
WHEN le navigateur est rafraîchi ou un nouvel onglet est ouvert.  
THEN la tâche persiste dans chrome.storage.local.

### AC-19 — Persistance des préférences

GIVEN une préférence modifiée (module, thème, voile, mode, animations).  
WHEN le navigateur est rafraîchi.  
THEN la préférence persiste dans chrome.storage.local.

### AC-20 — Pas d'écrasement par défaut

GIVEN un état stocké existant.  
WHEN l'extension s'hydrate.  
THEN les valeurs par défaut n'écrasent pas les données existantes.

### AC-21 — Fallback thématique

GIVEN un thème sélectionné.  
WHEN le fond est affiché.  
THEN le fallback SVG/gradient est visible et le changement entre thèmes est observable.

### AC-22 — Favicon ou fallback automatique

GIVEN un raccourci avec une tuile affichée.  
WHEN l'extension est chargée dans Chrome ou sur localhost.  
THEN le favicon automatique du site est visible dans la tuile ; si le favicon n'est pas disponible ou sur localhost, un fallback monogramme (initiale du libellé) est affiché à la place.

### AC-23 — Clic sur la tuile ouvrant le site

GIVEN une tuile de raccourci valide.  
WHEN l'utilisateur clique sur la tuile.  
THEN le navigateur navigue vers l'URL enregistrée du raccourci.

### AC-24 — Clic sur le crayon ouvrant la modale sans ouvrir le site

GIVEN une tuile de raccourci.  
WHEN l'utilisateur clique sur le bouton crayon circulaire superposé.  
THEN la modale d'édition s'ouvre avec les champs préremplis ; le site n'est pas ouvert.

### AC-25 — Champs préremplis en édition

GIVEN la modale d'édition ouverte depuis un raccourci existant.  
WHEN la modale s'affiche.  
THEN le champ Nom contient le libellé actuel et le champ URL contient l'URL actuelle du raccourci.

### AC-26 — Sauvegarde des modifications

GIVEN la modale d'édition ouverte avec des champs modifiés.  
WHEN l'utilisateur clique sur Enregistrer.  
THEN le raccourci est mis à jour avec le nouveau nom et la nouvelle URL, et la modale se ferme.

### AC-27 — Annulation sans modification

GIVEN la modale d'édition ou d'ajout ouverte.  
WHEN l'utilisateur clique sur Annuler ou appuie sur Escape ou clique sur le bouton de fermeture X.  
THEN la modale se ferme sans enregistrer aucune modification dans le stockage.

### AC-28 — Suppression depuis la modale avec confirmation

GIFEN la modale d'édition ouverte pour un raccourci existant.  
WHEN l'utilisateur supprime le raccourci depuis la modale.  
THEN une confirmation est demandée avant suppression ; si confirmée, le raccourci est retiré de la grille et du stockage.

### AC-29 — Accessibilité clavier du bouton d'édition

GIVEN le focus sur une tuile de raccourci.  
WHEN l'utilisateur appuie sur la touche Entrée ou Espace alors que le bouton crayon est ciblé.  
THEN la modale d'édition s'ouvre avec les champs préremplis et le focus est piégé dans la modale.

### AC-30 — Aucune croix de suppression visible sur les tuiles

GIVEN une tuile de raccourci.  
WHEN l'utilisateur observe la tuile au repos, au hover ou au focus clavier.  
THEN aucune croix de suppression n'est visible sur la tuile.

### AC-31 — Crayon masqué au repos sur desktop, visible au hover/focus tactile

GIVEN une tuile de raccourci sur desktop.  
WHEN la tuile est au repos.  
THEN le bouton crayon circulaire est masqué.  
WHEN la tuile reçoit le hover ou le focus clavier.  
THEN le bouton crayon devient visible.  
WHEN la tuile est sur écran tactile sans hover.  
THEN le bouton crayon reste accessible et visible.

### AC-32 — Clic tuile ouvre le site, clic crayon ouvre la modale

GIVEN une tuile de raccourci avec bouton crayon.  
WHEN l'utilisateur clique sur la tuile en dehors du crayon.  
THEN le navigateur navigue vers l'URL du raccourci.  
WHEN l'utilisateur clique sur le bouton crayon.  
THEN la modale d'édition s'ouvre et le site n'est pas ouvert.

### AC-33 — Modale préremplie avec suppression confirmée

GIVEN la modale d'édition ouverte pour un raccourci existant.  
WHEN la modale s'affiche.  
THEN le titre est « Modifier le raccourci », le champ Nom et le champ URL sont préremplis, les boutons Enregistrer, Annuler, X et l'action destructive « Supprimer cet élément » sont présents.  
WHEN l'utilisateur clique sur « Supprimer cet élément » puis confirme.  
THEN le raccourci est retiré de la grille et du stockage, et la modale se ferme.  
WHEN l'utilisateur annule la confirmation.  
THEN le raccourci reste présent, la modale reste ouverte.

### AC-34 — Fermeture sans modification et restauration du focus

GIVEN la modale d'édition ouverte.  
WHEN l'utilisateur clique sur Annuler, sur X ou appuie sur Escape.  
THEN la modale se ferme sans enregistrer de modification, et le focus est restauré sur le bouton crayon qui avait ouvert la modale.

### AC-35 — Raccourcis centrés horizontalement

GIVEN le module principal affiché.  
WHEN les raccourcis sont rendus.  
THEN le conteneur des raccourcis est centré horizontalement, sa largeur maximale est identique à celle du module principal, et les raccourcis sont disposés horizontalement.

### AC-36 — Retour à la ligne des raccourcis

GIVEN un grand nombre de raccourcis ou une largeur étroite.  
WHEN le conteneur ne peut plus afficher toutes les tuiles sur une ligne.  
THEN les raccourcis reviennent à la ligne en restant centrés et ne forment jamais une colonne verticale sur desktop tant qu'il reste de la place.

### AC-37 — Tuile de raccourci avec libellé visible

GIVEN une tuile de raccourci.  
WHEN la tuile est affichée.  
THEN le favicon ou le fallback monogramme est visible dans une zone carrée, le nom du raccourci est centré juste en dessous, il peut occuper jusqu'à deux lignes avec ellipsis, et il ne chevauche pas les tuiles voisines.

### AC-38 — Bouton Ajouter en fin de flux

GIVEN la liste des raccourcis.  
WHEN le DOM est inspecté.  
THEN le bouton Ajouter est le dernier enfant du conteneur, il suit naturellement les raccourcis et le retour à la ligne, et il affiche éventuellement le libellé « Ajouter » sous le symbole « + ».

### AC-39 — Crayon en angle supérieur droit

GIVEN une tuile de raccourci avec son bouton crayon.  
WHEN la tuile est observée sur desktop.  
THEN le crayon est positionné dans l'angle supérieur droit, il chevauche légèrement la tuile, il est masqué au repos et devient visible au hover ou au focus clavier.

### AC-40 — Aucune action de suppression sur la tuile

GIVEN une tuile de raccourci.  
WHEN l'utilisateur inspecte la tuile au repos, au hover ou au focus.  
THEN aucune croix ni action de suppression n'est visible sur la tuile.

### AC-41 — Favicon Chrome avec fallback monogramme

GIVEN un raccourci dont l'URL n'est pas localhost.  
WHEN l'extension est chargée dans Chrome.  
THEN le favicon est chargé via chrome://favicon/64/ ; en cas d'erreur ou sur localhost, un monogramme (initiale du libellé) est affiché à la place, sans image cassée.

### AC-42 — Carré d'icône 60 × 60 px

GIVEN une tuile de raccourci.  
WHEN la tuile est rendue.  
THEN la zone d'icône mesure exactement 60 × 60 px, avec un border-radius cohérent avec l'interface, et le bouton Ajouter utilise la même dimension.

### AC-43 — Libellé sous le carré

GIVEN une tuile de raccourci.  
WHEN la tuile est affichée.  
THEN le nom du raccourci est placé sous le carré d'icône, centré, avec environ 8 px d'écart, il peut occuper jusqu'à deux lignes avec ellipsis, et il ne chevauche pas les éléments voisins.

### AC-44 — Favicon cadré sans étirement

GIVEN un favicon chargé dans le carré 60 × 60 px.  
WHEN l'image est affichée.  
THEN elle est cadrée avec object-fit: contain, sans déformation, sans recadrage forcé, et aucune image cassée n'est visible.

### AC-45 — Crayon en angle supérieur droit

GIVEN une tuile de raccourci avec son bouton crayon.  
WHEN la tuile est observée sur desktop.  
THEN le crayon est positionné dans l'angle supérieur droit, il chevauche légèrement le carré (top: -9px, right: -9px), il est masqué au repos et devient visible au hover ou au focus clavier.

### AC-46 — Favicon 24 × 24 px centré

GIVEN un favicon chargé dans le carré 60 × 60 px.  
WHEN l'image est affichée.  
THEN le favicon mesure 24 × 24 px, est centré dans le carré avec object-fit: contain, sans déformation ni recadrage forcé.

### AC-47 — Espace horizontal réduit entre raccourcis

GIVEN la rangée de raccourcis.  
WHEN les tuiles sont rendues.  
THEN l'espace horizontal entre chaque tuile est d'environ 18 px.

### AC-48 — Disparition du crayon après fermeture modale hors hover

GIVEN la modale d'édition fermée et la souris non survolant la tuile.  
WHEN l'utilisateur ferme la modale.  
THEN le bouton crayon redevient invisible sauf si la souris est sur la tuile ou si le crayon a le focus clavier.

### AC-49 — Focus restauré sur le lien principal

GIVEN la modale d'édition ouverte.  
WHEN l'utilisateur la ferme.  
THEN le focus est restauré sur le lien principal du raccourci, pas sur le bouton crayon.

### AC-50 — Crayon visible au focus clavier

GIVEN un raccourci.  
WHEN l'utilisateur atteint le bouton crayon avec la touche Tab.  
THEN le crayon devient visible et un contour de focus est affiché.

### AC-51 — Bouton loupe dans la barre de recherche

GIVEN la barre de recherche.  
WHEN l'utilisateur clique sur le bouton loupe.  
THEN la recherche est lancée avec la requête saisie ; si la requête est vide, rien ne se passe.  
WHEN l'utilisateur appuie sur Entrée.  
THEN la recherche est également lancée.  
Le bouton possède un aria-label « Lancer la recherche » et un hover/focus visible.

## Scénarios d'acceptation existants conservés

| Scénario | Statut |
|----------|--------|
| AC-1 Ajouter une tâche | ⏳ À valider dans Chrome |
| AC-2 Refuser une tâche vide | ⏳ À valider dans Chrome |
| AC-3 Terminer et restaurer | ⏳ À valider dans Chrome |
| AC-4 Basculer de mode | ⏳ À valider dans Chrome |
| AC-5 Soumettre une recherche | ⏳ À valider dans Chrome |
| AC-6 Ne pas stocker la requête | ⏳ À valider dans Chrome |
| AC-7 Créer un raccourci valide | ⏳ À valider dans Chrome |
| AC-8 Refuser un raccourci dangereux | ⏳ À valider dans Chrome |
| AC-9 Ouvrir un raccourci | ⏳ À valider dans Chrome |
| AC-10 Fond local simulé | ⏳ À valider dans Chrome |
| AC-11 Utilisation clavier | ⏳ À valider dans Chrome |
| AC-12 Composition immersive | ⏳ À valider dans Chrome |
| AC-13 Silhouette stable entre les modes | ⏳ À valider dans Chrome |
| AC-14 Phrase d'ambiance non bloquante | ⏳ À valider dans Chrome |
| AC-15 Centrage de l'interface | ⏳ À valider dans Chrome |
| AC-16 Centrage avec réglages ouverts | ⏳ À valider dans Chrome |
| AC-17 Modale de raccourci | ⏳ À valider dans Chrome |
| AC-18 Persistance des tâches | ⏳ À valider dans Chrome |
| AC-19 Persistance des préférences | ⏳ À valider dans Chrome |
| AC-20 Pas d'écrasement par défaut | ⏳ À valider dans Chrome |
| AC-21 Fallback thématique | ⏳ À valider dans Chrome |
| AC-22 Favicon ou fallback automatique | ⏳ À valider dans Chrome |
| AC-23 Clic sur la tuile ouvrant le site | ⏳ À valider dans Chrome |
| AC-24 Clic sur le crayon ouvrant la modale sans ouvrir le site | ⏳ À valider dans Chrome |
| AC-25 Champs préremplis en édition | ⏳ À valider dans Chrome |
| AC-26 Sauvegarde des modifications | ⏳ À valider dans Chrome |
| AC-27 Annulation sans modification | ⏳ À valider dans Chrome |
| AC-28 Suppression depuis la modale avec confirmation | ⏳ À valider dans Chrome |
| AC-29 Accessibilité clavier du bouton d'édition | ⏳ À valider dans Chrome |

- titre de 160 caractères ;
- tâche Unicode ;
- doublon ;
- 100 tâches ;
- 12 raccourcis ;
- URL sans schéma ;
- port local ;
- stockage rejeté ;
- profil neuf ;
- stockage avec propriété inconnue ;
- plusieurs onglets modifiant l'état ;
- modale ouverte avec champ vide ;
- Escape pendant saisie dans la modale ;
- fenêtre de taille petite avec modale ouverte.

## Non-Goals

- Charger une image distante.
- Synchroniser les données.
- Gérer dates, priorités ou catégories.
- Modifier le moteur de recherche Chrome.


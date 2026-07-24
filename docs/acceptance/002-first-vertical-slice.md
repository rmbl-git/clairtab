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

## Edge Cases

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
- plusieurs onglets modifiant l’état.

## Non-Goals

- Charger une image distante.
- Synchroniser les données.
- Gérer dates, priorités ou catégories.
- Modifier le moteur de recherche Chrome.

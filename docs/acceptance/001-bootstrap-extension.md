# Acceptance Scenarios

Feature: Bootstrap de l’extension ClairTab  
Primary user or system: développeur chargeant l’extension dans Chrome

## Scenarios

### AC-1 — Build reproductible

GIVEN le repository fraîchement cloné avec les dépendances installées.  
WHEN le développeur exécute la commande de build.  
THEN un dossier `dist/` est produit sans erreur et contient le manifeste, la page de nouvel onglet et les assets référencés.

### AC-2 — Chargement unpacked

GIVEN le dossier de build produit.  
WHEN le développeur le charge depuis la page des extensions Chrome.  
THEN Chrome accepte l’extension sans erreur de manifeste ni avertissement de CSP bloquant.

### AC-3 — Remplacement du nouvel onglet

GIVEN l’extension chargée et activée.  
WHEN l’utilisateur ouvre un nouvel onglet normal.  
THEN le shell ClairTab apparaît avec un titre identifiable.

### AC-4 — Permissions minimales

GIVEN le manifeste de la tâche bootstrap.  
WHEN il est inspecté.  
THEN il ne demande que la permission `storage` et ne contient ni content script, ni accès à tous les sites, ni permission d’historique.

### AC-5 — Aucun réseau inattendu

GIVEN le nouvel onglet ouvert.  
WHEN le panneau Réseau est inspecté sans interaction.  
THEN aucune requête applicative distante n’est émise.

### AC-6 — Console exploitable

GIVEN le shell affiché.  
WHEN la console est inspectée.  
THEN aucune erreur inattendue n’est présente.

## Edge Cases

- build exécuté sur un chemin contenant des espaces ;
- rechargement de l’extension ;
- ouverture de plusieurs nouveaux onglets ;
- fenêtre étroite ;
- assets manquants ;
- manifeste copié au mauvais emplacement.

## Non-Goals

- Implémenter les fonctionnalités métier.
- Connecter Pixabay.
- Publier l’extension.
- Finaliser l’identité visuelle.


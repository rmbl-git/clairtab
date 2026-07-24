# Acceptance Scenarios

Feature: Robustesse et fond distant  
Primary user or system: utilisateur de ClairTab et système d’intégration

## Scenarios

### AC-1 — Shell disponible avant le réseau

GIVEN un réseau lent.  
WHEN l’utilisateur ouvre un nouvel onglet.  
THEN les tâches, la recherche et les raccourcis sont utilisables avant la réponse du fond distant.

### AC-2 — Photo distante conforme

GIVEN un proxy configuré et un thème valide.  
WHEN le cache nécessite une nouvelle photo.  
THEN une photo est affichée avec un crédit photographe et un lien fournisseur conformes.

### AC-3 — Clé absente du client

GIVEN le build de production.  
WHEN les fichiers sont inspectés.  
THEN aucune clé Unsplash ou secret équivalent n’est présent.

### AC-4 — Fallback hors ligne

GIVEN aucune connexion et un profil sans photo distante valide.  
WHEN l’utilisateur ouvre un nouvel onglet.  
THEN un fond local est affiché et toutes les actions locales restent disponibles.

### AC-5 — Conserver le dernier fond valide

GIVEN une photo valide déjà chargée.  
WHEN la requête suivante échoue.  
THEN la photo précédente ou un fallback reste affiché sans écran vide.

### AC-6 — Ignorer une réponse obsolète

GIVEN une requête de thème A en cours.  
WHEN l’utilisateur sélectionne le thème B avant la réponse A.  
THEN la réponse A ne remplace pas le thème B.

### AC-7 — Réponse invalide rejetée

GIVEN une réponse proxy avec URL non HTTPS ou champs manquants.  
WHEN le client la reçoit.  
THEN elle est rejetée, un fallback est conservé et aucune donnée invalide n’est persistée.

### AC-8 — Échec de stockage récupérable

GIVEN une écriture de stockage simulée en échec.  
WHEN l’utilisateur modifie une tâche ou un raccourci.  
THEN l’UI revient au dernier état cohérent et explique que la modification n’a pas été enregistrée.

### AC-9 — Permissions limitées

GIVEN le manifeste de release candidate.  
WHEN il est inspecté.  
THEN il contient seulement les permissions nécessaires et l’hôte exact du proxy.

### AC-10 — Aucun contenu utilisateur dans les logs

GIVEN des tâches, recherches et raccourcis contenant des valeurs distinctives.  
WHEN les logs client et Worker sont inspectés.  
THEN aucune de ces valeurs n’apparaît.

### AC-11 — Accessibilité du parcours critique

GIVEN l’application au clavier, au zoom 200 % et avec réduction de mouvement.  
WHEN l’utilisateur exécute les parcours principaux.  
THEN les actions restent visibles, compréhensibles et utilisables.

### AC-12 — Limitation des refreshs

GIVEN plusieurs activations rapides de « Changer le fond ».  
WHEN la limite client est dépassée.  
THEN les appels supplémentaires sont évités et un feedback non bloquant est affiché.

## Edge Cases

- proxy non configuré ;
- quota fournisseur atteint ;
- timeout ;
- image 404 ;
- cache expiré ;
- cache corrompu ;
- couleur de fond invalide ;
- texte d’attribution long ;
- plusieurs onglets simultanés ;
- changement de version du schéma ;
- plateforme de logs activée par défaut.

## Non-Goals

- Publier sur le Chrome Web Store.
- Obtenir un quota de production garanti.
- Ajouter un autre fournisseur d’images.
- Synchroniser les données.

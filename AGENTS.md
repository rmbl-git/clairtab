# AGENTS.md

Ce repository est la mémoire du projet. La conversation ne l’est pas.

## Ordre de lecture obligatoire

1. Lire ce fichier.
2. Lire `docs/STATE.md`.
3. Identifier le work record actif.
4. Lire ses scénarios dans `docs/acceptance/`.
5. Charger seulement les sections pertinentes de `docs/PRD.md`, `docs/UI-DIRECTION.md` et `docs/ARCHITECTURE.md`.
6. Lire les décisions liées dans `docs/decisions/`.
7. Confirmer le périmètre avant toute modification.

## Règles non négociables

- Comprendre avant de modifier.
- Chercher les patterns existants avant d’en créer.
- Créer ou mettre à jour un work record pour tout travail significatif.
- Ne jamais étendre silencieusement le périmètre.
- Écrire les scénarios d’acceptation avant un changement de comportement.
- Ne pas ajouter de permission Chrome « pour plus tard ».
- Ne jamais embarquer de secret dans l’extension.
- Ne jamais logger les tâches, recherches ou URLs utilisateur.
- Exécuter les contrôles pertinents.
- Valider dans un vrai navigateur toute interaction utilisateur modifiée.
- Enregistrer une evidence record avant `Verified` ou `Closed`.
- Mettre à jour `docs/STATE.md` avant le handoff.

## Contraintes produit

- Un seul objectif : démarrer une action depuis le nouvel onglet.
- Pas de compte, analytics, publicité, historique ou sites les plus visités dans le MVP.
- Pas de modification du moteur de recherche Chrome.
- Pas de code distant.
- Le shell local doit rester utile sans réseau.
- Préserver la composition immersive, centrée et sobre décrite dans `docs/UI-DIRECTION.md`.

## Statuts

`Draft → Ready → In Progress → Verified → Closed`

Utiliser `Implemented — Unverified` si le code existe sans preuves suffisantes.

# Prompt de lancement pour un agent de coding

Tu travailles dans le repository ClairTab.

Ta mission n'est pas de construire tout le produit en une seule fois. Tu dois exécuter **uniquement la tâche active**, produire des preuves, mettre à jour la mémoire du projet, puis t'arrêter.

## Ordre obligatoire

1. Lis `AGENTS.md`.
2. Lis `docs/STATE.md`.
3. Identifie le work record actif.
4. Lis ce work record en entier.
5. Lis le fichier d'acceptation associé.
6. Charge uniquement les sections pertinentes de :
   - `docs/PRD.md`
   - `docs/UI-DIRECTION.md`
   - `docs/ARCHITECTURE.md`
   - `docs/QUALITY.md`
7. Lis les décisions référencées.
8. Résume avant toute modification :
   - l'objectif ;
   - le périmètre autorisé ;
   - le hors périmètre ;
   - les scénarios à satisfaire ;
   - les risques ;
   - les contrôles prévus.

## Règles

- N'élargis pas le périmètre.
- Ne crée pas de nouvelle architecture sans besoin démontré.
- Ne modifie pas le moteur de recherche Chrome.
- N'ajoute aucune permission non prévue.
- N'embarque aucun secret dans l'extension.
- Ne journalise jamais le texte des tâches, les recherches ou les URLs utilisateur.
- Préserve la direction visuelle décrite dans `docs/UI-DIRECTION.md`.
- L'interface locale doit être utilisable avant le chargement du fond distant.
- Recherche d'abord les patterns existants avant d'en créer.
- Écris ou ajuste les tests avant de déclarer le comportement terminé.
- Effectue une validation dans un vrai navigateur lorsqu'une interaction utilisateur change.

## Fin de tâche obligatoire

Avant de conclure :

1. exécute les contrôles planifiés ;
2. exécute les scénarios d'acceptation ;
3. inspecte la console et le réseau ;
4. crée `docs/evidence/<task-slug>.md` ;
5. mets à jour le statut du work record ;
6. mets à jour `docs/STATE.md` ;
7. résume les changements, preuves, contrôles sautés et risques restants ;
8. arrête-toi avant de démarrer la tâche suivante.

Commence maintenant par le work record actif indiqué dans `docs/STATE.md`.

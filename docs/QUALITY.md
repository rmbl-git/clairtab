# Quality Strategy — ClairTab

## Definition of Done

Une tâche est `Verified` ou `Closed` seulement lorsque :

- le work record est à jour ;
- les scénarios d’acceptation existent ;
- le périmètre réel correspond au périmètre autorisé ;
- le typecheck passe ;
- le lint passe ;
- le build passe ;
- les tests pertinents passent ;
- la validation runtime prévue est exécutée ;
- la console et le réseau sont inspectés ;
- les contrôles d’accessibilité pertinents sont exécutés ;
- les contrôles de sécurité pertinents sont exécutés ;
- les vérifications sautées sont justifiées ;
- une evidence record est créée ;
- `docs/STATE.md` est mis à jour ;
- le handoff permet une reprise sans conversation.

Un code compilé sans preuve utilise `Implemented — Unverified`.

## Contrôles TypeScript

Commande cible :

```bash
npm run typecheck
```

Exigences :

- `strict: true` ;
- pas de `any` implicite ;
- pas de suppression globale d’erreurs ;
- types explicites aux frontières stockage et réseau ;
- unions discriminées pour les états ;
- validation runtime des données externes ;
- erreurs `unknown` raffinées avant usage.

## Lint

Commande cible :

```bash
npm run lint
```

Contrôles :

- règles React Hooks ;
- imports inutilisés ;
- promesses non gérées ;
- dépendances d’effets ;
- interdiction de `dangerouslySetInnerHTML` sauf décision formelle ;
- interdiction de logs contenant données utilisateur ;
- absence de secrets ou clés plausibles.

## Build

Commande cible :

```bash
npm run build
```

Le contrôle vérifie :

- sortie `dist/` ;
- présence du manifeste ;
- présence de `newtab.html` ;
- chemins d’assets corrects ;
- aucun fichier source inutile ;
- aucun secret ;
- pas de source map publique en production sans décision ;
- chargement unpacked du build.

## Tests utiles

### Unitaires

- normalisation des tâches ;
- validation des limites ;
- validation et normalisation des URLs ;
- migrations de stockage ;
- sélection du fond ;
- validation du contrat proxy ;
- calcul de cache expiré ;
- construction de l’URL Google.

### Composants

- ajout de tâche ;
- erreurs inline ;
- terminer et restaurer ;
- bascule de mode ;
- création et édition de raccourci ;
- états vides ;
- confirmation destructive ;
- attribution du fond ;
- navigation clavier.

### End-to-end

- extension chargée dans Chromium ;
- ouverture d’un nouvel onglet ;
- persistance ;
- recherche ;
- raccourci ;
- fallback réseau ;
- absence d’erreur console.

## Parcours critiques

1. Ouvrir un nouvel onglet et voir le shell.
2. Ajouter une tâche.
3. Terminer puis restaurer une tâche.
4. Réouvrir Chrome et retrouver l’état.
5. Basculer vers Recherche et soumettre une requête.
6. Ajouter et ouvrir un raccourci.
7. Charger une photo distante.
8. Continuer à utiliser l’application lorsque le réseau échoue.
9. Réinitialiser les données avec confirmation.

## Validation runtime

Pour tout changement d’interaction :

1. lancer l’application ou le build ;
2. charger l’extension unpacked ;
3. ouvrir un nouvel onglet ;
4. exécuter les scénarios concernés ;
5. inspecter les états visibles ;
6. inspecter la console ;
7. inspecter les requêtes ;
8. tester au moins un état d’erreur pertinent ;
9. capturer une preuve.

Le build seul ne prouve pas que `chrome_url_overrides` fonctionne.

## Accessibilité

Contrôles minimum :

- parcours clavier complet ;
- ordre de focus logique ;
- focus visible ;
- noms accessibles ;
- annonces d’erreur pertinentes ;
- contrastes sur plusieurs fonds ;
- zoom 200 % ;
- largeur 320 CSS px ;
- réduction de mouvement ;
- checkbox et boutons utilisables sans pointeur ;
- modale avec gestion du focus ;
- fermeture Escape ;
- aucun état uniquement par couleur.

## Sécurité

Contrôles minimum :

- inspecter les permissions du manifeste ;
- vérifier l’absence de `<all_urls>` ;
- vérifier l’absence de content scripts ;
- vérifier l’absence de secret dans `dist/` ;
- refuser les schémas dangereux ;
- vérifier la CSP ;
- vérifier l’absence de code distant ;
- valider les réponses du proxy ;
- confirmer que tâches, recherches et URLs ne sont pas loggées ;
- utiliser HTTPS ;
- vérifier le fallback si le proxy renvoie un contenu invalide ;
- examiner les dépendances nouvelles.

## Responsive

Tester au minimum :

- 320 × 700 ;
- 768 × 700 ;
- 1280 × 800 ;
- 1920 × 1080 ;
- zoom 200 % ;
- grille avec 0, 1, 8 et 12 raccourcis ;
- tâche de longueur maximale.

## Performance

Vérifier :

- le shell apparaît avant le fond distant ;
- l’UI reste interactive avec réseau lent ;
- pas de requête dupliquée non justifiée ;
- image dimensionnée ;
- pas de layout shift majeur ;
- pas de boucle d’écriture storage ;
- pas d’animation coûteuse en continu.

## Règles relatives aux preuves

Chaque evidence record doit contenir :

- commandes exactes ;
- résultats ;
- scénarios et statut ;
- actions runtime ;
- erreurs console ;
- requêtes échouées ;
- captures ou chemins ;
- risques restants ;
- handoff.

Les affirmations « testé » ou « fonctionne » sans détails ne sont pas des preuves.

## Vérifications sautées

Toute vérification sautée doit inclure :

- le contrôle ;
- la raison ;
- le risque créé ;
- la personne ou tâche devant le reprendre ;
- la condition de clôture.

Une tâche ne peut pas être `Closed` avec une vérification critique sautée sans acceptation explicite du risque.

# ClairTab — Product Brief

> Nom de travail. Le nom définitif et l’identité de marque restent à confirmer.

## Partie A — Compréhension

### Produit compris

ClairTab est une extension Chrome qui remplace la page « Nouvel onglet » par un espace personnel, calme et immédiatement utile. L’utilisateur y retrouve :

- un mode principal configurable : liste de tâches ou recherche Google ;
- un fond photographique renouvelé selon un thème choisi ;
- une grille de raccourcis vers ses sites favoris ;
- quelques réglages simples, conservés localement.

Le produit n’est pas un gestionnaire de tâches complet, un moteur de recherche alternatif ou un agrégateur de navigation. Il s’agit d’un point de départ quotidien.

### Utilisateur principal

Une personne travaillant ou étudiant principalement dans Chrome, ouvrant souvent de nouveaux onglets et souhaitant :

- capturer une intention sans changer d’outil ;
- accéder plus vite à quelques destinations fréquentes ;
- réduire la sensation de bruit visuel ;
- personnaliser son environnement sans créer de compte.

### Situation d’usage

L’utilisateur ouvre un nouvel onglet entre deux actions : démarrer une recherche, noter une tâche, rejoindre un outil fréquent ou simplement se recentrer.

### Problème observé

La page de nouvel onglet standard n’aide pas toujours l’utilisateur à transformer cette micro-transition en action utile. Les alternatives existantes peuvent devenir surchargées, exiger un compte, demander trop de permissions ou détourner l’expérience de recherche.

### Proposition de valeur

**Chaque nouvel onglet devient un point de départ personnel : une intention, quelques accès utiles et une ambiance visuelle choisie, sans compte ni collecte superflue.**

### Parcours central

1. L’utilisateur ouvre un nouvel onglet.
2. L’interface locale apparaît immédiatement, avant le chargement éventuel de la photo.
3. Le mode préféré est visible :
   - en mode Focus, l’utilisateur ajoute ou termine une tâche ;
   - en mode Recherche, il saisit une requête et la soumet à Google.
4. L’utilisateur peut ouvrir un raccourci favori.
5. Les changements sont persistés localement.
6. Si le fournisseur d’images est indisponible, un fond local reste affiché.

### Résultat attendu

L’utilisateur peut démarrer une action utile en quelques secondes, sans onboarding lourd, sans compte et sans perte de contrôle sur ses réglages Chrome.

### Hypothèses retenues

- Cible initiale : Chrome desktop.
- Distribution visée : extension publiable sur le Chrome Web Store, avec possibilité de chargement « unpacked » pendant le développement.
- Les tâches, raccourcis et préférences restent locaux pour le MVP.
- Aucune authentification.
- Aucune analytique comportementale dans le MVP.
- La recherche est envoyée à Google uniquement après une action explicite.
- Le produit ne remplace pas le moteur de recherche configuré dans Chrome.
- Le mode préféré est choisi par l’utilisateur ; les deux modes restent accessibles.
- Quatre thèmes prédéfinis sont suffisants au départ : paysages, architecture, minimal, nature.
- Les images distantes sont non bloquantes et disposent d’un fallback local.
- L’intégration distante recommandée utilise Unsplash par l’intermédiaire d’un proxy léger.
- Lummi n’est pas interrogé automatiquement dans le MVP faute d’API publique validée.

### Ambiguïtés et analyse critique

#### « To-do list ou barre de recherche »

Le mot « ou » peut signifier un choix exclusif, une alternance ou deux widgets simultanés. Afficher les deux en permanence risque de surcharger l’écran. La recommandation est un sélecteur de mode, avec un seul module principal visible à la fois.

#### Personnalisation

« Customisable » peut devenir très large : couleurs, typographies, disposition libre, widgets, météo, calendrier, citations. Pour le MVP, la personnalisation se limite au mode principal, au thème photo et aux raccourcis.

#### Tâches

Une to-do peut rapidement demander échéances, priorités, récurrence, catégories et synchronisation. Le MVP couvre seulement : ajouter, terminer, restaurer et supprimer.

#### Raccourcis

Récupérer automatiquement les sites les plus visités demanderait une permission supplémentaire et traiterait l’activité de navigation. Le MVP demande à l’utilisateur de créer ses raccourcis manuellement.

#### Images

Une requête distante à chaque nouvel onglet peut ralentir l’expérience et consommer rapidement un quota. Le produit doit afficher d’abord le shell local, mettre en cache les métadonnées et conserver un fallback.

#### Recherche

Le produit doit éviter tout comportement assimilable à un détournement du moteur de recherche. La barre est un formulaire visible, déclenché par l’utilisateur, sans modification des réglages Chrome.

#### Données

Les titres de tâches et les URLs de raccourcis sont des données utilisateur. Même locales, elles doivent être documentées dans la politique de confidentialité et ne doivent jamais apparaître dans des logs distants.

### Simplifications recommandées

- Pas de compte ni de synchronisation serveur.
- Pas de drag-and-drop dans le MVP.
- Pas de favicon distant : afficher une initiale ou une icône locale.
- Pas de météo, calendrier, notes, citations ou widgets tiers.
- Pas d’historique des recherches.
- Pas de récupération des sites les plus visités.
- Pas d’éditeur de disposition.
- Pas d’images générées par IA.
- Pas de service worker d’extension tant qu’un besoin réel ne l’impose.

### Opportunités de différenciation

- Un seul module principal à la fois pour préserver le calme.
- Une interface utilisable avant le chargement du fond.
- Une personnalisation limitée mais cohérente, plutôt qu’un tableau de bord à widgets.
- Une transparence claire : données locales, permissions minimales, aucune télémétrie.
- Un « rituel de nouvel onglet » centré sur l’intention, pas sur la quantité d’informations.

### Décisions humaines à confirmer

Ces décisions ne bloquent pas le bootstrap, mais doivent être confirmées avant la clôture de la première tranche verticale.

1. **Distribution** — Recommandation : viser une publication Chrome Web Store, pas seulement une démo locale.
2. **Nom** — Recommandation : conserver `ClairTab` comme nom de travail jusqu’au test utilisateur.
3. **Mode par défaut** — Recommandation : mode Focus pour démontrer la différenciation ; Recherche reste accessible en un clic.
4. **Thèmes** — Recommandation : quatre thèmes prédéfinis, sans champ de recherche libre.
5. **Volume de raccourcis** — Recommandation : maximum 12, avec 8 visibles sans scroll sur écran standard.
6. **Politique d’images** — Recommandation : Unsplash via proxy pour le MVP public ; catalogue local simulé tant que les clés et conditions de production ne sont pas validées.

## Partie B — Hardening

### Revue produit

**Constats**

- Le problème est compréhensible : rendre le nouvel onglet plus utile et personnel.
- La proposition devient générique si le produit est présenté comme un simple « dashboard ».
- La différenciation doit reposer sur la sobriété, la rapidité et l’intention.
- Les fonctions restent compatibles avec un objectif unique si elles sont décrites comme des moyens de démarrer une action depuis le nouvel onglet.
- Le résultat peut être observé par des tests de parcours et des retours utilisateurs, même sans analytique.

**Actions**

- Formuler un seul bénéfice principal.
- Limiter la personnalisation.
- Éviter toute extension vers un gestionnaire de productivité complet.
- Tester la compréhension du mode principal et des raccourcis.

### Revue architecture

**Constats**

- React, TypeScript et Vite sont suffisants.
- Une extension Manifest V3 peut remplacer `newtab` sans content script.
- Le stockage local Chrome est proportionné.
- Le seul composant serveur justifié est le proxy protégeant la clé du fournisseur d’images.
- Le shell ne doit pas dépendre du réseau.
- Une abstraction de fournisseur d’images est utile ; une architecture de plugins générique ne l’est pas.

**Actions**

- Ne demander que `storage` et l’accès hôte au proxy.
- Ne pas ajouter de service worker d’extension sans nécessité.
- Mettre les images en cache sous forme de métadonnées, pas de blobs.
- Prévoir un fournisseur `mock` et un fournisseur `unsplash`.
- Garder la recherche comme navigation standard.

### Revue sécurité

**Constats**

- Les tâches peuvent contenir des informations personnelles.
- Les URLs de raccourcis peuvent révéler des habitudes ou des services utilisés.
- Une clé Unsplash dans le bundle serait exposée.
- Les raccourcis peuvent devenir un vecteur dangereux si les schémas `javascript:`, `data:` ou `file:` sont acceptés.
- Les permissions trop larges augmenteraient le risque et la friction d’installation.

**Actions**

- Stockage local uniquement.
- Aucune télémétrie dans le MVP.
- Validation stricte des URLs.
- Proxy avec secret serveur, allowlist de thèmes, rate limiting et cache.
- CSP restrictive et aucun code distant.
- Politique de confidentialité avant publication.
- Pas de logs contenant titres de tâches, requêtes ou URLs de raccourcis.

### Revue QA

**Constats**

- Les comportements principaux sont observables.
- Les états réseau et les erreurs de stockage doivent être explicitement simulables.
- Le chargement de l’extension doit être validé dans un vrai profil Chromium.
- Le build seul ne prouve pas le remplacement du nouvel onglet.

**Actions**

- Tests unitaires du modèle local et des validateurs.
- Tests composants des modes, tâches et raccourcis.
- Test end-to-end avec extension chargée.
- Validation runtime des erreurs du fournisseur d’images.
- Preuves de console et réseau pour chaque tâche significative.

### Revue design

**Constats**

- Le fond photo peut réduire la lisibilité.
- Le nouvel onglet donne initialement le focus à l’omnibox, pas nécessairement au champ de l’extension.
- Les actions d’édition peuvent encombrer l’écran.
- Une grille de raccourcis doit rester utilisable sur petites fenêtres.

**Actions**

- Ajouter un voile adaptatif derrière le contenu.
- Ne pas dépendre de l’autofocus.
- Afficher les actions secondaires au focus ou au survol, tout en restant accessibles au clavier.
- Prévoir états vides, chargement non bloquant, erreur et fallback.
- Respecter `prefers-reduced-motion`.
- Garantir une navigation clavier complète.

### Revue contenu

**Constats**

- « Boostez votre productivité » serait trop générique.
- Les labels « Todo » et « Search » peuvent être localisés simplement.
- Les erreurs techniques ne doivent pas être exposées telles quelles.
- Le crédit photo doit être visible sans concurrencer l’action principale.

**Actions**

- Utiliser une promesse factuelle.
- Employer des verbes directs : Ajouter, Terminer, Modifier, Supprimer.
- Écrire des erreurs récupérables : « La photo n’a pas pu être chargée. Le fond par défaut reste disponible. »
- Afficher une attribution discrète mais accessible.

### Corrections obligatoires

- Définir le produit comme un nouvel onglet productif, pas comme un tableau de bord multi-usage.
- Fixer un mode principal unique à l’écran.
- Exclure la récupération automatique des sites les plus visités.
- Protéger la clé du fournisseur d’images côté serveur.
- Valider et normaliser les URLs des raccourcis.
- Garantir un fonctionnement utile sans réseau.
- Préparer une politique de confidentialité avant publication.
- Respecter les exigences d’attribution et de hotlinking du fournisseur retenu.
- Ne pas modifier le moteur de recherche Chrome.

### Améliorations facultatives

- Synchroniser seulement les préférences non sensibles via `chrome.storage.sync`.
- Ajouter des raccourcis clavier configurables.
- Autoriser une photo personnelle importée localement.
- Ajouter un mode « fond uni ».
- Proposer un export/import JSON local.
- Ajouter plusieurs fournisseurs d’images après validation juridique et technique.

### Risques acceptés

- Le MVP ne synchronise pas les données entre appareils.
- Le thème est choisi dans une liste fermée.
- Le cache peut afficher la même photo plusieurs fois.
- Le mode Recherche utilise Google uniquement.
- L’expérience incognito peut différer et n’est pas une cible du MVP.
- Le lancement public dépendra de l’approbation et des quotas du fournisseur d’images.
- Les mesures de valeur initiales seront qualitatives et basées sur des sessions de test.

### Verdict de readiness

**Verdict : `CONCERNS`**

Le bootstrap et la tranche locale peuvent commencer. La publication et la clôture de l’intégration photo nécessitent toutefois :

- validation du compte et des clés Unsplash ;
- déploiement du proxy ;
- vérification finale des conditions d’utilisation ;
- rédaction et publication d’une politique de confidentialité ;
- confirmation du nom et du mode par défaut.

## Partie C — Recommandation

### Concept recommandé

**ClairTab est une nouvelle page Chrome qui transforme chaque nouvel onglet en point de départ personnel : une action principale, quelques raccourcis et un fond thématique, sans compte ni collecte superflue.**

### Promesse centrale

**Commencer la prochaine action sans quitter le nouvel onglet.**

### Tranche verticale principale

Ouvrir un nouvel onglet, voir immédiatement le shell local et un fond, ajouter une tâche, la terminer, basculer vers Recherche, soumettre une requête Google et ouvrir un raccourci. Les données restent après fermeture et réouverture de Chrome.

### Fonctionnalités indispensables

- remplacement de la page Nouvel onglet ;
- mode Focus avec liste de tâches simple ;
- mode Recherche Google ;
- bascule entre modes et mémorisation du mode préféré ;
- raccourcis manuels ;
- fond thématique renouvelé ;
- attribution photo ;
- stockage local ;
- fallback hors ligne ;
- réglages minimaux ;
- accessibilité clavier ;
- validation des URLs ;
- absence de télémétrie.

### Fonctionnalités reportées

- synchronisation multi-appareils ;
- échéances, priorités et récurrence ;
- glisser-déposer ;
- import/export ;
- raccourcis clavier configurables ;
- image personnelle ;
- thèmes libres ;
- plusieurs moteurs de recherche ;
- statistiques personnelles ;
- version Firefox ou Edge explicitement supportée.

### Fonctionnalités explicitement exclues

- compte utilisateur ;
- base distante de tâches ;
- calendrier ;
- météo ;
- notes longues ;
- citations ;
- flux d’actualités ;
- publicité ;
- récupération de l’historique ou des sites les plus visités ;
- injection de contenu dans les pages visitées ;
- remplacement du moteur de recherche Chrome ;
- scraping de banques d’images ;
- code applicatif distant.

### Parties simulables

- fournisseur d’images remplacé par un catalogue JSON local ;
- erreurs réseau déclenchées par un mode de test ;
- crédit photo alimenté par des fixtures ;
- proxy représenté par un contrat JSON stable.

### Données locales

- tâches ;
- raccourcis ;
- préférences ;
- dernière photo et métadonnées d’attribution ;
- version du schéma local ;
- indicateur d’onboarding terminé.

### Difficulté

**Moyenne**

La page et le stockage local sont simples. Les difficultés principales sont la qualité d’expérience au chargement, les règles des extensions Chrome, la sécurité des URLs et l’intégration conforme du fournisseur d’images.

### Stack recommandée

- Chrome Extension Manifest V3 ;
- React ;
- TypeScript strict ;
- Vite ;
- Tailwind CSS ;
- `chrome.storage.local` ;
- Vitest ;
- React Testing Library ;
- Playwright pour la validation Chromium ;
- Cloudflare Worker pour le proxy Unsplash ;
- GitHub Actions pour typecheck, lint, tests et build.

### Risques principaux

- non-conformité Chrome Web Store si le produit semble détourner la recherche ;
- fuite d’une clé API si elle est embarquée dans l’extension ;
- lenteur ou écran vide lorsque le réseau échoue ;
- permissions trop larges ;
- manque de lisibilité sur certains fonds ;
- corruption ou migration du stockage local ;
- dépendance commerciale et contractuelle au fournisseur d’images ;
- extension silencieuse du périmètre vers un dashboard générique.

## Références officielles utilisées

- Chrome — Override Chrome pages: https://developer.chrome.com/docs/extensions/develop/ui/override-chrome-pages
- Chrome — Storage API: https://developer.chrome.com/docs/extensions/reference/api/storage
- Chrome — Manifest V3: https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3
- Chrome — Cross-origin network requests: https://developer.chrome.com/docs/extensions/develop/concepts/network-requests
- Chrome Web Store — Quality guidelines: https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines
- Chrome Web Store — Privacy policies: https://developer.chrome.com/docs/webstore/program-policies/privacy
- Unsplash API documentation: https://unsplash.com/documentation
- Unsplash API guidelines: https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines
- Lummi license: https://www.lummi.ai/license
- Lummi terms: https://www.lummi.ai/terms

## Partie E — Démarrage

### Contexte minimal à charger pour la première tâche

Lire uniquement :

1. `AGENTS.md`
2. `docs/STATE.md`
3. `docs/work-records/001-bootstrap-extension.md`
4. `docs/acceptance/001-bootstrap-extension.md`
5. `docs/ARCHITECTURE.md` — Vue d’ensemble, Stack, Structure du dépôt, Manifest, CSP
6. `docs/QUALITY.md` — Definition of Done, TypeScript, lint, build, validation runtime
7. `docs/decisions/001-manifest-v3-local-first.md`

Le PRD complet n’est pas nécessaire au bootstrap. Charger seulement ses sections 7, 8, 11 et 21 si un arbitrage produit apparaît.

### Décisions humaines encore nécessaires

Avant la fin de la première tranche verticale :

- confirmer ou remplacer le nom `ClairTab` ;
- confirmer le mode Focus comme mode initial ;
- confirmer la cible Chrome Web Store ;
- confirmer les quatre thèmes ;
- décider si `http:` est autorisé hors localhost.

Avant la clôture de l’intégration photo :

- fournir ou créer le compte Unsplash ;
- provisionner la clé et le Worker ;
- confirmer les conditions et quotas applicables ;
- publier une politique de confidentialité ;
- décider du domaine public du proxy.

### Preuves attendues avant de commencer la tâche suivante

La tâche 002 ne doit pas commencer avant que la tâche 001 fournisse :

- résultats de `typecheck`, `lint`, `test` et `build` ;
- arbre du dossier `dist/` ;
- manifeste réellement chargé ;
- capture de l’extension dans `chrome://extensions` ;
- capture d’un nouvel onglet ClairTab ;
- inspection de la console sans erreur inattendue ;
- inspection réseau sans appel distant inattendu ;
- confirmation des permissions minimales ;
- `docs/evidence/001-bootstrap-extension.md` complété ;
- `docs/STATE.md` mis à jour ;
- work record 001 au statut `Verified` ou `Closed`.

### Point de versionnement Git recommandé

Créer d’abord un commit documentaire :

```text
docs: define ClairTab product, architecture and delivery harness
```

Tag recommandé :

```text
product-baseline-v0.1
```

Après validation du bootstrap :

```text
feat: bootstrap ClairTab Manifest V3 extension
```

Tag recommandé :

```text
bootstrap-v0.1.0
```

Ne mélanger dans aucun de ces commits une fonctionnalité de tâche, de recherche, de raccourci ou d’image distante.


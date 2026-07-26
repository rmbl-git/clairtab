# Architecture — ClairTab

## Vue d’ensemble

ClairTab est une extension Chrome Manifest V3 composée d’une page d’extension locale et d’un proxy HTTP indépendant pour les métadonnées d’images.

```text
┌─────────────────────────────────────────────────────────────┐
│ Chrome Extension                                           │
│                                                             │
│  newtab.html                                                │
│     │                                                       │
│     ├── React UI                                            │
│     ├── Domain services                                     │
│     ├── Storage adapter ─────── chrome.storage.local         │
│     └── Background client ───── HTTPS ─────┐                │
└─────────────────────────────────────────────┼────────────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │ Cloudflare Worker │
                                    │ allowlist + cache │
                                    │ secret API key    │
                                    └─────────┬────────┘
                                              │
                                              ▼
                                        Pixabay API
                                               │
                                               ▼
                                   images.pixabay.com
```

Le shell, les tâches, la recherche et les raccourcis fonctionnent sans proxy. Le réseau enrichit uniquement le fond.

## Principes

1. Local-first.
2. Permissions minimales.
3. Pas de content scripts.
4. Pas de code distant.
5. Pas de secret dans l’extension.
6. Réseau non bloquant.
7. Contrats validés aux frontières.
8. Architecture proportionnée au MVP.
9. Preuves runtime pour les interactions.
10. Possibilité de remplacer le fournisseur d’images.

## Composants principaux

### `NewTabApp`

Responsable de la composition générale :

- hydratation de l’état local ;
- rendu du shell ;
- orchestration des modes ;
- ouverture des réglages ;
- gestion de l’état global minimal.

### `ModeSwitcher`

- affiche Focus et Recherche ;
- expose un état accessible ;
- persiste le choix ;
- ne monte qu’un module principal visible.

### `TaskPanel`

- saisie ;
- liste active ;
- liste terminée ;
- actions terminer, restaurer, supprimer ;
- états vide et erreur.

### `SearchPanel`

- champ de requête ;
- validation ;
- navigation explicite vers Google ;
- aucune persistance du texte.

### `ShortcutGrid`

- grille ;
- création et édition via dialogue ;
- validation URL ;
- navigation ;
- état vide et limite atteinte.

### `AmbientHeader`

- affiche une phrase d'ambiance locale optionnelle ;
- ne dépend d'aucun service distant ;
- se masque proprement sans laisser de vide structurel.

### `BackgroundLayer`

- affiche immédiatement le dernier fond valide ou un fallback ;
- charge une nouvelle photo en arrière-plan ;
- gère transition, erreur et attribution ;
- ne contient aucune logique fournisseur spécifique.

### `SettingsPanel`

- mode préféré ;
- thème ;
- réduction de mouvement ;
- réinitialisation locale ;
- informations de confidentialité.

### `StorageRepository`

Interface unique pour :

- lire l’état ;
- valider le schéma ;
- migrer ;
- écrire ;
- gérer les erreurs ;
- notifier l’UI.

### `BackgroundProvider`

Contrat :

```text
getBackground(theme, options) -> BackgroundResult
```

Implémentations :

- `MockBackgroundProvider` pour développement et tests ;
- `ProxyBackgroundProvider` pour production.

### `Diagnostics`

- événements techniques structurés ;
- activés uniquement en développement ou par flag local ;
- aucune donnée utilisateur brute ;
- catégories : storage, background, validation, navigation.

## Flux de données

### Initialisation

```text
document loaded
→ render minimal shell
→ read local state
→ validate schema
→ migrate if required
→ render user state
→ display cached/fallback background
→ if cache expired, request background asynchronously
→ validate response
→ preload image
→ commit new background metadata
→ render attribution
```

### Ajouter une tâche

```text
submit
→ capture input
→ trim and validate
→ create domain entity
→ optimistic local state
→ persist full task state
→ success: keep rendered state
→ failure: rollback + recoverable message
```

### Soumettre une recherche

```text
submit
→ capture query
→ trim and validate
→ build URL with URLSearchParams
→ navigation to Google
```

Aucun appel d’API interne et aucune persistance.

### Créer un raccourci

```text
submit dialog
→ normalize candidate URL
→ parse with URL
→ validate protocol
→ validate label and limit
→ persist
→ render tile
```

### Charger une photo

```text
theme selected or cache expired
→ request proxy with allowed theme ID
→ proxy validates theme
→ edge cache lookup
→ Unsplash request if needed
→ normalize provider response
→ client validates response
→ preload image
→ update cache
```

## Stack et justification

### Extension

- **React** : composants d’interface et états prévisibles.
- **TypeScript strict** : contrats et migrations plus sûrs.
- **Vite** : build simple et rapide.
- **Tailwind CSS** : système visuel compact ; éviter les classes dynamiques non détectables.
- **Chrome Manifest V3** : version actuelle de la plateforme.
- **`chrome.storage.local`** : stockage persistant conçu pour les extensions.

Le projet n’a pas besoin de Redux, d’un routeur, d’un backend applicatif, de Supabase ou d’IndexedDB pour le MVP.

### Proxy

- **Cloudflare Worker** : secret serveur, cache edge, déploiement léger.
- Aucun stockage utilisateur.
- Aucun identifiant individuel.
- Logs réduits aux statuts, latences et thèmes agrégés si les logs sont activés.

### Tests

- **Vitest** : logique et contrats.
- **React Testing Library** : comportements de composants.
- **Playwright** : profil Chromium persistant et extension unpacked.
- **axe-core** ou contrôle équivalent uniquement si son ajout reste proportionné.

## Structure du dépôt recommandée

```text
/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── backgrounds/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── tasks/
│   │   ├── search/
│   │   ├── shortcuts/
│   │   ├── background/
│   │   └── settings/
│   ├── domain/
│   ├── infrastructure/
│   │   ├── storage/
│   │   ├── background/
│   │   └── diagnostics/
│   ├── styles/
│   ├── test/
│   └── main.tsx
├── worker/
│   ├── src/
│   ├── tests/
│   └── wrangler.toml
├── tests/
│   └── e2e/
├── docs/
├── scripts/
├── newtab.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Une structure plus plate est acceptable pendant le bootstrap. Ne créer les sous-dossiers qu’au moment où les fonctionnalités correspondantes existent.

## Manifest recommandé

Conceptuellement :

```json
{
  "manifest_version": 3,
  "name": "ClairTab",
  "version": "0.1.0",
  "description": "A calm, personal starting point for every new tab.",
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  },
  "permissions": ["storage"],
  "host_permissions": [
    "https://<background-proxy-domain>/*"
  ]
}
```

Ne pas ajouter :

- `tabs`
- `history`
- `topSites`
- `bookmarks`
- `<all_urls>`
- `activeTab`
- content scripts

Le domaine proxy ne doit être ajouté qu’au moment de l’intégration réelle.

## Content Security Policy

Objectif :

```text
script-src 'self';
object-src 'self';
img-src .self. data: https://cdn.pixabay.com;
connect-src 'self' https://<background-proxy-domain>;
base-uri 'self';
form-action https://www.google.com;
```

La configuration exacte doit être validée dans Chrome pendant le bootstrap. Aucun `unsafe-eval`, script distant ou HTML inline exécutable.

## Modèle de données

Voir `docs/PRD.md`, section Données.

### Règles supplémentaires

- `schemaVersion` commence à `1`.
- Les entités utilisent `crypto.randomUUID()` si la version Chrome minimale le permet.
- Toutes les dates sont ISO 8601 UTC.
- Le stockage est écrit par lots cohérents.
- Une migration ne supprime jamais des données sans copie ou stratégie explicite.
- Les valeurs inconnues sont ignorées ou ramenées à un défaut sûr.

## Contrats d’intégration

### Client du proxy

```text
GET {proxyUrl}/api/background?theme=landscapes
Accept: application/json
```

Timeout client recommandé : 4 à 6 secondes.

Le client valide :

- statut HTTP ;
- type de contenu ;
- taille raisonnable ;
- champs obligatoires ;
- URLs HTTPS ;
- provider connu ;
- dimensions positives ;
- thème attendu.

### Proxy vers Pixabay

- clé dans un secret Worker ;
- requête de recherche ou topic avec orientation landscape ;
- `content_filter=high` si compatible avec l’endpoint retenu ;
- URLs hotlinkées retournées telles que prévues par le fournisseur ;
- liens d’attribution enrichis des paramètres requis ;
- aucun téléchargement ou réhébergement d’image ;
- cache par thème ;
- allowlist stricte des thèmes.

### Lummi

Aucune intégration automatisée dans le MVP sans documentation officielle d’API ou autorisation écrite. Un catalogue manuel de ressources licenciées peut être étudié séparément sans scraping.

## Gestion des erreurs

### Stockage

- lire dans un bloc protégé ;
- valider avant usage ;
- conserver le dernier état UI cohérent ;
- rollback lors d’un échec d’écriture ;
- message non bloquant ;
- log technique sans données.

### Validation

- erreurs inline près du champ ;
- focus sur le premier champ invalide ;
- aucun toast générique si une correction locale est possible.

### Réseau

- délai d’attente ;
- annulation si le thème change ;
- ignorer les réponses obsolètes ;
- fallback local ;
- conserver l’ancienne photo ;
- ne pas multiplier les retries automatiques.

### Image

- précharger avant de remplacer ;
- utiliser une couleur de fond issue des métadonnées ;
- en cas d’échec `onError`, revenir au fallback ;
- ne pas persister un fond non chargé avec succès.

## Sécurité

### Données sensibles

Les tâches et URLs sont considérées comme données utilisateur. Elles restent locales et ne sont pas incluses dans :

- logs Worker ;
- paramètres réseau ;
- erreurs distantes ;
- analytics ;
- rapports automatiques.

### Secrets

- jamais dans `VITE_*` ;
- jamais dans le manifeste ;
- jamais dans Git ;
- secret Worker uniquement ;
- rotation documentée ;
- scan du bundle avant release.

### URLs

Fonction de normalisation centralisée :

1. trim ;
2. ajouter `https://` si aucun schéma ;
3. parser avec `new URL()` ;
4. normaliser l’hôte ;
5. autoriser seulement les protocoles décidés ;
6. refuser credentials intégrés si non nécessaires ;
7. afficher la valeur finale avant sauvegarde.

### Réponses distantes

- ne jamais injecter avec `innerHTML` ;
- traiter alt et noms comme texte ;
- ne jamais exécuter de contenu distant ;
- ne pas accepter d’URL arbitraire provenant d’un message externe.

### Permissions

Chaque permission doit être justifiée dans le PRD et la fiche Web Store. Toute nouvelle permission exige une décision ou un work record.

## Performance

### Objectifs

- shell local rendu immédiatement ;
- aucune requête réseau bloquante ;
- background lazy-loaded ;
- un seul appel proxy au maximum lors d’un refresh normal ;
- cache client et edge ;
- pas de bibliothèque lourde pour une opération simple ;
- images demandées avec dimensions adaptées au viewport.

### Mesure

Pendant la validation runtime :

- enregistrer le temps jusqu’au shell visible ;
- vérifier que l’UI répond pendant la requête ;
- inspecter le nombre de requêtes ;
- tester réseau lent et hors ligne ;
- vérifier absence de layout shift majeur.

## Observabilité

### Client

Événements autorisés en mode debug :

```text
app_initialized
storage_read_succeeded
storage_read_failed
storage_write_succeeded
storage_write_failed
background_request_started
background_request_succeeded
background_request_failed
validation_rejected
navigation_requested
```

Les payloads contiennent seulement :

- identifiant de type ;
- durée ;
- statut ;
- compteur ;
- thème prédéfini ;
- code d’erreur interne.

Jamais de texte de tâche, requête ou URL.

### Worker

Logs minimaux :

- timestamp ;
- thème ;
- cache hit/miss ;
- code fournisseur ;
- durée ;
- code réponse.

Désactiver les corps et en-têtes sensibles.

## Environnements

### Local

- extension avec `MockBackgroundProvider` par défaut ;
- Worker local optionnel ;
- données de test isolées ;
- debug activable.

### Preview

- Worker preview avec clé de développement ;
- extension buildée avec URL preview ;
- quota limité ;
- tests manuels.

### Production

- Worker production ;
- secret production ;
- domaines et versions figés ;
- politique de confidentialité publique ;
- package Web Store reproductible.

## Déploiement

### Extension

1. exécuter typecheck, lint, tests et build ;
2. inspecter `dist/` ;
3. scanner les secrets ;
4. charger unpacked ;
5. exécuter les scénarios runtime ;
6. créer l’evidence record ;
7. zipper le contenu de `dist/` ;
8. soumettre au Chrome Web Store.

### Worker

1. tester le contrat localement ;
2. configurer le secret ;
3. déployer preview ;
4. valider cache et erreurs ;
5. déployer production ;
6. enregistrer version et URL dans `docs/STATE.md`.

## Rollback

### Extension

- conserver le dernier package Web Store validé ;
- taguer chaque release ;
- rétablir le commit précédent ;
- reconstruire et revalider ;
- publier une version corrective.

### Worker

- conserver la version précédente ;
- rollback Cloudflare ;
- si nécessaire, configurer l’extension pour utiliser seulement le fallback local dans une release corrective.

### Données

Toute migration doit disposer d’un `down` conceptuel ou d’une copie de l’ancien payload. Pour le MVP, éviter les migrations destructives.

## Références officielles

- https://developer.chrome.com/docs/extensions/develop/ui/override-chrome-pages
- https://developer.chrome.com/docs/extensions/reference/api/storage
- https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3
- https://developer.chrome.com/docs/extensions/develop/concepts/network-requests
- https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy
- https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines
- https://developer.chrome.com/docs/webstore/program-policies/privacy
- https://pixabay.com/api/docs/
- https://pixabay.com/service/guidelines/
- https://www.lummi.ai/license
- https://www.lummi.ai/terms


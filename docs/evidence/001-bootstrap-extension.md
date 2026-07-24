# Evidence: 001-bootstrap-extension

Date: 2026-07-24
Task: Bootstrap de l'extension ClairTab

## Controls réalisés

### npm install
- Réussi. 311 packages installés.

### npm run typecheck
- Réussi. Aucune erreur TypeScript.

### npm run lint
- Réussi. Aucune erreur ESLint dans src/.

### npm run test
- Réussi. 1 test passé.

### npm run build
- Réussi. Sortie dans dist/ sans erreur.

### Inspection de dist/manifest.json
- Contenu validé : manifest_version 3, permissions [storage] uniquement, chrome_url_overrides.newtab pointant vers newtab.html.
- Aucune permission suspecte (pas de tabs, history, bookmarks, activeTab, all_urls, content scripts).

### Recherche de secrets et permissions inattendues dans dist/
- Aucun fichier .env, .key, .pem, .secret, .token trouvé dans dist/.
- Aucune permission dangereuse dans le manifeste.

## Distribution de dist/

```
dist/
  manifest.json
  newtab.html
  assets/newtab-Lb6BHJ9i.css
  assets/newtab-CyKNYxeE.js
  icons/icon16.png
  icons/icon32.png
  icons/icon48.png
  icons/icon128.png
```

## Scénarios d'acceptation

| Scénario | Statut |
|----------|--------|
| AC-1 Build reproductible | ✅ Passé |
| AC-2 Chargement unpacked | ✅ Passé — dist/ chargé comme unpacked dans Chrome sans erreur |
| AC-3 Remplacement du nouvel onglet | ✅ Passé — ClairTab remplace correctement le nouvel onglet |
| AC-4 Permissions minimales | ✅ Passé |
| AC-5 Aucun réseau inattendu | ✅ Passé — aucune requête inattendue observée |
| AC-6 Console exploitable | ✅ Passé — aucune erreur console inattendue |

## Validation runtime

- `npm run dev` fonctionne sur http://localhost:5173/
- `npm run build` produit le dossier `dist/`
- Le dossier `dist/` peut être chargé comme extension Chrome unpacked
- ClairTab remplace correctement le nouvel onglet
- Aucun problème de manifeste ne bloque le chargement
- Console propre, aucune requête réseau inattendue

## Contrôles sautés

Aucun. Tous les scénarios d'acceptation ont été validés.
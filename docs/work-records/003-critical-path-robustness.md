---
task: 003-critical-path-robustness
status: ready
owner_agent: unassigned
created: 2026-07-24
last_updated: 2026-07-24
---

# Robustesse du parcours et intégration du fond distant

## Goal

Rendre la première tranche suffisamment robuste pour une démo publique : intégrer le proxy d’images, traiter les erreurs, renforcer accessibilité et responsive, et produire des preuves runtime complètes.

## In Scope

- `ProxyBackgroundProvider` ;
- Cloudflare Worker minimal ;
- secret serveur ;
- allowlist de thèmes ;
- cache ;
- contrat normalisé ;
- attribution Unsplash ;
- fallback et cache client ;
- timeout et annulation ;
- état de stockage en erreur ;
- rollback des actions locales ;
- dialogues accessibles ;
- responsive essentiel ;
- contraste et voile de fond ;
- `prefers-reduced-motion` ;
- instrumentation debug sans contenu utilisateur ;
- tests d’erreur ;
- validation réseau lent et hors ligne ;
- politique de confidentialité brouillon technique ou checklist de contenu ;
- revue des permissions et du bundle.

## Out Of Scope

- demande d’approbation production Unsplash si le compte n’est pas disponible ;
- publication Web Store ;
- analytics ;
- synchronisation ;
- nouveaux widgets ;
- fournisseur Lummi automatisé ;
- refonte visuelle complète ;
- internationalisation complète ;
- import/export.

## Readiness Verdict

**Verdict:** `CONCERNS`

### Findings

- Le contrat est défini.
- Le travail local de robustesse peut commencer.
- La clôture de l’intégration distante dépend de ressources externes.
- Les exigences du fournisseur et du Web Store doivent être vérifiées à la date de release.

### Blocking Items

Pour démarrer :

- tâche 002 `Verified`.

Pour clôturer l’intégration distante :

- clé Unsplash ;
- environnement Worker ;
- URL preview ;
- confirmation des conditions applicables.

### Concerns To Carry Forward

- Quota de développement.
- Logs du fournisseur de plateforme.
- Domaine proxy à déclarer dans le manifeste.
- CSP à tester avec l’image et le formulaire.
- Politique de confidentialité nécessaire avant publication.
- Cache à dimensionner sans réhéberger les images.

## Relevant Context

- `docs/PRD.md` sections 15, 16, 18, 21, 22
- `docs/ARCHITECTURE.md`
- `docs/QUALITY.md`
- décision 002
- `docs/acceptance/003-critical-path-robustness.md`
- evidence de la tâche 002

## Planned Work

1. Implémenter et tester le contrat proxy côté client.
2. Créer le Worker avec allowlist et validation.
3. Ajouter secret et configuration locale.
4. Intégrer Unsplash conformément aux règles.
5. Ajouter cache edge et client.
6. Implémenter attribution.
7. Simuler timeout, 429, 502 et image cassée.
8. Renforcer erreurs storage et rollback.
9. Auditer clavier, focus, contraste, zoom et responsive.
10. Ajouter diagnostics techniques.
11. Scanner permissions, CSP, bundle et logs.
12. Exécuter les scénarios end-to-end.
13. Créer l’evidence et mettre à jour l’état.

## Planned Checks

- [ ] typecheck extension et Worker
- [ ] lint
- [ ] tests unitaires
- [ ] tests composants
- [ ] tests Worker
- [ ] tests end-to-end
- [ ] build extension
- [ ] build Worker
- [ ] scan de secrets
- [ ] inspection du manifeste
- [ ] validation CSP
- [ ] test proxy cache hit/miss
- [ ] test 400, 429, 502, 503
- [ ] test réseau lent
- [ ] test hors ligne
- [ ] test image cassée
- [ ] test storage en erreur
- [ ] audit clavier
- [ ] zoom 200 %
- [ ] largeurs cibles
- [ ] contraste sur plusieurs images
- [ ] console et réseau
- [ ] vérification attribution
- [ ] vérification absence de contenu utilisateur dans logs

## Expected Evidence

- sorties de tests ;
- URL Worker preview ;
- réponse JSON expurgée ;
- preuve cache ;
- capture avec attribution ;
- capture fallback ;
- capture état d’erreur ;
- rapport clavier et responsive ;
- manifeste final ;
- résultat du scan secret ;
- evidence record `docs/evidence/003-critical-path-robustness.md`.

## Rollback Strategy

Désactiver le provider distant et revenir au provider local. Rollback du Worker vers la version précédente. Aucun changement destructif du stockage ne doit être inclus dans cette tâche.

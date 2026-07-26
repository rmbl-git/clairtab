---
task: 004-custom-background
status: implemented -- unverified
owner_agent: unassigned
created: 2026-07-25
last_updated: 2026-07-25
---

# Fond d'écran personnalisé

## Goal

Permettre à l'utilisateur de choisir une image personnelle comme fond d'écran depuis les paramètres de ClairTab, avec traitement local, optimisation et persistance.

## In Scope

- Sélection de fichier image depuis les paramètres ;
- Validation de type (JPG, JPEG, PNG, WebP) ;
- Validation de taille (max 8 Mo) ;
- Redimensionnement automatique (max 2560 × 1440 px, conservation des proportions) ;
- Conversion WebP à ~82 % de qualité ;
- Stockage dans `chrome.storage.local` sous la clé `customBackground` ;
- Application immédiate du fond sans validation supplémentaire ;
- Restauration du fond par défaut ;
- Masquage de l'attribution distante quand un fond personnalisé est actif ;
- Tests unitaires ;
- Build et validation lint/typecheck.

## Out Of Scope

- Aperçu de la photo dans les paramètres ;
- Drag-and-drop ;
- Gestion de plusieurs fonds personnalisés ;
- Suppression automatique après X jours ;
- Compression adaptive selon le contenu.

## Readiness Verdict

**Verdict:** `Implemented — Unverified`

### Findings

- Architecture local-first respectée.
- Aucune dépendance externe ajoutée.
- Tous les contrôles automatisés passent.
- Validation runtime Chrome nécessaire.

### Blocking Items

Aucun blocage technique.

### Concerns To Carry Forward

- Quota de stockage Chrome (~5 Mo) : une seule image WebP compressée reste raisonnable.
- Performance de décompression sur machines anciennes : à vérifier.

## Relevant Context

- `docs/PRD.md` sections 14, 21, 22
- `docs/UI-DIRECTION.md`
- `docs/ARCHITECTURE.md`
- `docs/work-records/003-critical-path-robustness.md`
- décision 001

## Planned Work

- [x] Analyser la structure existante (settings, fond, stockage).
- [x] Créer le helper de traitement d'image et stockage.
- [x] Ajouter la section UI dans SettingsPanel.
- [x] Modifier App.tsx pour lire/appliquer le fond personnalisé.
- [x] Ajouter les styles CSS.
- [x] Écrire les tests unitaires.
- [x] Exécuter lint, typecheck, build et tests.
- [ ] Valider dans Chrome (JPG, PNG, WebP, taille dépassée, fichier non supporté, restauration, redémarrage).

## Planned Checks

- [x] typecheck extension
- [x] lint
- [x] tests unitaires
- [x] build extension
- [ ] validation runtime Chrome pour chaque scénario
- [ ] vérification quota storage
- [ ] vérification réouverture onglet
- [ ] vérification redémarrage Chrome

## Expected Evidence

- sorties de tests ;
- build `dist/` valide ;
- capture paramètre fond personnalisé ;
- capture erreur taille dépassée ;
- capture fond appliqué ;
- capture restauration fond par défaut ;
- evidence record `docs/evidence/004-custom-background.md`.

## Rollback Strategy

Supprimer `src/features/background/custom-background.ts`, retirer la section UI de `SettingsPanel.tsx` et les modifications d'`App.tsx`. Aucune donnée utilisateur n'est détruite : la clé `customBackground` peut être supprimée manuellement dans `chrome.storage.local` si nécessaire.

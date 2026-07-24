---
decision: image-provider-proxy
status: accepted-with-concerns
created: 2026-07-24
decided_by: product-architecture-security-review
replaces: aucune
---

# Utiliser Unsplash derrière un proxy léger

## Context

Le produit demande des photos aléatoires par thème. Unsplash propose une API officielle avec règles d’attribution, hotlinking et confidentialité des clés. Lummi autorise largement l’usage des images mais aucune API publique officielle n’a été validée pour une intégration automatisée ; ses conditions interdisent notamment les accès automatisés non autorisés.

## Decision

- Utiliser un `MockBackgroundProvider` pendant les deux premières tâches.
- Préparer un `ProxyBackgroundProvider`.
- Déployer un Cloudflare Worker protégeant la clé Unsplash.
- Utiliser une allowlist de thèmes et un cache.
- Retourner des métadonnées normalisées et les URLs hotlinkées.
- Afficher une attribution conforme.
- Conserver un fallback local.
- Ne pas scraper Lummi.

## Why

- La clé ne peut pas rester confidentielle dans un bundle d’extension.
- Le proxy permet cache, limitation et contrat stable.
- Le fallback préserve la valeur du produit.
- L’abstraction permet de changer de fournisseur.

## Alternatives Considered

- Clé Unsplash dans le client
  - Rejetée parce que : exposition immédiate.
- Appel direct avec une clé fournie par chaque utilisateur
  - Rejetée parce que : onboarding et expérience inacceptables.
- Scraping de Lummi
  - Rejetée parce que : absence de contrat d’API validé et conditions défavorables.
- Images embarquées uniquement
  - Reportée parce que : ne satisfait pas entièrement le renouvellement en ligne, mais reste le fallback.
- Backend complet
  - Rejeté parce que : disproportionné.

## Impact

- Travail existant : aucun.
- Travail futur : Worker, secret, contrat, cache, attribution, tests d’erreur.
- Vérifications nécessaires : quota, hotlinking, attribution, absence de secret, logs.
- Risques introduits : dépendance fournisseur et disponibilité du proxy.

## Review Trigger

Réexaminer si Unsplash refuse l’usage, modifie ses conditions, ne fournit pas un quota adapté ou si un fournisseur officiel plus simple devient disponible.

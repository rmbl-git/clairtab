---
decision: search-without-provider-override
status: accepted
created: 2026-07-24
decided_by: product-policy-review
replaces: aucune
---

# Soumettre la recherche sans modifier les réglages Chrome

## Context

Une page de nouvel onglet peut proposer un champ de recherche, mais une extension ne doit pas détourner l’expérience ou modifier des réglages de manière inattendue. Le projet doit rester compatible avec son objectif unique et transparent.

## Decision

- Afficher un formulaire Recherche explicite.
- Envoyer la requête à Google uniquement après validation par l’utilisateur.
- Ne pas déclarer `chrome_settings_overrides`.
- Ne pas modifier le moteur configuré dans Chrome.
- Ne pas intercepter l’omnibox.
- Ne pas stocker la requête.
- Décrire clairement Google comme destination.

## Why

- Comportement prévisible.
- Aucune permission supplémentaire.
- Réduction du risque de rejet Web Store.
- Respect du contrôle utilisateur.

## Alternatives Considered

- Remplacer le moteur de recherche Chrome
  - Rejetée parce que : inutile et risqué pour le périmètre.
- Intercepter l’omnibox
  - Rejetée parce que : modifie une autre surface du navigateur.
- Moteur configurable dans le MVP
  - Reporté parce que : élargit réglages, tests et contenu.

## Impact

- Travail existant : aucun.
- Travail futur : fonction pure de construction d’URL et test de navigation.
- Vérifications nécessaires : requête vide, encodage, destination visible, absence de stockage.
- Risques introduits : dépendance fonctionnelle à Google, à documenter.

## Review Trigger

Réexaminer après retours utilisateurs demandant un moteur alternatif, sans modifier les réglages globaux du navigateur.

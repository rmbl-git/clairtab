---
decision: manifest-v3-local-first
status: accepted
created: 2026-07-24
decided_by: product-and-architecture-review
replaces: aucune
---

# Utiliser Manifest V3 avec un état local-first

## Context

Le produit doit remplacer le nouvel onglet, persister des données personnelles simples et rester rapide. Une base distante et une authentification augmenteraient fortement la complexité et les risques sans être nécessaires à la proposition de valeur.

## Decision

- Utiliser Chrome Extension Manifest V3.
- Remplacer `newtab` par une page locale.
- Stocker tâches, raccourcis, préférences et cache dans `chrome.storage.local`.
- Ne pas utiliser Supabase, compte utilisateur ou synchronisation serveur dans le MVP.
- Ne pas ajouter de content script.
- Ne pas ajouter de service worker d’extension sans besoin démontré.

## Why

- Fonctionnement hors ligne.
- Permissions limitées.
- Moins de données transmises.
- Architecture simple.
- Build et validation faciles à reproduire.
- Cohérence avec l’objectif d’une micro-application.

## Alternatives Considered

- `localStorage`
  - Rejetée parce que : l’API Chrome Storage est conçue pour les extensions et permet une meilleure évolution.
- IndexedDB
  - Rejetée parce que : le volume et les requêtes ne le justifient pas.
- Supabase
  - Rejetée parce que : compte, réseau, modèle d’autorisation et maintenance inutiles.
- `chrome.storage.sync`
  - Reportée parce que : quotas plus faibles et implication de synchronisation non nécessaire au MVP.

## Impact

- Travail existant : aucun.
- Travail futur : créer un repository de stockage et des migrations.
- Vérifications nécessaires : persistance, corruption, désinstallation, quota.
- Risques introduits : perte des données à la désinstallation ; pas de multi-appareils.

## Review Trigger

Réexaminer si des tests utilisateurs démontrent qu’une synchronisation multi-appareils est indispensable.

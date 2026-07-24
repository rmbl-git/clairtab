# Product Requirements Document — ClairTab

## 1. Résumé

ClairTab remplace la page Nouvel onglet de Chrome par un espace personnel sobre. Il aide l’utilisateur à commencer sa prochaine action au moyen d’un mode Focus, d’un mode Recherche, de raccourcis choisis manuellement et d’un fond thématique.

## 2. Contexte

Le projet appartient à un laboratoire de micro-applications démontrant une capacité à cadrer, construire, vérifier et transmettre un produit fonctionnel. Le résultat doit être présentable dans un portfolio et suffisamment robuste pour envisager une publication sur le Chrome Web Store.

## 3. Problème

Lorsqu’une personne ouvre un nouvel onglet, elle connaît souvent son intention mais doit encore choisir où agir. La page standard peut être neutre, tandis que certains remplacements deviennent des dashboards complexes, demandent un compte ou affectent la recherche de manière inattendue.

## 4. Utilisateurs

### Utilisateur principal

Travailleur du savoir, étudiant, designer ou développeur utilisant Chrome sur ordinateur et ouvrant de nombreux onglets pendant sa journée.

### Utilisateur secondaire

Visiteur évaluant le produit dans un contexte de portfolio, souhaitant comprendre rapidement la proposition, la qualité de finition et les choix de confidentialité.

### Non-utilisateurs ciblés

- équipes ayant besoin d’un gestionnaire de tâches collaboratif ;
- utilisateurs demandant une synchronisation complète ;
- organisations nécessitant une administration centralisée ;
- personnes recherchant un portail d’actualités ou de widgets.

## 5. Job to be Done

**Lorsque j’ouvre un nouvel onglet pour commencer quelque chose, je veux voir une action claire et mes destinations utiles afin de poursuivre sans friction ni distraction.**

## 6. Proposition de valeur

Un nouvel onglet personnel et calme, utile avant même que le réseau réponde, sans compte et avec des permissions minimales.

## 7. Objectifs

### Objectifs produit

- Rendre l’action principale compréhensible en moins de quelques secondes.
- Permettre un parcours complet sans compte.
- Conserver les données après redémarrage du navigateur.
- Rester utile lorsque le fournisseur d’images échoue.
- Respecter les réglages de recherche de l’utilisateur.
- Démontrer une approche local-first et privacy-conscious.

### Objectifs de livraison

- Produire une extension Manifest V3 chargeable en mode unpacked.
- Maintenir un build reproductible.
- Valider les parcours dans Chromium.
- Conserver les décisions, preuves et risques dans le repository.

## 8. Non-objectifs

- Remplacer un outil de gestion de tâches.
- Synchroniser les tâches sur un serveur.
- Collecter l’historique de navigation.
- Déduire automatiquement les sites favoris.
- Modifier le fournisseur de recherche Chrome.
- Afficher plusieurs widgets informatifs.
- Monétiser par publicité.
- Supporter tous les navigateurs dès le MVP.
- Construire une plateforme de fournisseurs d’images.

## 9. Hypothèses

- Chrome desktop est la plateforme initiale.
- L’utilisateur accepte qu’une extension remplace son nouvel onglet.
- Une to-do simple apporte suffisamment de valeur pour un premier test.
- Les raccourcis manuels sont préférables à une permission d’historique.
- Les utilisateurs comprennent un sélecteur Focus / Recherche.
- Un fond visuel contribue à l’attachement au produit sans devoir être interactif.
- Quatre thèmes prédéfinis suffisent.
- Le fournisseur d’images peut être indisponible sans rendre l’extension inutilisable.
- Les données peuvent rester locales.
- La publication publique nécessitera une politique de confidentialité.

## 10. Indicateurs de réussite

### Indicateurs MVP vérifiables

- 100 % des scénarios critiques passent dans le navigateur cible.
- Aucune permission non justifiée dans le manifeste.
- Aucun secret dans le bundle.
- Le shell et les données locales restent disponibles hors ligne.
- Les tâches persistent après fermeture et réouverture.
- Les raccourcis dangereux sont refusés.
- Une erreur du fournisseur d’images produit un fallback visible sans bloquer l’UI.
- Aucun log de production ne contient de contenu utilisateur.

### Indicateurs d’expérimentation

À observer pendant 5 à 8 sessions qualitatives :

- l’utilisateur identifie l’action principale sans explication ;
- l’utilisateur comprend la bascule Focus / Recherche ;
- l’utilisateur réussit à créer un raccourci ;
- l’utilisateur comprend où modifier le thème ;
- l’utilisateur juge le produit plus calme qu’un dashboard classique ;
- l’utilisateur accepte ou non le mode Focus par défaut.

Aucune télémétrie n’est requise pour le MVP.

## 11. Périmètre du MVP

### Inclus

- page Nouvel onglet Manifest V3 ;
- mode Focus ;
- mode Recherche Google ;
- sélecteur de mode ;
- tâches locales ;
- raccourcis locaux ;
- thèmes prédéfinis ;
- fond distant via proxy ;
- attribution ;
- fallback local ;
- réglages minimaux ;
- accessibilité essentielle ;
- responsive ;
- gestion des erreurs ;
- instrumentation de diagnostic sans données utilisateur.

### Reporté

- synchronisation ;
- import/export ;
- raccourcis clavier configurables ;
- plusieurs moteurs ;
- photo personnelle ;
- thèmes personnalisés ;
- drag-and-drop ;
- onboarding multi-écrans ;
- localisation multilingue complète.

## 12. Parcours principal

### Étape 1 — Ouvrir un nouvel onglet

- **Intention :** commencer une action.
- **Action :** ouvrir un nouvel onglet Chrome.
- **Réponse du produit :** afficher le shell local avec les modules visibles selon les réglages, les données persistées et le fond local.
- **État visible :** fond local par thème, module principal (Recherche ou To-do ou les deux avec onglets), raccourcis.
- **Donnée affectée :** aucune.
- **Erreur possible :** stockage illisible.
- **Récupération :** valeurs par défaut et message non bloquant ; conserver une trace technique sans contenu utilisateur.

### Étape 2 — Agir en mode Focus

- **Intention :** capturer une tâche courte.
- **Action :** saisir un titre et valider.
- **Réponse du produit :** ajouter la tâche à la liste.
- **État visible :** nouvelle ligne, confirmation visuelle, champ vidé.
- **Donnée affectée :** collection `tasks`.
- **Erreur possible :** champ vide, limite atteinte, échec de stockage.
- **Récupération :** validation inline ou restauration de l’état précédent.

### Étape 3 — Terminer une tâche

- **Intention :** marquer une action comme faite.
- **Action :** activer la case de la tâche.
- **Réponse du produit :** marquer la tâche terminée et persister.
- **État visible :** style terminé, possibilité de restaurer ou supprimer.
- **Donnée affectée :** `completed`, `completedAt`.
- **Erreur possible :** échec de stockage.
- **Récupération :** rollback de l’état UI et message.

### Étape 4 — Rechercher

- **Intention :** lancer une recherche Web.
- **Action :** passer en mode Recherche, saisir une requête, valider.
- **Réponse du produit :** naviguer vers la page de résultats Google.
- **État visible :** navigation.
- **Donnée affectée :** préférence de mode uniquement ; la requête n’est pas stockée.
- **Erreur possible :** requête vide.
- **Récupération :** validation inline, aucune navigation.

### Étape 5 — Ouvrir un raccourci

- **Intention :** rejoindre un site fréquent.
- **Action :** activer une tuile.
- **Réponse du produit :** naviguer vers l’URL validée.
- **État visible :** navigation.
- **Donnée affectée :** aucune.
- **Erreur possible :** URL devenue invalide.
- **Récupération :** bloquer la navigation et proposer l’édition.

### Étape 6 — Charger un nouveau fond

- **Intention :** profiter d’une ambiance thématique.
- **Action :** ouverture du nouvel onglet ou action « Changer ».
- **Réponse du produit :** afficher d’abord le dernier fond valide, puis demander une nouvelle photo si le cache est expiré.
- **État visible :** transition non bloquante, crédit mis à jour.
- **Donnée affectée :** `backgroundCache`.
- **Erreur possible :** timeout, quota, réponse invalide, image cassée.
- **Récupération :** conserver l’image précédente ou afficher le fallback local.

## 13. Parcours secondaires nécessaires

### Première ouverture

- Afficher des données d’exemple minimales ou un état vide guidé.
- Expliquer en une phrase que les données restent sur l’appareil.
- Permettre de choisir le mode préféré.
- Ne pas bloquer l’usage par un onboarding obligatoire.

### Ajouter un raccourci

- Ouvrir une boîte de dialogue.
- Demander un nom et une URL.
- Préfixer `https://` lorsque l’utilisateur saisit un domaine sans schéma.
- Refuser les schémas dangereux.
- Afficher l’élément immédiatement après persistance.

### Modifier les préférences

- Ouvrir un panneau de réglages.
- Choisir mode et thème.
- Sauvegarder immédiatement ou explicitement, mais rester cohérent.
- Fermer sans perte de contexte.

### Réinitialiser les données

- Action disponible dans les réglages.
- Confirmation explicite.
- Réinitialiser tâches, raccourcis, préférences et cache.
- Ne pas être facilement déclenchable par erreur.

## 14. Exigences fonctionnelles

### Navigation et shell

- **FR-001** L’extension doit remplacer la page Chrome `newtab`.
- **FR-002** Le shell local doit s’afficher sans dépendre du réseau.
- **FR-003** Le titre du document doit identifier clairement ClairTab.
- **FR-004** L’interface ne doit pas supposer que son champ reçoit automatiquement le focus.

### Modes

- **FR-010** L’utilisateur doit pouvoir choisir entre Focus et Recherche.
- **FR-011** Un seul module principal doit être visible à la fois.
- **FR-012** Le mode choisi doit être persisté.
- **FR-013** Le changement de mode doit être accessible au clavier.

### Tâches

- **FR-020** L’utilisateur doit pouvoir ajouter une tâche de 1 à 160 caractères.
- **FR-021** Les espaces de début et de fin doivent être supprimés.
- **FR-022** Une tâche vide doit être refusée.
- **FR-023** L’utilisateur doit pouvoir terminer et restaurer une tâche.
- **FR-024** L’utilisateur doit pouvoir supprimer une tâche.
- **FR-025** L’utilisateur doit pouvoir supprimer toutes les tâches terminées après confirmation.
- **FR-026** Le produit doit supporter au moins 100 tâches locales.
- **FR-027** L’ordre par défaut doit être le plus récent en premier pour les tâches actives.
- **FR-028** Les tâches terminées doivent être visuellement distinctes sans dépendre uniquement de la couleur.

### Recherche

- **FR-030** La recherche doit être déclenchée uniquement par une action explicite.
- **FR-031** Une requête vide doit être refusée.
- **FR-032** La requête doit être envoyée à Google avec encodage correct.
- **FR-033** La requête ne doit pas être stockée.
- **FR-034** L’extension ne doit pas modifier le moteur de recherche configuré dans Chrome.

### Raccourcis

- **FR-040** L’utilisateur doit pouvoir créer, modifier et supprimer un raccourci.
- **FR-041** Un raccourci doit avoir un libellé de 1 à 32 caractères.
- **FR-042** Les schémas autorisés sont `https:` et `http:` ; `http:` doit être réservé aux usages explicitement confirmés ou locaux.
- **FR-043** Les schémas `javascript:`, `data:`, `file:`, `chrome:` et équivalents doivent être refusés.
- **FR-044** Le MVP doit limiter la collection à 12 raccourcis.
- **FR-045** L’icône doit être générée localement à partir du libellé ou d’un asset embarqué.
- **FR-046** L’URL complète doit être visible dans le formulaire d’édition.
- **FR-047** Une URL invalide doit produire une erreur inline.

### Fonds

- **FR-050** L’utilisateur doit pouvoir choisir un thème dans une liste fermée.
- **FR-051** Le thème `landscapes` doit être la valeur initiale.
- **FR-052** Le chargement distant ne doit pas bloquer les tâches, la recherche ou les raccourcis.
- **FR-053** La dernière photo valide doit être conservée en cache.
- **FR-054** Un fallback local doit exister pour chaque thème ou pour l’application entière.
- **FR-055** Une photo Unsplash doit afficher le photographe et un lien d’attribution conforme.
- **FR-056** Les URLs d’image doivent provenir de la réponse normalisée du proxy.
- **FR-057** Une réponse distante invalide doit être rejetée.
- **FR-058** Une action manuelle « Changer le fond » doit être limitée pour éviter les appels abusifs.

### Réglages et données

- **FR-060** Les données doivent être stockées dans `chrome.storage.local`.
- **FR-061** Le schéma local doit inclure une version.
- **FR-062** Les lectures invalides doivent revenir à des valeurs sûres.
- **FR-063** Une migration doit être idempotente.
- **FR-064** L’utilisateur doit pouvoir réinitialiser ses données.
- **FR-065** La suppression de l’extension peut supprimer les données locales ; cette limite doit être documentée.

### Confidentialité

- **FR-070** Aucun contenu de tâche ne doit être envoyé au proxy.
- **FR-071** Aucune requête de recherche ne doit être envoyée ailleurs que vers Google après validation.
- **FR-072** Aucune URL de raccourci ne doit être transmise à un service tiers.
- **FR-073** Aucune analytique ne doit être active dans le MVP.
- **FR-074** Une politique de confidentialité doit être disponible avant publication.

## 15. États de l’interface

- première ouverture ;
- mode Focus vide ;
- mode Focus avec tâches actives ;
- tâches terminées ;
- mode Recherche vide ;
- raccourcis vides ;
- raccourcis au maximum ;
- panneau de création ;
- panneau d’édition ;
- chargement du fond ;
- fond distant chargé ;
- fallback local ;
- erreur de stockage ;
- erreur de validation ;
- erreur réseau ;
- confirmation de suppression ;
- mode réduit en largeur ;
- préférence de réduction de mouvement.

## 16. Cas limites

- espaces uniquement dans une tâche ;
- caractères Unicode et emoji ;
- doublons de tâches ;
- tâche de 160 caractères ;
- dépassement de limite ;
- URL sans protocole ;
- URL avec sous-domaine, port ou chemin ;
- URL IDN ;
- URL malformée ;
- schéma dangereux encodé ;
- suppression du raccourci actuellement focus ;
- stockage indisponible ou quota atteint ;
- cache de fond expiré hors ligne ;
- métadonnées d’image présentes mais image inaccessible ;
- changement rapide de thème ;
- ouverture de plusieurs nouveaux onglets simultanés ;
- proxy lent ;
- réponse API partielle ;
- contraste insuffisant du fond ;
- zoom navigateur à 200 % ;
- navigation entièrement au clavier.

## 17. Données

### `AppState`

```text
schemaVersion: number
preferences: Preferences
tasks: Task[]
shortcuts: Shortcut[]
backgroundCache: BackgroundCache | null
onboardingCompleted: boolean
```

### `Preferences`

```text
primaryMode: "focus" | "search"
theme: "landscapes" | "architecture" | "minimal" | "nature"
reduceMotion: boolean | "system"
showSearchModule: boolean
showFocusModule: boolean
```

### `Task`

```text
id: string
title: string
completed: boolean
createdAt: ISO datetime
completedAt: ISO datetime | null
```

### `Shortcut`

```text
id: string
label: string
url: normalized URL
createdAt: ISO datetime
updatedAt: ISO datetime
```

### `BackgroundCache`

```text
theme: ThemeId
photoId: string
imageUrl: HTTPS URL
width: number
height: number
color: CSS color
alt: string
photographerName: string
photographerUrl: HTTPS URL
providerName: "Unsplash"
providerUrl: HTTPS URL
fetchedAt: ISO datetime
expiresAt: ISO datetime
```

## 18. Intégrations

### Chrome

- `chrome_url_overrides.newtab`
- permission `storage`
- `chrome.storage.local`

Aucun besoin MVP pour :

- `tabs`
- `history`
- `topSites`
- `bookmarks`
- `activeTab`
- content scripts

### Google Search

Navigation GET standard vers la page de résultats. Aucun accès API, aucune clé et aucune modification de réglage.

### Proxy d’images

Entrée :

```text
GET /api/background?theme=<ThemeId>
```

Sortie normalisée :

```json
{
  "photoId": "string",
  "imageUrl": "https://images.unsplash.com/...",
  "width": 2400,
  "height": 1600,
  "color": "#6b7280",
  "alt": "Mountain landscape at dusk",
  "photographerName": "Name",
  "photographerUrl": "https://unsplash.com/@name?...",
  "providerName": "Unsplash",
  "providerUrl": "https://unsplash.com/?..."
}
```

Erreurs :

- `400` thème invalide ;
- `429` limite atteinte ;
- `502` fournisseur indisponible ;
- `503` proxy non configuré.

## 19. Orientations UX

- Une action principale évidente.
- Les réglages restent secondaires.
- La photo ne retarde jamais l’interaction.
- Les confirmations irréversibles sont explicites.
- Les actions fréquentes sont accessibles sans menu.
- Les actions destructives ne sont pas mises en avant.
- Les erreurs indiquent une récupération possible.
- Les données locales sont expliquées simplement.
- Le crédit photo est accessible mais discret.
- Le produit fonctionne au clavier et au zoom.

## 20. Orientations visuelles

La référence détaillée se trouve dans `docs/UI-DIRECTION.md` et `docs/assets/visual-reference-new-tab.png`.

- Photo plein écran, immersive, avec traitement de contraste adaptatif.
- Composition centrale compacte autour de la moitié supérieure du viewport.
- Citation ou phrase d'intention courte au-dessus du module principal ; élément optionnel et alimenté localement.
- Un seul module principal visible : Recherche ou Focus.
- Modes Recherche et Focus utilisant la même empreinte visuelle.
- Surface sombre translucide, blur progressif avec fallback opaque, bordure légère et rayon généreux.
- Raccourcis en ligne compacte sous le module, avec icônes ou monogrammes locaux.
- Réglages discrets dans l'angle supérieur droit.
- Attribution photo visible dans une petite surface en bas.
- Sans serif pour l'interface ; serif éditoriale pour la phrase d'ambiance.
- Peu de niveaux de surface et aucune grande carte opaque.
- Animations courtes, sans parallaxe ni mouvement continu.
- Le rendu doit rester lisible sur photos claires, sombres, colorées et monochromes.
- Le glassmorphism n'est utilisé que si le contraste reste conforme.
- La direction est cinématographique et calme, pas celle d'un dashboard multi-widget.
## 21. Exigences non fonctionnelles

### Performance

- Le shell local doit être interactif indépendamment du réseau.
- Le chargement du fond est différé.
- Aucune requête API par interaction non nécessaire.
- Le cache doit limiter les appels fournisseur.
- Les assets applicatifs doivent rester compacts.
- Le changement de nouvel onglet ne doit pas provoquer de flash blanc prolongé.

### Accessibilité

- Objectif WCAG 2.2 AA pour les parcours critiques.
- Navigation clavier complète.
- Focus visible.
- Labels accessibles.
- États non transmis uniquement par couleur.
- Support du zoom 200 %.
- Respect de `prefers-reduced-motion`.
- Contraste vérifié avec plusieurs fonds.

### Sécurité

- Aucun code distant.
- Aucun `eval`.
- CSP restrictive.
- Validation des réponses réseau.
- Validation des URLs utilisateur.
- Secrets uniquement côté Worker.
- HTTPS uniquement pour le proxy et les images distantes.
- Permissions minimales.
- Pas de données utilisateur dans les logs.

### Fiabilité

- Fallback local. Les quatre thèmes utilisent des fichiers SVG embarqués localement comme fallback de la V1. Ils ne sont pas les images principales finales — la tâche 003 ajoutera les photographies distantes. Si le fournisseur distant échoue, le fallback SVG ou gradient réapparaît.
- Écriture de stockage encapsulée avec rollback.
- Migrations versionnées.
- Tests déterministes.
- Erreurs réseau simulables.

### Compatibilité

- Version minimale de Chrome à définir pendant le bootstrap selon les APIs effectivement utilisées.
- Desktop en priorité.
- Fenêtres étroites supportées à partir de 320 CSS px.

## 22. Risques

| Risque | Impact | Probabilité | Réponse |
|---|---:|---:|---|
| Rejet Chrome Web Store lié à la recherche | Élevé | Moyen | Ne pas modifier les réglages, décrire clairement le comportement, tester la fiche |
| Clé API exposée | Élevé | Moyen | Proxy serveur, scan du bundle |
| API indisponible | Moyen | Élevé | Cache et fallback local |
| Quota dépassé | Moyen | Moyen | Cache edge, limite client, pool de résultats |
| Fonds illisibles | Moyen | Moyen | Voile adaptatif, tests de contraste |
| Données perdues à la désinstallation | Moyen | Certain | Documentation et export futur |
| Scope creep | Élevé | Élevé | Non-objectifs explicites, work records |
| Stockage corrompu | Moyen | Faible | Schéma, validation, migration, fallback |
| URL malveillante | Élevé | Faible | Allowlist de protocoles |
| Conditions fournisseur modifiées | Élevé | Moyen | Revue avant release, abstraction de provider |

## 23. Questions ouvertes

- Le mode Focus est-il confirmé comme mode initial ?
- Le nom `ClairTab` est-il disponible et souhaité ?
- La publication Web Store fait-elle partie du jalon MVP ou du jalon suivant ?
- Les quatre thèmes proposés sont-ils suffisants ?
- Le produit doit-il autoriser les URLs `http:` hors localhost ?
- Une politique de confidentialité publique est-elle déjà hébergée ?
- Le compte Unsplash et l’accès production sont-ils disponibles ?

## 24. Évolutions possibles

- export/import JSON ;
- synchronisation opt-in ;
- moteur configurable ;
- images personnelles ;
- mode fond uni ;
- objectifs du jour ;
- historique local des tâches terminées ;
- version Firefox ;
- thèmes additionnels ;
- raccourcis clavier ;
- widgets additionnels seulement s’ils restent compatibles avec l’objectif unique.

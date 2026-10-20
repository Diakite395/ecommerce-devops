# ecommerce-devops

Application e-commerce minimaliste (React, Node.js/Express, PostgreSQL) servant de support à un pipeline CI/CD complet : tests, analyse SonarCloud, build Docker, push Docker Hub et déploiement automatisé sur un serveur de staging.

## Structure

```
backend/     API Node.js + Express
frontend/    Interface React (Vite)
db/          Script d'initialisation PostgreSQL
.github/     Workflows CI/CD, CODEOWNERS, modèle de Pull Request
```

## Stratégie Git : GitFlow simplifié

| Branche | Rôle |
|---|---|
| `main` | Code stable, versions livrées (tags `vX.Y.Z`) |
| `develop` | Intégration, déployée automatiquement sur staging |
| `feature/*` | Une fonctionnalité ou modification, fusionnée dans `develop` par Pull Request |

Les branches `release/*` et `hotfix/*` du GitFlow complet ne sont pas utilisées : pour une petite équipe sans production critique, elles ajoutent de la complexité sans bénéfice.

`main` et `develop` sont protégées : Pull Request obligatoire, revue par un pair et checks CI au vert avant toute fusion.

## Lancer le projet en local

Les instructions détaillées seront complétées avec Docker Compose.

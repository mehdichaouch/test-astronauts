# Test Technique - Gestion d'Astronautes

Bienvenue dans ce projet technique conçu pour un entretien pair-reviewing. Ce projet a pour but de créer une API REST ou GraphQL et une application front-end permettant de gérer des astronautes.

## Fonctionnalités

### API
L'API doit permettre :
- Récupérer la liste des astronautes ;
- Ajouter un astronaute ;
- Modifier ou supprimer un astronaute.

### Application Front-End
L'application front-end doit :
- Afficher la liste des astronautes ;
- Permettre d'effectuer les **actions** (ajout, modification, suppression,...) sur les astronautes.

## Technologies Requises
- **Back-End** : Node.js avec Express ou GraphQL.
- **Front-End** : React.
⚠️ L'utilisation de frameworks “magiques” comme NestJS est proscrite, car cela enlèverait l'intérêt de l'exercice.

## Installation et Lancement

### Pré-requis
- Node.js installé sur votre machine ;
- Docker ou Podman.

### Étapes

### 1. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=test-astronauts
DATABASE_URL=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
```

### 2. Démarrer les services

Avec docker

```bash
docker compose up -d
```
Avec Podman

```bash
podman compose up -d
```

L'application sera accessible à l'URL http://localhost:3000

### 3. Arrêter les services

Avec docker

```bash
docker compose down
```
Avec Podman

```bash
podman compose down

```
## Commandes disponibles

| Commande               | Description                                                                                     |
| ---------------------  | ----------------------------------------------------------------------------------------------- |
| `npm run lint`         | Exécute l'analyse statique du code                                                              |
| `npm run lint:fix`     | Exécute l'analyse du code et tente de corriger automatiquement les problèmes de style détectés  |
| `npm run test`         | Lance la suite de tests                                                                         |
| `npm run test:ui`      | Lance la suite de tests avec l'interface utilisateur de Vitest                                  |

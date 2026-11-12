# SEG3502 — Laboratoire 8 — Solution

Ce dossier contient les deux parties nécessaires au laboratoire 8 :

- `client/` : application Angular Employee déjà configurée pour communiquer avec GraphQL;
- `server/` : application Spring Boot/Kotlin + MongoDB complété.

Le schéma et les résolveurs implémentent employees et newEmployee pour le client fourni.

## 1. Démarrer MongoDB

Le serveur utilise MongoDB sur le port `27017`.

Exemple avec Docker :

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

## 2. Démarrer le serveur GraphQL

Le projet serveur utilise Java 21.

```bash
cd server
chmod +x gradlew
./gradlew bootRun
```

Sous Windows :

```text
gradlew.bat bootRun
```

Le serveur démarre sur le port `9000`.

GraphiQL :

```text
http://localhost:9000/graphiql
```

Point de terminaison GraphQL :

```text
http://localhost:9000/graphql
```

## 3. Démarrer le client Angular

Dans un deuxième terminal :

```bash
cd client
npm install
npm start
```

Puis ouvrez :

```text
http://localhost:4200
```

## Vérification

Ajoutez un employé dans le formulaire Angular, vérifiez la liste, puis rechargez
la page pour confirmer que les données sont conservées dans MongoDB.

Dans GraphiQL, exécutez :

```graphql
query {
  employees { id name dateOfBirth city salary gender email }
}
```

Si le conteneur existe déjà : `docker start mongodb`.

La compilation et les tests Gradle n'ont pas pu être exécutés dans
l'environnement de préparation : le téléchargement de Gradle était bloqué.
Pour lancer les tests localement : `cd server` puis `./gradlew test`.

# Projet Jeu TRON

## 1. Présentation du projet

Ce projet est un jeu multijoueur inspiré de Tron, jouable à la fois dans le navigateur et sur mobile grâce à Cordova. L’application présente une architecture client–serveur et une communication via Websockets. Elle permet une authentification simple, la création de lobbies, la possibilité de jouer plusieurs parties en parallèle et le stockage de statistiques dans MongoDB.

## 2. Architecture du système

| Couche                   | Rôle                                                       | Fichiers clés                                                                                                                  |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Client Cordova           | UI, contrôles clavier/tactile, rendu des trails            | `client/www/index.html`, `client/www/css/tron.css`, `client/www/js/*`                                                          |
| Communication temps réel | Messages JSON sur WebSocket                                | `client/www/js/init.js`, `client/www/js/WebsocketClient.js`                                                                    |
| Serveur Node.js          | Gestion des connexions, lobbies, boucle de jeu, collisions | `serveur/WebsocketServer.js`, `serveur/GameHandler.js`, `serveur/Game.js`, `serveur/Player.js`                                 |
| Base de données          | Stockage des joueurs et des parties                        | MongoDB (URL par défaut `mongodb://127.0.0.1:27017/mongo-data` dans `serveur/db.js`), schémas Mongoose dans `serveur/models/*` |

## 3. Backend (dossier `serveur/`)

- **Point d’entrée (`WebsocketServer.js`)** : expose le serveur WebSocket sur le port 9898 et route les messages (`connectionPlayer`, `getAllLobbies`, `createGame`, `joinGame`, `leaveLobby`, `playerReady`, `playerMovement`, `restartGame`, `getLeaderboard`, etc.).
- **Handler (`GameHandler.js`)** : gère les connexions actives, les lobbies, le compte à rebours, la diffusion des états de jeu et le stockage en base de données.
- **Modèle de partie (`Game.js`)** : gère la grille, l'intervalle de jeu, la détection de collisions, etc.
- **Modèle de joueur (`Player.js`)** : stocke la position, la direction courante, la couleur, l'état `alive/ready` et empêche les demi-tours.
- **Lobbies** : permet la création avec un nom et une capacité (2 à 4), comprend un système de recherche et l'attente que tous les joueurs soient prêts (compte à rebours, expulsion lorsque le délai est dépassé).
- **MongoDB** : collections `players` (identifiant, mot de passe en clair, victoires/défaites) et `games` (historique des parties, gagnant). Connexion par défaut dans `db.js`.

## 4. Frontend Cordova (dosser `client/`)

- **Écrans** : connexion, accueil (choix couleur), lobby (création/recherche/pagination), partie, fin de partie, leaderboard.
- **Communication WebSocket** : initialisée dans `www/js/init.js` (`global.ws = new WebSocket("ws://localhost:9898/");`) puis centralisée dans `www/js/WebsocketClient.js` qui distribue les paquets vers les handlers.
- **Handlers** :
  - `ConnectionHandler.js` : connexion utilisateur, stockage temporaire du mot de passe (5 min) via `localStorage`, navigation vers l’accueil.
  - `LobbyHandler.js` : récupération/affichage des lobbies, bouton “Prêt ?”, compte à rebours, join/quit, pagination (2 lobbies par page) et recherche.
  - `GameHandler.js` : démarrage de partie, affichage du trail via SVG, réception des mouvements (`updateAllPlayerMovements`), fin/restart de partie.
  - `ControlHandler.js` : envoi des déplacements (touches fléchées ou boutons tactiles), blocage des directions impossibles (demi-tour).
  - `LeaderboardHandler.js` : affichage du classement (victoires/défaites).
- **Styles** : `www/css/tron.css` pour obtenir un thème néon et l'affichage des contrôles pour téléphone.

## 5. Base de données MongoDB

Pour tester la fonctionnalité de classement, nous avons fourni une base de données pré-remplie.

Voici les 5 joueurs de la base de données :
`xebec`, `bilbo`, `zack`, `imu` et `c#`.

Tous les joueurs ont le même mot de passe : `a`.

## 6. Documentation de déploiement

### Pré-requis

| Outil               | Version conseillée       | Rôle                                                          |
| ------------------- | ------------------------ | ------------------------------------------------------------- |
| Environnement conda | (optionnel)              | Activer l’environnement MongoDB : Ex : `conda activate mongo` |
| Node.js + npm       | ≥ 18                     | Dépendances et serveur WebSocket                              |
| Cordova             | `npm install -g cordova` | Build/run client web et mobile                                |
| MongoDB             | ≥ 6                      | Persistance joueurs / classement                              |

### Installation

### 6.1 Lancer MongoDB

```sh
# Depuis le terminal du dossier serveur
mongod --dbpath ./mongo-data
```

### 6.2 Lancer le serveur Node.js

```sh
# Depuis un nouveau terminal et le dossier serveur
cd serveur
npm install
#Lancer le serveur dans le même terminal
node WebsocketServer.js   # WebSocket exposé sur ws://localhost:9898/, à changer au besoin
```

> Assurez-vous que MongoDB est démarré (`mongod`). Pour modifier l’URL de connexion, ajustez `db.js`.

### 6.3 Lancer le client Cordova (navigateur)

- Si besoin, dans `init.js`, remplacez `localhost` par l'adresse IP Websocket pour celle du serveur sur votre réseau :

```js
global.ws = new WebSocket("ws://localhost:9898/");
```

- Après avoir lancé le serveur (voir étape précédente), il faut désormais lancer un client :

```sh
# Depuis le dossier client
cd client
# Activer l'environnement conda DevWeb pour avoir cordova (cf. Moodle pour la mise en place de cet environnement)
conda activate DevWeb
npm install
cordova platform add browser   # s'il n'est pas déjà ajouté
cordova run browser            # ouvre l’app dans le navigateur
```

### 6.4 Lancer le client sur Android

- Si besoin, dans `init.js`, remplacez `localhost` par l'adresse IP Websocket pour celle du serveur sur votre réseau :

```js
global.ws = new WebSocket("ws://localhost:9898/");
```

- S'assurer de bien avoir lancé le serveur (voir étape 6.2).

- Pour lancer le client sur Android, vous aurez besoin d'[Android Studio](https://developer.android.com/studio?hl=fr).

- Dans la partie client du projet, activez l'environnement Conda DevWeb :

```sh
# Depuis le dossier client
cd client
# Activer l'environnement conda DevWeb pour avoir cordova (cf. Moodle pour la mise en place de cet environnement)
conda activate DevWeb

```

- Ajoutez la plateforme Android :

```sh
cordova platform add android
cordova build android
```

- Lancez un émulateur sur Android Studio (ou connectez votre téléphone à votre ordinateur, [voir la procédure ici](https://developer.android.com/codelabs/basic-android-kotlin-compose-connect-device?hl=fr)) sur le même réseau.

- Ensuite, lancez la commande :

```sh
cordova run android
```

## 7. Fonctionnalités implémentées

- Authentification simple (identifiant + mot de passe) avec stockage local temporaire dans le navigateur.
- Choix de couleur du joueur et affichage du pseudo connecté.
- Création de lobbies (nom, capacité 2–4), liste paginée, recherche instantanée, possibilité de rejoindre/quitter un lobby.
- Système d’état des joueurs (“Prêt” ou non), compte à rebours avant le lancement d'une partie, expulsion en cas de plus de 30 secondes d'inactivité.
- Partie en temps réel : envoi des déplacements, rendu du trail sur SVG, synchronisation des positions via WebSocket.
- Contrôles sur clavier (flèches) et boutons tactiles sur l'interface pour les téléphones.
- Fin de partie avec un message gagnant/perdant et possibilité de relancer ou de rejoindre une partie relancée par un autre joueur.
- Classement des joueurs (victoires/défaites, top 5)

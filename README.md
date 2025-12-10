# Jeu de Tron, multijoueur Web et Mobile

## 1. Objectif du projet
Développer un jeu multijoueur inspiré de Tron, jouable à la fois dans le navigateur et sur mobile via Cordova. L’application illustre un parcours complet client–serveur temps réel : authentification simple, création de lobbies, partie synchrone en WebSocket et persistance des scores dans MongoDB.

## 2. Objectifs
- Mettre en place une architecture temps réel (Node.js + WebSocket) et comprendre la synchronisation d’états de jeu.
- Structurer une SPA Cordova (HTML/CSS/JS) et l’adapter aux contraintes mobiles (contrôles tactiles).
- Gérer un lobby multijoueur (création, pagination, recherche, état “prêt”, compte à rebours).
- Implémenter des mécaniques de jeu 2D (mouvements discrets, collisions, détection de victoire/défaite).
- Persister des statistiques (victoires/défaites) dans MongoDB et exposer un classement.

## 3. Architecture du système

| Couche | Rôle | Fichiers clés |
| --- | --- | --- |
| Client Cordova | UI, contrôles clavier/tactile, rendu des trails | `www/index.html`, `www/css/tron.css`, `www/js/*` |
| Communication temps réel | Messages JSON sur WebSocket (`ws://localhost:9898/`) | `www/js/init.js`, `www/js/WebsocketClient.js` |
| Serveur Node.js | Gestion des connexions, lobbies, boucle de jeu, collisions | `../ProgWebMobile_TRON_serveur/WebsocketServer.js`, `GameHandler.js`, `Game.js`, `Player.js` |
| Base de données | Persistance des joueurs et du leaderboard | MongoDB (URL par défaut `mongodb://127.0.0.1:27017/mongo-data` dans `db.js`), schémas Mongoose dans `../ProgWebMobile_TRON_serveur/models/*` |

## 4. Backend (dossier `../ProgWebMobile_TRON_serveur`)
- **Point d’entrée (`WebsocketServer.js`)** : expose le serveur WebSocket sur le port 9898 et route les messages (`connectionPlayer`, `getAllLobbies`, `createGame`, `joinGame`, `leaveLobby`, `playerReady`, `playerMovement`, `restartGame`, `getLeaderboard`).
- **Orchestration (`GameHandler.js`)** : gère les connexions actives, les lobbies, le compte à rebours, la diffusion des états de jeu et la persistance.
- **Modèle de partie (`Game.js`)** : gère la grille (100×100), la boucle de tick, la détection de collisions (bords ou trail existant) et l’annonce du vainqueur.
- **Modèle joueur (`Player.js`)** : stocke position, direction courante, couleur, état `alive/ready`, empêche les demi-tours.
- **Lobbies** : création avec nom + capacité (2 à 4), liste paginée/recherchable, transition vers la partie après que tous les joueurs sont prêts (compte à rebours, kick si délai dépassé).
- **Persistance MongoDB** : collections `players` (identifiant, mot de passe en clair, victoires/défaites) et `games` (historique des parties, gagnant). Connexion par défaut dans `db.js`.

## 5. Frontend Cordova (HTML/CSS/JS)
- **Écrans** : connexion, accueil (choix couleur), lobby (création/recherche/pagination), partie (SVG 300×300), fin de partie, leaderboard.
- **Flux WebSocket** : initialisé dans `www/js/init.js` (`global.ws = new WebSocket("ws://localhost:9898/");`) puis centralisé dans `www/js/WebsocketClient.js` qui distribue les paquets vers les handlers.
- **Handlers** :
  - `ConnectionHandler.js` : connexion utilisateur, stockage temporaire du mot de passe (5 min) via `localStorage`, navigation vers l’accueil.
  - `LobbyHandler.js` : récupération/affichage des lobbies, bouton “Prêt ?”, compte à rebours, join/quit, pagination (2 lobbies par page) et recherche.
  - `GameHandler.js` : démarrage de partie, affichage du trail via SVG, réception des mouvements (`updateAllPlayerMovements`), fin/restart de partie.
  - `ControlHandler.js` : envoi des déplacements (touches fléchées ou boutons tactiles), blocage des directions impossibles (demi-tour).
  - `LeaderboardHandler.js` : affichage du classement (victoires/défaites).
- **Styles** : `www/css/tron.css` propose un thème néon (police Orbitron, dégradés violets/bleus) et un overlay de contrôles mobiles.

## 6. Documentation de déploiement

### Prérequis
| Outil | Version conseillée | Rôle |
| --- | --- | --- |
| Environnement conda | (optionnel) | Activer l’environnement MongoDB : Ex : conda activate mongo |
| Node.js + npm | ≥ 18 | Dépendances et serveur WebSocket |
| Cordova | `npm install -g cordova` | Build/run client web et mobile |
| MongoDB | ≥ 6 | Persistance joueurs / classement |


### Pour lancer le projet sous Windows (VS Code)

### 6.1 Lancer MongoDB
```sh
# Depuis la terminal du dossier serveur
mongod --dbpath D:\data\db
```

### 6.2 Lancer le serveur Node.js
```sh
# Depuis un nouveau terminal et le dossier serveur
cd "D:\ProgWebMobile_TRON_serveur"
npm install
npm install ws
#Lancer le serveur dans le même terminal
node WebsocketServer.js   # WebSocket exposé sur ws://localhost:9898/
```
> Assurez-vous que MongoDB est démarré (`mongod`). Pour modifier l’URL de connexion, ajuster `db.js`.

### 6.3 Lancer le client Cordova (navigateur)
```sh
# Depuis le dossier client
cd "D:\ProgWebMobile"
npm install
cordova platform add browser   # si non déjà ajouté
cordova run browser            # ouvre l’app dans le navigateur
```

### 6.4 Lancer le client sur Android
<!--A completer -->
```sh

```

## 7. Structure du dépôt

- 📁 **ProgWebMobile_TRON_serveur/**
  - 📁 **models/**
    - 📄 `PlayerModel.js`
    - 📄 `GameModel.js`
  - 📄 `db.js`
  - 📄 `Game.js`
  - 📄 `GameHandler.js`
  - 📄 `Player.js`
  - 📄 `WebsocketServer.js`

- 📁 **ProgWebMobile/**
    - 📁 **www/**
      - 📁 **css/**
        - 📄 `tron.css`
      - 📁 **fonts/**
      - 📁 **img/**
      - 📁 **js/**
        - 📁 **handlers/**
          - 📄 `ConnectionHandler.js`
          - 📄 `ControlHandler.js`
          - 📄 `GameHandler.js`
          - 📄 `LeaderboardHandler.js`
          - 📄 `LobbyHandler.js`
        - 📄 `global.js`
        - 📄 `init.js`
        - 📄 `WebsocketClient.js`
  - 📄 `index.html`

<!--Completer -->
## 8. Fonctionnalités implémentées
- Authentification simple (identifiant + mot de passe) avec mémorisation locale temporaire.
- Choix de couleur du joueur, affichage du pseudo connecté.
- Création de lobbies (nom, capacité 2–4), liste paginée, recherche instantanée, rejoindre/quitter.
- Passage à l’état “Prêt ?”, compte à rebours avant lancement, kick en cas d’inactivité.
- Partie temps réel : envoi des déplacements, rendu du trail sur SVG, synchro des positions via WebSocket.
- Contrôles clavier (flèches) et boutons tactiles superposés pour mobile.
- Fin de partie avec message gagnant/perdant et possibilité de relancer ou rejoindre une partie relancée par un autre joueur.
- Classement des joueurs (victoires/défaites, top 5) depuis MongoDB.
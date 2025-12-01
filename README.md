**Pour lancer le projet sous Windows (VS Code)**

1. Lancer MongoDB

```
mongod --dbpath D:\data\db
```

2. Définir les dépendances du serveur. Nouveau terminal

```
cd "D:\ProgWebMobile_TRON_serveur-main" // un exemple
npm install
npm install ws
```

3. Lancer le serveur dans le même terminal

```
node Server.js
```

5. Lancer le client dans un autre terminal

```
cd "D:\ProgWebMobile-client" // un exemple
python -m http.server 8080
```

# Projet Programmation Web Mobile

```sh
conda activate DevWeb
```

```sh
npm install
```

```sh
cordova run browser
```

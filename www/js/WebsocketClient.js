import ConnectionHandler from "./handlers/ConnectionHandler.js";
import LobbyHandler from "./handlers/LobbyHandler.js";
import GameHandler from "./handlers/GameHandler.js";
import LeaderboardHandler from "./handlers/LeaderboardHandler.js";
import { global, globalUI } from "./global.js";
import { init } from "./init.js";

// === Fichier qui gère les paquets venants du serveur ===

// Attente que Cordova soit prêt
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Initialisation côté client
  init();

  global.ws.onopen = function () {
    console.log("Connecté au serveur WebSocket !");
  };

  global.ws.onmessage = function (message) {
    let data = JSON.parse(message.data);

    // console.log("Received: '" + message.data + "'");

    switch (data.type) {
      case "connectionResponse":
        // Le client se connecte sur le jeu
        ConnectionHandler.handleConnectionResponse(data);
        break;
      case "getLeaderboardResponse":
        // Le client clique sur le bouton "Classement"
        LeaderboardHandler.handleGetLeaderboardResponse(data);
        break;
      case "updateLobbyInfos":
        // Le client demande à mettre à jour les informations sur les parties actuelles
        LobbyHandler.handleUpdateLobbyInfos();
        break;
      case "getAllLobbiesResponse":
        // Le serveur donne les informations à jour sur les parties
        LobbyHandler.handleGetAllLobbiesResponse(data);
        break;
      case "playerReadyResponse":
        // Le client clique sur "Prêt"
        LobbyHandler.handlePlayerReadyResponse(data);
        break;
      case "countdown":
        // La partie commence bientôt
        LobbyHandler.handleCountdown(data);
        break;
      case "leaveLobbyResponse":
        // Le client quitte la partie
        LobbyHandler.handleLeaveLobbyResponse(data);
        break;
      case "kickPlayer":
        // Le client est expulsé de la partie
        LobbyHandler.handleKickPlayer();
        break;
      case "createGameResponse":
        // Le client crée une partie
        GameHandler.handleCreateGameResponse(data);
        break;
      case "joinGameResponse":
        // Le client souhaite rejoindre une partie
        GameHandler.handleJoinGameResponse(data);
        break;
      case "updateColor":
        // Le serveur met à jour les couleurs des joueurs
        LobbyHandler.handleUpdateColor(data);
        break;
      case "changeColorResponse":
        // Le client souhaite changer de couleur
        LobbyHandler.handleChangeColorResponse(data);
        break;
      case "updateAllPlayerMovements":
        // Le client reçoit l'état de la grille de jeu
        GameHandler.handleUpdateAllPlayerMovements(data);
        break;
      case "endGame":
        // La partie se termine
        GameHandler.handleEndGame(data);
        break;
      case "restartGameResponse":
        // Le client souhaite rejouer
        GameHandler.handleRestartGameResponse(data);
        break;
    }
  };
}

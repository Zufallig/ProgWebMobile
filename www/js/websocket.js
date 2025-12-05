import ConnectionHandler from "./connexion.js";
import LobbyHandler from "./LobbyHandler.js";
import GameHandler from "./GameHandler.js";
import LeaderboardHandler from "./LeaderboardHandler.js";
import init from "./init.js";

// On attend que Cordova soit prêt
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  init.ws.onopen = function () {
    console.log("Connecté au serveur WebSocket !");
  };

  init.ws.onmessage = function (message) {
    let data = JSON.parse(message.data);

    console.log("Received: '" + message.data + "'");

    switch (data.type) {
      case "connectionResponse":
        // Le client se connecte
        ConnectionHandler.handleConnectionResponse(data);
        break;
      case "getLeaderboardResponse":
        // Le client clique sur le classement
        LeaderboardHandler.handleGetLeaderboardResponse(data);
        break;
      case "updateLobbyInfos":
        // Le client demande à mettre à jour les informations sur les parties actuelles
        LobbyHandler.handleUpdateLobbyInfos(data);
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

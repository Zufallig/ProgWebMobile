let ws = null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  ws = new WebSocket("ws://localhost:9898/");
  ws.onopen = function () {
    console.log("Connecté au serveur WebSocket !");

    // Connexion du joueur
  };
  ws.onmessage = function (message) {
    let data = JSON.parse(message.data);

    "Received: '" + message.data + "'";
    switch (data.type) {
      case "connectionResponse":
        checkValid(data);
        break;
      case "getLeaderboardResponse":
        if (data.valid) {
          renderLeaderboard(data.players);
        } else {
          showMessageScreen("Erreur", data.reason);
        }
        break;
      case "createGameResponse":
        getGameId(data);

        ws.send(
          JSON.stringify({
            type: "getAllLobbies",
          })
        );

        break;
      case "updateLobbyInfos":
        ws.send(
          JSON.stringify({
            type: "getAllLobbies",
          })
        );
      case "getAllLobbiesResponse":
        renderLobbies(data);
        break;
      case "joinGameResponse":
        if (data.valid) {
          // Enregistrer l'ID de la partie
          gameId = data.gameId;

          // Aller sur la scène de jeu
          showScreen("gameScreen");
        } else {
          showMessageScreen(
            "Erreur",
            "Impossible de rejoindre : " + data.reason
          );
        }
        break;

      case "playerReadyResponse":
        if (data.valid) {
          // Changer l'interface pour afficher joueur prêt
          let readyButton = document.getElementById("readyBtn");
          readyButton.textContent = "Prêt ! ";
          readyButton.style.backgroundColor = "#ff00ff";
          readyButton.style.color = "#111";
        } else {
          // Afficher une erreur
          showMessageScreen("Erreur", data.reason);
        }
        break;
      case "countdown":
        // Affiche le countdown dans la game
        showCountdown(gameId, data.count);

        // Démarrage de la partie
        if (data.count === 0) {
          startGame();
        }
        break;
      case "playerMovementResponse":
        if (data.valid) {
          // Continuer à afficher le jeu
        } else {
          // Afficher une erreur
        }
        break;
      case "updateAllPlayerMovements":
        if (gameStarted) {
          updatePlayers(data.players);
        }
        break;
      case "endGame":
        if (data.winnerName === username) {
          gameEnded("Vous avez gagné ! ");
        } else {
          gameEnded("Vous avez perdu...");
        }
        break;
      case "restartGameResponse":
        if (data.valid) {
          showJoinRestartedGame(data);
        } else {
          showMessageScreen("Erreur", data.reason);
        }
        break;
      case "leaveLobbyResponse":
        if (!data.valid) {
          showMessageScreen("Erreur", data.reason);
        }
        break;
      case "kickPlayer":
        showMessageScreen("Temps écoulé", "Vous avez été expulsé de la partie");
        showScreen("lobbyScreen");
        break;
    }
  };
}

function sendConnection(data) {
  ws.send(JSON.stringify(data));
}

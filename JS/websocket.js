const ws = new WebSocket("ws://localhost:9898/");
ws.onopen = function () {
  console.log("WebSocket Client Connected");

  // Connexion du joueur
};
ws.onmessage = function (message) {
  let data = JSON.parse(message.data);

  console.log("Received: '" + message.data + "'");
  switch (data.type) {
    case "connectionResponse":
      checkValid(data);
      break;
    case "createGameResponse":
      // Si l'id du joueur actuel correspond à l'id du créateur de la game,
      // on stocke l'id de la game
      if (data.creatorId === id) {
        getGameId(data);
      }
      ws.send(
        JSON.stringify({
          type: "getAllLobbies",
          playerId: id,
        })
      );

      break;
    case "updateLobbyInfos":
      ws.send(
        JSON.stringify({
          type: "getAllLobbies",
          playerId: id,
        })
      );
    case "getAllLobbiesResponse":
      renderLobbies(data);
      break;
    case "joinGameResponse":
      if (data.valid) {
        console.log("Rejoint avec succès :", data);

        // Enregistrer l'ID de la partie
        gameId = data.gameId;

        // Aller sur la scène de jeu
        showScreen("gameScreen");
      } else {
        alert("Impossible de rejoindre : " + data.reason);
      }
      break;

    case "playerReadyResponse":
      if (data.valid) {
        // Afficher joueur prêt
      } else {
        // Afficher une erreur
      }
      break;
    case "countdown":
      // Affiche le cout
      // data.count
      break;
    case "playerMovementResponse":
      if (data.valid) {
        // Continuer à afficher le jeu
      } else {
        // Afficher une erreur
      }
      break;
    case "updateAllPlayerMovements":
      break;
    case "endGame":
      break;
  }
};

function sendConnection(data) {
  ws.send(JSON.stringify(data));
}

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
      getGameId(data);
      break;
    case "getAllLobbiesResponse":        
      renderLobbies(data);
      break;
    case "joinGameResponse":
      if (data.valid) {
        // Afficher interface lobby
      } else {
        // Afficher une erreur
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

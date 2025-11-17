// Create the Web socket !
const ws = new WebSocket("ws://localhost:9898/");
ws.onopen = function () {
  console.log("WebSocket Client Connected");

  // Connexion du joueur
};
ws.onmessage = function (e) {
  let data = JSON.parse(message.utf8Data);

  console.log("Received: '" + e.data + "'");
  switch (data.type) {
    case "connectionResponse":
      if (data.valid) {
        // Laisser entrer le joueur
      } else {
        // Ne pas laisser entrer le joueur
      }
      break;
    case "createGameResponse":
      if (data.valid) {
        // Afficher interface lobby
      } else {
        // Afficher une erreur
      }
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

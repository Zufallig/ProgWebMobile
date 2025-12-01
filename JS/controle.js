let lastSentDirection = null;

//Envoi des mouvements au serveur
function sendMovement(direction) {
  if (!dir || gameId === "") {
    return;
  }

  //ignorer les mouvements identiques au dernier envoyé
  if (dir === lastSentDirection) {
    return;
  }

  lastSentDirection = dir;
  // On n'écoute les mouvements que lorsque le joueur est dans une partie
  ws.send(
    JSON.stringify({
      type: "playerMovement",
      username: username,
      gameId: gameId,
      direction: dir,
    })
  );
}

//Fonction de controle
document.addEventListener("keydown", (e) => {
  const movements = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  const dir = movements[e.key];

  if (!dir) {
    // On ignore les touches qui ne sont pas up, down, left, right
    return;
  }

  sendMovement(dir);
});

function setDirection(dir) {
  sendMovement(dir);
}

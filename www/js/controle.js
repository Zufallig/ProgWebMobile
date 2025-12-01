let lastSentDirection = null;

function sendMovement(dir) {
  if (!dir || gameId === "") {
    return;
  }

  // Ignorer si la direction demandée est identique à la précédente
  if (dir === lastSentDirection) {
    return;
  }

  lastSentDirection = dir;

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

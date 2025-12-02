let lastSentDirection = null;
let currentDirection = null;

function isOppositeDirection(newDir, currentDir) {
  if (!newDir || !currentDir) return false;
    return (
      (currentDir === "up" && newDir === "down") ||
      (currentDir === "down" && newDir === "up") ||
      (currentDir === "left" && newDir === "right") ||
      (currentDir === "right" && newDir === "left")
    );
  }

function sendMovement(dir) {
  if (!dir || gameId === "") {
    return;
  }

   // Ignorer si la direction demandée est l'opposé de la direction actuelle
  if (dir === lastSentDirection || isOppositeDirection(dir, currentDirection)) {
    return;
  }

  lastSentDirection = dir;
  currentDirection = dir;

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

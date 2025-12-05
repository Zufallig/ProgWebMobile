import init from "./init.js";

let lastSentDirection = null;
let currentDirection = null;

document.getElementById("upBtn").onclick = () => setDirection("up");
document.getElementById("downBtn").onclick = () => setDirection("down");
document.getElementById("leftBtn").onclick = () => setDirection("left");
document.getElementById("rightBtn").onclick = () => setDirection("right");

// Réinitialise les contrôles
function resetControls() {
  lastSentDirection = null;
  currentDirection = null;
}

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
  if (!dir || init.gameId === "") {
    return;
  }

  // Ignorer si la direction demandée est l'opposé de la direction actuelle
  if (dir === lastSentDirection || isOppositeDirection(dir, currentDirection)) {
    return;
  }

  lastSentDirection = dir;
  currentDirection = dir;

  init.sendServer({
    type: "playerMovement",
    username: init.username,
    gameId: init.gameId,
    direction: dir,
  });
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

export default { resetControls, currentDirection };

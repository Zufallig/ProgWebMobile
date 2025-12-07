import { global, sendServer } from "../global.js";

let lastSentDirection = null;
let currentDirection = null;

// === Ajout des event listeners liés aux contrôles ===

// Permet de se déplacer en cliquant sur les boutons
document.getElementById("upBtn").onclick = () => sendMovement("up");
document.getElementById("downBtn").onclick = () => sendMovement("down");
document.getElementById("leftBtn").onclick = () => sendMovement("left");
document.getElementById("rightBtn").onclick = () => sendMovement("right");

// Réinitialise les contrôles
function resetControls() {
  lastSentDirection = null;
  currentDirection = null;
}

// Permet de voir si la direction demandée par le client est opposée à sa direction actuelle
// Et donc empêcher le client d'envoyer la requête au serveur car l'action est impossible
function isOppositeDirection(newDir, currentDir) {
  if (!newDir || !currentDir) return false;
  return (
    (currentDir === "up" && newDir === "down") ||
    (currentDir === "down" && newDir === "up") ||
    (currentDir === "left" && newDir === "right") ||
    (currentDir === "right" && newDir === "left")
  );
}

// Gère l'envoi de requêtes client liées au déplacement du joueur
function sendMovement(dir) {
  if (!dir || global.gameId === "") {
    return;
  }

  // Ignorer si la direction demandée est l'opposé de la direction actuelle ou la même que la direction actuelle
  if (dir === lastSentDirection || isOppositeDirection(dir, currentDirection)) {
    return;
  }

  // Mise à jour des valeurs de direction
  lastSentDirection = dir;
  currentDirection = dir;

  sendServer({
    type: "playerMovement",
    username: global.username,
    gameId: global.gameId,
    direction: dir,
  });
}

// Fonction de contrôles pour le clavier
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

export default { resetControls, currentDirection };

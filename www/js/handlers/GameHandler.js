import { global, globalUI, sendServer } from "../global.js";
import ControlHandler from "./ControlHandler.js";

let svgCanvas;
let gameStarted = false;
// Valeur à mettre en accord avec la taille de svgCanvas (dans le HTML) pour prendre en compte taille du jeu 100*100
const squareSize = 3;
let playersState = {};
let trailColor = "#00ffff";

// === Ajout des event listeners liés à la partie ===

document.getElementById("gameEndHomeBtn").onclick = globalUI.goToHome;
document.getElementById("restartBtn").onclick = restartGame;

// === Fonctions handlers de la partie ===

function handleCreateGameResponse(data) {
  global.gameId = data.gameId;

  sendServer({
    type: "getAllLobbies",
  });
}

function handleJoinGameResponse(data) {
  if (data.valid) {
    // Enregistrer l'ID de la partie
    global.gameId = data.gameId;

    // Aller sur la scène de jeu
    globalUI.showScreen("gameScreen");
  } else {
    globalUI.showMessageScreen(
      "Erreur",
      "Impossible de rejoindre : " + data.reason
    );
  }
}

function handleUpdateAllPlayerMovements(data) {
  if (gameStarted) {
    updatePlayers(data.players);
  }
}

function handleEndGame(data) {
  if (data.winnerName === global.username) {
    gameEnded("Vous avez gagné ! ");
  } else {
    gameEnded("Vous avez perdu...");
  }
}

function handleRestartGameResponse(data) {
  if (data.valid) {
    showJoinRestartedGame(data);
  } else {
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

function restartGame() {
  document.getElementById("gameEndedScreen").style.display = "none";
  // Envoi au serveur que l'on souhaite rejouer
  sendServer({
    type: "restartGame",
    username: global.username,
    gameId: global.gameId,
    color: trailColor, // M : envoi de la couleur choisie
  });
}

function showJoinRestartedGame(data) {
  let restartBtn = document.getElementById("restartBtn");
  restartBtn.textContent = "Rejoindre";
  document.getElementById("gameEndText").textContent =
    data.restartName + " veut rejouer !";
  // On change l'action réalisée par le bouton, pour ne pas recréer une autre partie en
  // plus de la nouvelle créée par un autre joueur
  restartBtn.onclick = null;
  restartBtn.classList.add("joinGameBtn");
  restartBtn.dataset.id = data.gameId;
}

function startGame() {
  gameStarted = true;
  svgCanvas = document.getElementById("svgCanvas");

  // Réinitialisation des contrôles
  ControlHandler.resetControls();

  trailColor = document.getElementById("colorPicker").value;
  svgCanvas.innerHTML = "";
  // Reset de l'état des joueurs
  playersState = {};

  document.getElementById("globalMobileControls").style.display = "flex";

  // Reset texte fin partie et fonction restart game
  document.getElementById("gameEndText").textContent = "Fin de la partie";
  let restartBtn = document.getElementById("restartBtn");
  restartBtn.textContent = "Rejouer";
  restartBtn.onclick = restartGame;
  restartBtn.classList.remove("joinGameBtn");
  restartBtn.removeAttribute("data-id");
}

function updatePlayers(players) {
  svgCanvas.innerHTML = "";

  players.forEach((player) => {
    if (!playersState[player.username]) {
      playersState[player.username] = {
        trail: [],
        color: player.color || trailColor, // M : couleur du joueur ou couleur par défaut
      };
    }

    const state = playersState[player.username];
    // M : mise à jour de la couleur
    state.color = player.color || state.color || trailColor; // M : mise à jour de la couleur

    if (player.username === global.username && player.currentDirection) {
      ControlHandler.currentDirection = player.currentDirection;
    }

    // si joueur mort, on continue d'afficher son trail
    if (!player.alive) {
      return renderTrail(state);
    }

    // ajouter position au trail
    state.trail.push({ x: player.x, y: player.y });

    // dessiner trail
    renderTrail(state);
  });
}

function gameEnded(message) {
  svgCanvas.innerHTML = "";
  document.getElementById("gameEndText").textContent =
    message || "Fin de la partie";
  document.getElementById("gameEndedScreen").style.display = "block";
  document.getElementById("globalMobileControls").style.display = "none";
  let readyButton = document.getElementById("readyBtn");
  readyButton.textContent = "Prêt ? ";
  readyButton.style.backgroundColor = "#111";
  readyButton.style.color = "#fff";
  global.readySent = false;

  // On remet le bouton Quitter pour la prochaine partie
  document.getElementById("quitBtn").style.display = "block";
}

// === Fonctions outils ===

function createSvgElement(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
  return el;
}

function renderTrail(playerState) {
  const color = playerState.color;
  playerState.trail.forEach((seg) => {
    const rect = createSvgElement("rect", {
      x: seg.x * squareSize,
      y: seg.y * squareSize,
      width: squareSize,
      height: squareSize,
      fill: color,
    });
    svgCanvas.appendChild(rect);
  });
}

export default {
  handleCreateGameResponse,
  handleJoinGameResponse,
  handleUpdateAllPlayerMovements,
  handleEndGame,
  handleRestartGameResponse,
  startGame,
};

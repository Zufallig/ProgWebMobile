import { global, globalUI, sendServer } from "../global.js";
import ControlHandler from "./ControlHandler.js";

// Grille de jeu
let svgCanvas;
let gameStarted = false;
// Valeur à mettre en accord avec la taille de svgCanvas (dans le HTML) pour prendre en compte taille du jeu 100*100
const squareSize = 3;
let playersState = {};
let trailColor = "#00ffff";

// === Ajout des event listeners liés à la partie ===

document.getElementById("gameEndHomeBtn").onclick = () =>
  globalUI.showScreen("homeScreen");
document.getElementById("restartBtn").onclick = restartGame;

// === Fonctions handlers de la partie ===

// Gère la mise à jour des lobbies après la création d'un lobby
function handleCreateGameResponse(data) {
  global.gameId = data.gameId;

  sendServer({
    type: "getAllLobbies",
  });
}

// Gère l'affichage de l'interface après une tentative de rejoindre un lobby
function handleJoinGameResponse(data) {
  if (data.valid) {
    // Enregistrer l'ID de la partie comme étant la partie actuelle du client
    global.gameId = data.gameId;

    // Aller sur l'écran de jeu
    globalUI.showScreen("gameScreen");
  } else {
    globalUI.showMessageScreen(
      "Erreur",
      "Impossible de rejoindre : " + data.reason
    );
  }
}

// Gère les informations envoyées par le serveur sur l'état des joueurs dans la partie
function handleUpdateAllPlayerMovements(data) {
  if (gameStarted) {
    updatePlayers(data.players);
  }
}

// Gère l'affichage de l'interface après la fin de la partie
function handleEndGame(data) {
  if (data.winnerName === global.username) {
    gameEnded("Vous avez gagné ! ");
  } else {
    gameEnded("Vous avez perdu...");
  }
}

// Gère l'affichage de l'interface après une demande de rejouer de la part d'un autre joueur de la partie
function handleRestartGameResponse(data) {
  if (data.valid) {
    showJoinRestartedGame(data);
  } else {
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

// === Fonctions supports aux handlers ===

function updatePlayers(players) {
  svgCanvas.innerHTML = "";

  players.forEach((player) => {
    if (!playersState[player.username]) {
      playersState[player.username] = {
        trail: [],
        color: player.color || trailColor,
      };
    }

    const state = playersState[player.username];
    state.color = player.color || state.color || trailColor;

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

// Envoie une requête au serveur pour rejouer une partie
function restartGame() {
  document.getElementById("gameEndedScreen").style.display = "none";
  // Envoi au serveur que l'on souhaite rejouer
  sendServer({
    type: "restartGame",
    username: global.username,
    gameId: global.gameId,
    color: trailColor,
  });
}

// Gère l'affichage de l'interface quand un autre joueur souhaite rejouer
function showJoinRestartedGame(data) {
  let restartBtn = document.getElementById("restartBtn");
  restartBtn.textContent = "Rejoindre";
  document.getElementById("gameEndText").textContent =
    data.restartName + " veut rejouer !";
  // On change l'action réalisée par le bouton "Rejouer", pour ne pas recréer une autre partie en
  // plus de la nouvelle créée par un autre joueur, mais plutôt rejoindre la nouvelle partie
  restartBtn.onclick = null;
  restartBtn.classList.add("joinGameBtn");
  restartBtn.dataset.id = data.gameId;
}

// === Fonctions outils ===

// Démarre une partie
function startGame() {
  gameStarted = true;
  svgCanvas = document.getElementById("svgCanvas");

  // Réinitialisation des contrôles
  ControlHandler.resetControls();

  trailColor = document.getElementById("colorPicker").value;
  svgCanvas.innerHTML = "";
  // Réinitialisation de l'état des joueurs
  playersState = {};

  // Affichage des contrôles
  document.getElementById("globalMobileControls").style.display = "flex";

  // Réinitialisation du texte de fin de partie et de la fonction restart game
  document.getElementById("gameEndText").textContent = "Fin de la partie";
  let restartBtn = document.getElementById("restartBtn");
  restartBtn.textContent = "Rejouer";
  restartBtn.onclick = restartGame;
  restartBtn.classList.remove("joinGameBtn");
  restartBtn.removeAttribute("data-id");
}

// Crée un élément SVG utilisé pour l'affichage des motos
function createSvgElement(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
  return el;
}

// Affiche les trails des motos
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

/* -----------------------------
       DÉMARRER / REJOUER LE JEU
    ----------------------------- */
let svgCanvas;
let gameStarted = false;
// Valeur à mettre en accord avec la taille de svgCanvas (dans le HTML) pour prendre en compte taille du jeu 100*100
const squareSize = 3;
let playersState = {};
let trailColor = "#00ffff";
let readySent = false;

function restartGame() {
  document.getElementById("gameEndedScreen").style.display = "none";
  // Envoi au serveur que l'on souhaite rejouer
  ws.send(
    JSON.stringify({
      type: "restartGame",
      username: username,
      gameId: gameId,
      color: trailColor, // M : envoi de la couleur choisie
    })
  );
}

function showJoinRestartedGame(data) {
  let restartBtn = document.getElementById("restartBtn");
  restartBtn.textContent = "Rejoindre";
  document.getElementById("gameEndText").textContent =
    data.restartName + " veut rejouer !";
  // On change l'action réalisée par le bouton, pour ne pas recréer une autre partie en
  // plus de la nouvelle créée par un autre joueur
  restartBtn.onclick = () => {
    joinRestartedGame(data.gameId);
  };
}

function joinRestartedGame(gameIdToJoin) {
  // On tente de rejoindre la partie
  ws.send(
    JSON.stringify({
      type: "joinGame",
      username: username,
      gameId: gameIdToJoin,
      color: trailColor,
    })
  );
}

// Réinitialise les contrôles
function resetControls() {
  lastSentDirection = null;
  currentDirection = null;
}

function startGame() {
  gameStarted = true;
  svgCanvas = document.getElementById("svgCanvas");

  // Réinitialisation des contrôles
  resetControls();

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
}

function setReady() {
  if (readySent || !gameId) {
    return;
  }

  readySent = true;

  ws.send(
    JSON.stringify({
      type: "playerReady",
      username: username,
      gameId: gameId,
      ready: true,
    })
  );
}

/* -----------------------------
       MISE À JOUR DU JEU
    ----------------------------- */

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

    if (player.username === username && player.currentDirection) {
      currentDirection = player.currentDirection;
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

/* -----------------------------
       FIN DE PARTIE
    ----------------------------- */
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
  readySent = false;
}

/* -----------------------------
       OUTILS
    ----------------------------- */
function createSvgElement(tag, attrs) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
  return el;
}

function trailColorToRGBA(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function leaveGameAndGoToHome() {
  ws.send(
    JSON.stringify({
      type: "leaveLobby",
      username: username,
      gameId: gameId,
    })
  );
  goToHome();
}

function goToHome() {
  document.getElementById("gameEndedScreen").style.display = "none";
  showScreen("homeScreen");
}

function closeMessageScreen() {
  document.getElementById("messageScreen").style.display = "none";
}

// Fonction pour afficher un message dans un modal (par défaut, une erreur)
function showMessageScreen(title, message) {
  document.getElementById("messageScreen").style.display = "block";
  document.getElementById("messageTitle").textContent = title || "Erreur";
  document.getElementById("messageText").textContent =
    message || "Une erreur est survenue";
}

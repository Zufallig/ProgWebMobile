/* -----------------------------
       DÉMARRER / REJOUER LE JEU
    ----------------------------- */
let svgCanvas;
let gameStarted = false;
const gridSize = 6;
const canvasWidth = 600,
  canvasHeight = 600;
let playersState = {};
let trailColor = "#00ffff";

function restartGame() {
  document.getElementById("gameEndedScreen").style.display = "none";
  // Envoi au serveur que l'on souhaite rejouer
  ws.send(
    JSON.stringify({
      type: "restartGame",
      playerId: id,
      gameId: gameId,
    })
  );
  startGame();
}

function startGame() {
  gameStarted = true;
  svgCanvas = document.getElementById("svgCanvas");
  trailColor = document.getElementById("colorPicker").value;
  svgCanvas.innerHTML = "";
  // Reset de l'état des joueurs
  playersState = {};

  // document.getElementById("scoreDisplay").textContent = "Score: 0";
  document.getElementById("globalMobileControls").style.display = "flex";
}

function setReady() {
  ws.send(
    JSON.stringify({
      type: "playerReady",
      playerId: id,
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
    if (!playersState[player.id]) {
      playersState[player.id] = {
        trail: [],
        color: player.color || trailColor, // M : couleur du joueur ou couleur par défaut
      };
    }

    const state = playersState[player.id];
    // M : mise à jour de la couleur
    state.color = player.color || state.color || trailColor; // M : mise à jour de la couleur

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
  const color = playerState.color || "#00ffff"; // fallback

  playerState.trail.forEach((seg) => {
    const rect = createSvgElement("rect", {
      x: seg.x * gridSize,
      y: seg.y * gridSize,
      width: gridSize,
      height: gridSize,
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
  document.getElementById("finalScoreText").textContent =
    message || "Fin de la partie";
  document.getElementById("gameEndedScreen").style.display = "block";
  document.getElementById("globalMobileControls").style.display = "none";
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

function goToHome() {
  document.getElementById("gameEndedScreen").style.display = "none";
  showScreen("homeScreen");
}

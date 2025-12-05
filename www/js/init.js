let ws = new WebSocket("ws://localhost:9898/");
let username = "";
let gameId = "";
let readySent = false;

document.getElementById("messageScreenBtn").onclick = closeMessageScreen;

function sendServer(data) {
  ws.send(JSON.stringify(data));
}

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

// Fonction pour afficher un message dans un modal (par défaut, une erreur)
function showMessageScreen(title, message) {
  document.getElementById("messageScreen").style.display = "block";
  document.getElementById("messageTitle").textContent = title || "Erreur";
  document.getElementById("messageText").textContent =
    message || "Une erreur est survenue";
}

function closeMessageScreen() {
  document.getElementById("messageScreen").style.display = "none";
}

function goToHome() {
  document.getElementById("gameEndedScreen").style.display = "none";
  showScreen("homeScreen");
}

function leaveGameAndGoToHome() {
  sendServer({
    type: "leaveLobby",
    username: username,
    gameId: gameId,
  });

  goToHome();
}

async function getGameId(data) {
  if (data.valid && data.creatorName === username) {
    gameId = data.gameId;
  } else {
    return -1;
  }
}

export default {
  ws,
  gameId,
  username,
  sendServer,
  showScreen,
  showMessageScreen,
  closeMessageScreen,
  goToHome,
  leaveGameAndGoToHome,
  getGameId,
  readySent,
};

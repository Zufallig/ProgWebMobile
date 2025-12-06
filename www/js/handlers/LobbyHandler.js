import { global, globalUI, sendServer } from "../global.js";
import GameHandler from "./GameHandler.js";

let allLobbies = [];
let page = 1;
const perPage = 2;

// === Ajout des event listeners liés au lobby ===

document.getElementById("playBtn").onclick = goToLobby;
document.getElementById("toggleLobbyFormBtn").onclick = toggleLobbyForm;
document.getElementById("lobbyHomeBtn").onclick = globalUI.goToHome;
document.getElementById("confirmCreateLobbyBtn").onclick = createLobby;
document.getElementById("lobbySearchInput").oninput = filterLobbies;
document.getElementById("readyBtn").onclick = setReady;
document.getElementById("quitBtn").onclick = leaveLobbyAndGoToHome;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("joinGameBtn")) {
    joinGame(e.target.dataset.id);
  }
});

// === Fonctions handlers du lobby ===

function handleUpdateLobbyInfos() {
  sendServer({
    type: "getAllLobbies",
  });
}

function handleGetAllLobbiesResponse(data) {
  renderLobbies(data);
}

function handleLeaveLobbyResponse(data) {
  if (!data.valid) {
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

function handlePlayerReadyResponse(data) {
  if (data.valid) {
    // Changer l'interface pour afficher joueur prêt
    let readyButton = document.getElementById("readyBtn");
    readyButton.textContent = "Prêt ! ";
    readyButton.style.backgroundColor = "#ff00ff";
    readyButton.style.color = "#111";

    // On cache le bouton pour quitter la partie
    document.getElementById("quitBtn").style.display = "none";
  } else {
    // Afficher une erreur
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

function handleCountdown(data) {
  if (data.count === 3) {
  }
  // Affiche le countdown dans la game
  showCountdown(global.gameId, data.count);

  // Démarrage de la partie
  if (data.count === 0) {
    GameHandler.startGame();
  }
}

function handleKickPlayer() {
  globalUI.showMessageScreen(
    "Temps écoulé",
    "Vous avez été expulsé de la partie"
  );
  globalUI.showScreen("lobbyScreen");
}

// === Fonctions d'interface onclick ===

function goToLobby() {
  sendServer({
    type: "getAllLobbies",
  });

  globalUI.showScreen("lobbyScreen");
}

function leaveLobbyAndGoToHome() {
  sendServer({
    type: "leaveLobby",
    username: global.username,
    gameId: global.gameId,
  });

  globalUI.goToHome();
}

function toggleLobbyForm() {
  const form = document.getElementById("createLobbyForm");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

function createLobby() {
  const name = document.getElementById("lobbyNameInput").value.trim();
  const maxPlayers = document.getElementById("maxPlayersInput").value;
  const color = document.getElementById("colorPicker").value;

  if (!name) {
    globalUI.showMessageScreen("Erreur", "Veuillez entrer un nom de lobby !");
    return;
  }

  sendServer({
    type: "createGame",
    maxPlayers: maxPlayers,
    creatorName: global.username,
    gameName: name,
    color: color,
  });

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  globalUI.showScreen("gameScreen");
}

function filterLobbies() {
  // Réinitialise la page quand on tape dans la recherche
  page = 1;
  renderLobbies();
}

function setReady() {
  if (global.readySent || !global.gameId) {
    return;
  }

  global.readySent = true;

  sendServer({
    type: "playerReady",
    username: global.username,
    gameId: global.gameId,
    ready: true,
  });
}

function joinGame(gameId) {
  const color = document.getElementById("colorPicker").value;
  sendServer({
    type: "joinGame",
    username: global.username,
    gameId: gameId,
    color: color || trailColor,
  });
}

function changePage(dir) {
  // Changer de page (précédent / suivant)
  page += dir;
  renderLobbies();
}

// === Fonctions utilitaires ===

async function renderLobbies(data) {
  if (data) allLobbies = data.lobbies || [];

  const search =
    document.getElementById("lobbySearchInput")?.value.toLowerCase() || "";
  const list = document.getElementById("lobbyList");
  const paginationControls = document.getElementById("paginationControls");

  list.innerHTML = "";
  paginationControls.innerHTML = "";

  // Filtrage simple par nom
  const filtered = allLobbies.filter((l) =>
    l.gameName.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p>Aucun lobby trouvé.</p>";
    return;
  }

  // Pagination simple
  const totalPages = Math.ceil(filtered.length / perPage);
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  const start = (page - 1) * perPage;
  const lobbiesToShow = filtered.slice(start, start + perPage);

  // Affichage des lobbies
  lobbiesToShow.forEach((lobby) => {
    list.innerHTML += `
      <div class="lobbyItem">
        <strong>${lobby.gameName}</strong><br>
        Joueurs : ${lobby.currentPlayers}/${lobby.maxPlayers}<br>
        <button class="joinGameBtn" data-id="${lobby.gameId}">Rejoindre</button>
      </div>
    `;
  });

  // Boutons précédent et suivant
  if (totalPages > 1) {
    paginationControls.innerHTML = `
      <button id="prevBtn" ${page === 1 ? "disabled" : ""}>←</button>
      <span>Page ${page}/${totalPages}</span>
      <button id="nextBtn" ${page === totalPages ? "disabled" : ""}>→</button>
    `;

    document.getElementById("prevBtn").onclick = () => changePage(-1);
    document.getElementById("nextBtn").onclick = () => changePage(1);
  }
}

function showCountdown(gameIdParam, count) {
  // A la place de "Prêt", on affiche le countdown dans le bouton ready
  let readyButton = document.getElementById("readyBtn");
  if (global.gameId == gameIdParam && count > 0) {
    readyButton.textContent = count + "...";
  } else if (count === 0) {
    readyButton.textContent = "Partez !";
  }
}

export default {
  handleUpdateLobbyInfos,
  handleGetAllLobbiesResponse,
  handleLeaveLobbyResponse,
  handlePlayerReadyResponse,
  handleCountdown,
  handleKickPlayer,
};

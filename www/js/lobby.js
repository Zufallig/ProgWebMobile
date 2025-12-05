import init from "./init.js";
import GameHandler from "./game.js";

let allLobbies = [];
let page = 1;
const perPage = 2;

document.getElementById("playBtn").onclick = goToLobby;
document.getElementById("toggleLobbyFormBtn").onclick = toggleLobbyForm;
document.getElementById("lobbyHomeBtn").onclick = init.goToHome;
document.getElementById("confirmCreateLobbyBtn").onclick = createLobby;
document.getElementById("lobbySearchInput").oninput = filterLobbies;
document.getElementById("readyBtn").onclick = setReady;
document.getElementById("quitBtn").onclick = init.leaveGameAndGoToHome;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("joinGameBtn")) {
    console.log("tentative de join");

    joinGame(e.target.dataset.id);
  }
});

function goToLobby() {
  init.sendServer({
    type: "getAllLobbies",
  });

  init.showScreen("lobbyScreen");
}

function toggleLobbyForm() {
  const form = document.getElementById("createLobbyForm");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

function setReady() {
  if (init.readySent || !init.gameId) {
    return;
  }

  init.readySent = true;

  init.sendServer({
    type: "playerReady",
    username: init.username,
    gameId: init.gameId,
    ready: true,
  });
}

function createLobby() {
  const name = document.getElementById("lobbyNameInput").value.trim();
  const maxPlayers = document.getElementById("maxPlayersInput").value;
  const color = document.getElementById("colorPicker").value; // M : ajout couleur

  if (!name) {
    init.showMessageScreen("Erreur", "Veuillez entrer un nom de lobby !");
    return;
  }

  init.sendServer({
    type: "createGame",
    maxPlayers: maxPlayers,
    creatorName: init.username,
    gameName: name,
    color: color, // M : envoi couleur
  });

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  init.showScreen("gameScreen");
}

function handlePlayerReadyResponse(data) {
  if (data.valid) {
    // Changer l'interface pour afficher joueur prêt
    let readyButton = document.getElementById("readyBtn");
    readyButton.textContent = "Prêt ! ";
    readyButton.style.backgroundColor = "#ff00ff";
    readyButton.style.color = "#111";
  } else {
    // Afficher une erreur
    init.showMessageScreen("Erreur", data.reason);
  }
}

function handleCountdown(data) {
  if (data.count === 3) {
    // Cacher le bouton pour quitter la partie
    console.log(document.getElementById("quitBtn"));
    document.getElementById("quitBtn").style.display = "none";
  }
  // Affiche le countdown dans la game
  showCountdown(init.gameId, data.count);

  // Démarrage de la partie
  if (data.count === 0) {
    GameHandler.startGame();
  }
}

function handleLeaveLobbyResponse(data) {
  if (!data.valid) {
    init.showMessageScreen("Erreur", data.reason);
  }
}

function handleKickPlayer() {
  init.showMessageScreen("Temps écoulé", "Vous avez été expulsé de la partie");
  init.showScreen("lobbyScreen");
}

function handleGetAllLobbiesResponse(data) {
  renderLobbies(data);
}

async function renderLobbies(data) {
  if (data) allLobbies = data.lobbies || [];

  const search =
    document.getElementById("lobbySearchInput")?.value.toLowerCase() || "";
  const list = document.getElementById("lobbyList");
  const pag = document.getElementById("paginationControls");

  list.innerHTML = "";
  pag.innerHTML = "";

  // --- filtrage simple par nom ---
  const filtered = allLobbies.filter((l) =>
    l.gameName.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p>Aucun lobby trouvé.</p>";
    return;
  }

  // --- pagination simple ---
  const totalPages = Math.ceil(filtered.length / perPage);
  if (page > totalPages) page = totalPages;
  if (page < 1) page = 1;

  const start = (page - 1) * perPage;
  const lobbiesToShow = filtered.slice(start, start + perPage);

  // --- affichage des lobbys ---
  lobbiesToShow.forEach((lobby) => {
    list.innerHTML += `
      <div class="lobbyItem">
        <strong>${lobby.gameName}</strong><br>
        Joueurs : ${lobby.currentPlayers}/${lobby.maxPlayers}<br>
        <button class="joinGameBtn" data-id="${lobby.gameId}">Rejoindre</button>
      </div>
    `;
  });

  // --- boutons Précédent / Suivant ---
  if (totalPages > 1) {
    pag.innerHTML = `
      <button onclick="changePage(-1)" ${
        page === 1 ? "disabled" : ""
      }>←</button>
      <span>Page ${page}/${totalPages}</span>
      <button onclick="changePage(1)" ${
        page === totalPages ? "disabled" : ""
      }>→</button>
    `;
  }
}

// change de page (précédent / suivant)
function changePage(dir) {
  page += dir;
  renderLobbies();
}

// réinitialise la page quand on tape dans la recherche
function filterLobbies() {
  page = 1;
  renderLobbies();
}

function joinGame(gameId) {
  const color = document.getElementById("colorPicker").value; // M : pareil ajout couleur

  init.sendServer({
    type: "joinGame",
    username: init.username,
    gameId: gameId,
    color: color || trailColor, // M : envoi de la couleur choisie
  });
}

function handleUpdateLobbyInfos(data) {
  init.sendServer({
    type: "getAllLobbies",
  });
}

function showCountdown(gameIdParam, count) {
  // A la place de "Prêt", on affiche le countdown dans le bouton ready
  let readyButton = document.getElementById("readyBtn");
  if (init.gameId == gameIdParam && count > 0) {
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

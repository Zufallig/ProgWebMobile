let gameId = "";
let allLobbies = [];
let page = 1;
const perPage = 2;

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

function goToLobby() {
  ws.send(
    JSON.stringify({
      type: "getAllLobbies",
    })
  );
  showScreen("lobbyScreen");
}

function toggleLobbyForm() {
  const form = document.getElementById("createLobbyForm");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

function createLobby() {
  const name = document.getElementById("lobbyNameInput").value.trim();
  const maxPlayers = document.getElementById("maxPlayersInput").value;
  const color = document.getElementById("colorPicker").value; // M : ajout couleur

  if (!name)
    return showMessageScreen("Erreur", "Veuillez entrer un nom de lobby !");

  ws.send(
    JSON.stringify({
      type: "createGame",
      maxPlayers: maxPlayers,
      creatorName: username,
      gameName: name,
      color: color, // M : envoi couleur
    })
  );

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  showScreen("gameScreen");
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
        <button onclick="joinGame('${lobby.gameId}')">Rejoindre</button>
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

  ws.send(
    JSON.stringify({
      type: "joinGame",
      username: username,
      gameId: gameId,
      color: color || trailColor, // M : envoi de la couleur choisie
    })
  );
}

async function getGameId(data) {
  if (data.valid && data.creatorName === username) {
    gameId = data.gameId;
  } else {
    return -1;
  }
}

function showCountdown(gameIdParam, count) {
  // A la place de "Prêt", on affiche le countdown dans le bouton ready
  let readyButton = document.getElementById("readyBtn");
  if (gameId == gameIdParam && count > 0) {
    readyButton.textContent = count + "...";
  } else if (count === 0) {
    readyButton.textContent = "Partez !";
  }
}

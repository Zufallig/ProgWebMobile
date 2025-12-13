let gameId = "";

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
  const color = "#00ffff"; // Couleur par défaut cyan

  if (!name) return showErrorScreen("Veuillez entrer un nom de lobby !");

  ws.send(
    JSON.stringify({
      creatorName: username,
      type: "createGame",
      maxPlayers: maxPlayers,
      gameName: name,
      color: color,
    })
  );

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  showScreen("gameScreen");
}

let allLobbies = [];
let page = 1;
const perPage = 2;

function renderLobbies(data) {
  if (data) allLobbies = data.lobbies || [];

  const search = document.getElementById("lobbySearchInput")?.value.toLowerCase() || "";
  const list = document.getElementById("lobbyList");
  const pag = document.getElementById("paginationControls");

  list.innerHTML = "";
  pag.innerHTML = "";

  // --- filtrage simple par nom ---
  const filtered = allLobbies.filter(l =>
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
  lobbiesToShow.forEach(lobby => {
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
      <button onclick="changePage(-1)" ${page === 1 ? "disabled" : ""}>←</button>
      <span>Page ${page}/${totalPages}</span>
      <button onclick="changePage(1)" ${page === totalPages ? "disabled" : ""}>→</button>
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
  const color = "#00ffff"; // Couleur par défaut cyan

  ws.send(
    JSON.stringify({
      type: "joinGame",
      username: username,
      gameId: gameId,
      color: color,
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

async function getGamesData(data) {
  if (data === undefined) {
    return null;
  }
  return data.lobbies;
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



function chooseColor(color) {
  if (!gameId) return;

  // Envoyer la demande au serveur
  ws.send(
    JSON.stringify({
      type: "ColorChange",
      username: username,
      color: color,
      gameId: gameId,
    })
  );
}

function updateBlockedColors(colorsTaken) {
  const colorBtns = document.querySelectorAll(".colorBtn");

  colorBtns.forEach(btn => {
    const color = btn.style.background;
    const colorHex = rgbToHex(color);

    // Vérifier si la couleur est prise par quelqu'un
    const takenBy = colorsTaken.find(c => c.color === colorHex);

    // Trouver le label correspondant
    const colorLabel = document.querySelector(`.colorLabel[data-color="${colorHex}"]`);

    if (takenBy) {
      // La couleur est prise
      
      // Si c'est la couleur de l'utilisateur actuel
      if (takenBy.username === username) {
        // Permettre de cliquer pour changer
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.border = "3px solid #fff";
        btn.style.boxShadow = "0 0 15px #fff";
        btn.style.transform = "scale(1.1)";
      } else {
        // Couleur prise par un autre joueur : désactiver
        btn.disabled = true;
        btn.style.opacity = "0.3";
        btn.style.cursor = "not-allowed";
        btn.style.border = "none";
        btn.style.boxShadow = "none";
        btn.style.transform = "scale(1)";
      }
      
      // Afficher le nom du joueur sous le bouton
      if (colorLabel) {
        colorLabel.textContent = takenBy.username;
        colorLabel.style.display = "block";
      }
    } else {
      // La couleur est disponible
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
      btn.style.border = "none";
      btn.style.boxShadow = "none";
      btn.style.transform = "scale(1)";
      
      // Cacher le label
      if (colorLabel) {
        colorLabel.textContent = "";
        colorLabel.style.display = "none";
      }
    }
  });
}

function rgbToHex(rgb) {
  if (rgb.startsWith('#')) return rgb;
  
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return rgb;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

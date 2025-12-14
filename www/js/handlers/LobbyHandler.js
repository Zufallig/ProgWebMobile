import { global, globalUI, sendServer } from "../global.js";
import GameHandler from "./GameHandler.js";

let allLobbies = [];
let page = 1;
const perPage = 2;

// === Ajout des event listeners liés au lobby ===

document.getElementById("playBtn").onclick = goToLobby;
document.getElementById("toggleLobbyFormBtn").onclick = toggleLobbyForm;
document.getElementById("lobbyHomeBtn").onclick = () =>
  globalUI.showScreen("homeScreen");
document.getElementById("confirmCreateLobbyBtn").onclick = createLobby;
document.getElementById("lobbySearchInput").oninput = filterLobbies;
document.getElementById("readyBtn").onclick = setReady;
document.getElementById("quitBtn").onclick = leaveLobbyAndGoToHome;
document.getElementById("cyanBtn").onclick = () => changeColor("#00ffff");
document.getElementById("pinkBtn").onclick = () => changeColor("#ff00ff");
document.getElementById("greenBtn").onclick = () => changeColor("#00ff00");
document.getElementById("yellowBtn").onclick = () => changeColor("#ffff00");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("joinGameBtn")) {
    joinGame(e.target.dataset.id);
  }
});

// === Fonctions handlers du lobby ===

// Demande la mise à jour des informations des lobbies courants
function handleUpdateLobbyInfos() {
  sendServer({
    type: "getAllLobbies",
  });
}

// Gère la mise à jour des informations des lobbies courants
function handleGetAllLobbiesResponse(data) {
  renderLobbies(data);
}

// Affiche un message d'erreur si quitter le lobby a entraîné une erreur
function handleLeaveLobbyResponse(data) {
  if (!data.valid) {
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

// Gère l'interface après le clic sur le bouton "Prêt"
function handlePlayerReadyResponse(data) {
  if (data.valid) {
    // Changer l'apparencedu bouton "Prêt" pour afficher que le joueur est prêt
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

// Affiche un message d'erreur si changer de couleur a entraîné une erreur
function handleChangeColorResponse(data) {
  if (!data.valid) {
    globalUI.showMessageScreen("Erreur", data.reason);
  }
}

// Gère l'interface après le démarrage du compte à rebours de la partie
function handleCountdown(data) {
  if (data.count === 3) {
  }
  // Affiche le countdown dans le bouton
  showCountdown(global.gameId, data.count);

  // Démarrage de la partie
  if (data.count === 0) {
    GameHandler.startGame();
  }
}

// Affiche un message d'erreur si le joueur est expulé de la partie pour avoir mis trop de temps à se mettre "Prêt"
function handleKickPlayer() {
  globalUI.showMessageScreen(
    "Temps écoulé",
    "Vous avez été expulsé de la partie"
  );
  globalUI.showScreen("lobbyScreen");
}

// === Fonctions d'interface onclick ===

// Renvoie le joueur sur la page des lobbies
function goToLobby() {
  sendServer({
    type: "getAllLobbies",
  });

  globalUI.showScreen("lobbyScreen");
}

// Demande de quitter le lobby
function leaveLobbyAndGoToHome() {
  sendServer({
    type: "leaveLobby",
    username: global.username,
    gameId: global.gameId,
  });

  globalUI.showScreen("homeScreen");
}

// Affiche la liste des lobbies
function toggleLobbyForm() {
  const form = document.getElementById("createLobbyForm");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

// Gère la création d'un lobby
function createLobby() {
  // On récupère les valeurs entrées
  const name = document.getElementById("lobbyNameInput").value.trim();
  const maxPlayers = document.getElementById("maxPlayersInput").value;

  if (!name) {
    globalUI.showMessageScreen("Erreur", "Veuillez entrer un nom de lobby !");
    return;
  }

  sendServer({
    type: "createGame",
    maxPlayers: maxPlayers,
    creatorName: global.username,
    gameName: name,
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

// Permet d'empêcher le spam des requêtes "Prêt"
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

// Gère quand le joueur rejoint une partie
function joinGame(gameId) {
  sendServer({
    type: "joinGame",
    username: global.username,
    gameId: gameId,
  });
}

// Changer de page (précédent / suivant)
function changePage(dir) {
  page += dir;
  renderLobbies();
}

// Le joueur clique sur une couleur
function changeColor(color) {
  if (!global.gameId) return;

  // Demander la couleur choisie au serveur
  sendServer({
    type: "changeColor",
    username: global.username,
    color: color,
    gameId: global.gameId,
  });
}

// === Fonctions utilitaires ===

// Gère la création d'un élément HTML lobby
async function renderLobbies(data) {
  if (data) allLobbies = data.lobbies || [];

  // On regarde si le joueur a tapé quelque chose dans la barre de recherche
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

// Met à jour le bouton d'affichage du compte à rebours
function showCountdown(gameIdParam, count) {
  // A la place de "Prêt", on affiche le countdown dans le bouton ready
  let readyButton = document.getElementById("readyBtn");
  if (global.gameId == gameIdParam && count > 0) {
    readyButton.textContent = count + "...";
  } else if (count === 0) {
    readyButton.textContent = "Partez !";
  }
}

// Mise à jour des couleurs disponibles et indisponibles
function handleUpdateColor(data) {
  let colorsTaken = data.colorsTaken;
  const colorBtns = document.querySelectorAll(".colorBtn");

  colorBtns.forEach((btn) => {
    const colorHex = btn.dataset.color;

    // Vérifier si la couleur est prise par quelqu'un
    const takenBy = colorsTaken.find((c) => c.color === colorHex);

    // Trouver le label correspondant
    const colorLabel = document.querySelector(
      `.colorLabel[data-color="${colorHex}"]`
    );

    if (takenBy) {
      // La couleur est prise

      // Si c'est la couleur de l'utilisateur actuel
      if (takenBy.username === global.username) {
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

export default {
  handleUpdateLobbyInfos,
  handleGetAllLobbiesResponse,
  handleLeaveLobbyResponse,
  handlePlayerReadyResponse,
  handleUpdateColor,
  handleChangeColorResponse,
  handleCountdown,
  handleKickPlayer,
};

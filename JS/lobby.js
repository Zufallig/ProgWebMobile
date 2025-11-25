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
      playerId: id,
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

  if (!name) return alert("Veuillez entrer un nom de lobby !");

  ws.send(
    JSON.stringify({
      type: "createGame",
      maxPlayers: maxPlayers,
      creatorId: id,
      gameName: name,
      color: color, // M : envoi couleur
    })
  );

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  showScreen("gameScreen");
}

async function renderLobbies(data) {
  console.log("Entrée dans renderLobbies");
  let gamesArray = await getGamesData(data);

  if (!gamesArray) return;

  const list = document.getElementById("lobbyList");
  list.innerHTML = "";

  console.log("GAMESARRAY : " + gamesArray);

  if (gamesArray.length === 0) {
    list.innerHTML = "<p>Aucun lobby créé pour le moment.</p>";
    return;
  }

  gamesArray.forEach((lobby) => {
    const div = document.createElement("div");
    div.className = "lobbyItem";
    div.innerHTML = `
        <strong>${lobby.gameName}</strong><br>
        Joueurs: ${lobby.currentPlayers}/${lobby.maxPlayers}<br>
        <button onclick="joinGame('${lobby.gameId}')">Rejoindre le lobby</button>
    `;
    list.appendChild(div);
  });
}

function joinGame(gameId) {
  console.log("Tentative de rejoindre la partie :", gameId);
  const color = document.getElementById("colorPicker").value; // M : pareil ajout couleur

  ws.send(
    JSON.stringify({
      type: "joinGame",
      playerId: id,
      gameId: gameId,
      color: color, // M : envoi de la couleur choisie
    })
  );
}

async function getGameId(data) {
  if (data.valid && data.creatorId === id) {
    gameId = data.gameId;
  } else {
    alert(data.reason);
    return -1;
  }
}

async function getGamesData(data) {
  if (data === undefined) {
    return null;
  }
  console.log("Lobbies: " + data.lobbies);
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

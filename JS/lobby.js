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
  renderLobbies();
}

function toggleLobbyForm() {
  const form = document.getElementById("createLobbyForm");
  form.style.display = form.style.display === "flex" ? "none" : "flex";
}

function createLobby() {
  const name = document.getElementById("lobbyNameInput").value.trim();
  const maxPlayers = document.getElementById("maxPlayersInput").value;

  if (!name) return alert("Veuillez entrer un nom de lobby !");

  ws.send(
    JSON.stringify({
      type: "createGame",
      maxPlayers: maxPlayers,
      creatorId: id,
      gameName: name,
    })
  );

  document.getElementById("lobbyNameInput").value = "";
  toggleLobbyForm();
  showScreen("gameScreen");
}

async function renderLobbies() {
  console.log("entré dans render lobby");
  // pourquoi ça print 2 fois?
  try {
    let gamesArray = await getGamesData();
    console.log("games array", gamesArray);

    if (gamesArray === null) {
      return;
    }
    const list = document.getElementById("lobbyList");
    list.innerHTML = "";
    if (gamesArray.length === 0) {
      list.innerHTML = "<p>Aucun lobby créé pour le moment.</p>";
      return;
    }
    console.log("GAMES_ARRAY ", gamesArray);
    // On affiche chaque lobby courant
    gamesArray.forEach((lobby) => {
      const div = document.createElement("div");
      div.className = "lobbyItem";
      div.innerHTML = `
		<strong>${lobby.gameName}</strong><br>
		Joueurs: ${lobby.currentPlayers}/${lobby.maxPlayers}<br>
		<button onclick="joinGame(${lobby.gameId})">Rejoindre le lobby</button>
	  `;
      list.appendChild(div);
    });
  } catch (e) {
    console.log(e);
  }
}

function joinGame(gameId) {}

async function getGameId(data) {
  if (data.valid) {
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
  console.log("entre dans game data");
  console.log(data.lobbies);
  return data.lobbies;
}

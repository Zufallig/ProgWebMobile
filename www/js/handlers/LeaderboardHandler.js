import { globalUI, sendServer } from "../global.js";

// === Ajout des event listeners liés au classement ===

document.getElementById("leaderboardBtn").onclick = goToLeaderboard;
document.getElementById("leaderboardHomeBtn").onclick = globalUI.goToHome;

// === Fonction handler du classement ===

function handleGetLeaderboardResponse(data) {
  if (!data.valid) {
    globalUI.showMessageScreen("Erreur", data.reason);
    return;
  }

  let playersArray = data.players;
  if (!playersArray) {
    return;
  }
  const list = document.getElementById("playerList");
  list.innerHTML = "#. Nom ( V / D )";

  if (playersArray.length === 0) {
    list.innerHTML = "<p>Pas de classement disponible pour le moment.</p>";
    return;
  }

  playersArray.forEach((player, number) => {
    const p = document.createElement("p");
    p.className = "playerItem";
    p.innerHTML = `
        ${number + 1}. <strong class="playerName">${player.username}</strong> 
        ( ${player.wins} / ${player.losses} )<br>
    `;
    list.appendChild(p);
  });
}

// === Fonction d'interface onclick ===

function goToLeaderboard() {
  // Le client clique sur le classement
  sendServer({
    type: "getLeaderboard",
  });

  globalUI.showScreen("leaderboardScreen");
}

export default { handleGetLeaderboardResponse };

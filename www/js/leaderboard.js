import init from "./init.js";

document.getElementById("leaderboardBtn").onclick = goToLeaderboard;
document.getElementById("leaderboardHomeBtn").onclick = init.goToHome;
function goToLeaderboard() {
  // Le client clique sur le classement
  init.sendServer({
    type: "getLeaderboard",
  });
  init.showScreen("leaderboardScreen");
}

function handleGetLeaderboardResponse(data) {
  if (!data.valid) {
    init.showMessageScreen("Erreur", data.reason);
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

export default { handleGetLeaderboardResponse };

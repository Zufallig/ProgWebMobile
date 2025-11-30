function goToLeaderboard() {
  ws.send(
    JSON.stringify({
      type: "getLeaderboard",
    })
  );
  showScreen("leaderboardScreen");
}

function renderLeaderboard(playersData) {
  let playersArray = playersData;
  console.log(playersArray);
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

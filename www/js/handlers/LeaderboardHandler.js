import { globalUI, sendServer } from "../global.js";

// === Ajout des event listeners liés au classement ===

document.getElementById("leaderboardBtn").onclick = goToLeaderboard;
document.getElementById("leaderboardHomeBtn").onclick = () =>
  globalUI.showScreen("homeScreen");

// === Fonction handler du classement ===

// Gère l'affichage de l'interface après un clic sur le bouton "Classement"
function handleGetLeaderboardResponse(data) {
  if (!data.valid) {
    globalUI.showMessageScreen("Erreur", data.reason);
    return;
  }

  // On récupère les informations sur les joueurs (nom, nombre de victoires, nombre de défaites)
  let playersArray = data.players;

  const list = document.getElementById("playerList");

  if (playersArray.length === 0) {
    list.innerHTML = "<p>Pas de classement disponible pour le moment.</p>";
    return;
  }

  list.innerHTML = "<p># <strong class='playerName'>Nom</strong> ( V / D )</p>";

  // On affiche les stats des joueurs en HTML
  playersArray.forEach((player, number) => {
    const p = document.createElement("p");
    p.className = "playerItem";
    p.innerHTML = `
        #${number + 1} <strong class="playerName">${player.username}</strong> 
        ( ${player.wins} / ${player.losses} )<br>
    `;
    list.appendChild(p);
  });
}

// === Fonction d'interface onclick ===

// Renvoie le client sur la page de classement
function goToLeaderboard() {
  sendServer({
    type: "getLeaderboard",
  });

  globalUI.showScreen("leaderboardScreen");
}

export default { handleGetLeaderboardResponse };

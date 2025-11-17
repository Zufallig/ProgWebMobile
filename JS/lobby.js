function showScreen(id){
	document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
	document.getElementById(id).style.display = 'flex';
}

function goToLobby(){
	showScreen('lobbyScreen');
	renderLobbies();
}

function toggleLobbyForm(){
	const form = document.getElementById('createLobbyForm');
	form.style.display = (form.style.display === 'flex') ? 'none' : 'flex';
	}

	function createLobby(){
	const name = document.getElementById('lobbyNameInput').value.trim();
	const maxPlayers = document.getElementById('maxPlayersInput').value;
	if(!name) return alert("Veuillez entrer un nom de lobby !");
	lobbies.push({ id: Date.now(), name, maxPlayers, players: [username] });
	document.getElementById('lobbyNameInput').value = "";
	toggleLobbyForm();
	renderLobbies();
	showScreen('gameScreen');
	}

	function renderLobbies(){
	const list = document.getElementById('lobbyList');
	list.innerHTML = "";
	if(lobbies.length === 0){
	  list.innerHTML = "<p>Aucun lobby créé pour le moment.</p>";
	  return;
	}
	lobbies.forEach(lobby => {
	  const div = document.createElement('div');
	  div.className = 'lobbyItem';
	  div.innerHTML = `
		<strong>${lobby.name}</strong><br>
		Joueurs: ${lobby.players.length}/${lobby.maxPlayers}<br>
		<button onclick="showScreen('gameScreen')">Rejoindre</button>
	  `;
	  list.appendChild(div);
	});
	}
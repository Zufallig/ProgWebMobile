let username = "";
let id = "";
let lobbies = [];

//Fonction permettant le login ou la création d'un utilisateur
function validateLogin() {
  const user = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  if (user && pass) {
    username = user;

    ws.send(
      JSON.stringify({
        type: "connectionPlayer",
        username: user,
        password: pass,
      })
    );

    document.getElementById("usernameDisplay").textContent = user;
    document.getElementById(
      "connectedUser"
    ).textContent = `Connecté en tant que ${user}`;
    console.log("connexion pw ");
    //     if (isPasswordValid) {
    //     }
    //   } else {
    //     alert("Entrez un login et un mot de passe");
  }
}

async function checkValid(data) {
  if (data.valid) {
    id = data.playerId;
    showScreen("homeScreen");
  } else {
    // mettre un msg d'erreur
    alert("mdp invalide");
  }
}

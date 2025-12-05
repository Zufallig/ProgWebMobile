let username = "";

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
  }
}

async function checkValid(data) {
  if (data.valid) {
    showScreen("homeScreen");
  } else {
    // Message d'erreur
    showMessageScreen("Erreur", "Mot de passe invalide");
  }
}

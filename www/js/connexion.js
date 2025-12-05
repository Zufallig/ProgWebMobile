import init from "./init.js";

// Mise en place des fonctions sur les boutons
document.getElementById("loginBtn").onclick = validateLogin;

// Fonction permettant la connexion ou la création d'un utilisateur
function validateLogin() {
  const user = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  if (user && pass) {
    init.username = user;

    init.sendServer({
      type: "connectionPlayer",
      username: user,
      password: pass,
    });

    document.getElementById("usernameDisplay").textContent = user;
    document.getElementById(
      "connectedUser"
    ).textContent = `Connecté en tant que ${user}`;
  }
}

async function handleConnectionResponse(data) {
  if (data.valid) {
    init.showScreen("homeScreen");
  } else {
    // Message d'erreur
    init.showMessageScreen("Erreur", "Mot de passe invalide");
  }
}

export default { handleConnectionResponse };

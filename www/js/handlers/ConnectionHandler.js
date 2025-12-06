import { global, globalUI, sendServer } from "../global.js";

// Mise en place des fonctions sur les boutons
document.getElementById("loginBtn").onclick = validateLogin;

// Fonction permettant la connexion ou la création d'un utilisateur
function validateLogin() {
  const user = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  if (user && pass) {
    global.username = user;

    sendServer({
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
    globalUI.goToHome();
  } else {
    // Message d'erreur
    globalUI.showMessageScreen("Erreur", "Mot de passe invalide");
  }
}

export default { handleConnectionResponse };

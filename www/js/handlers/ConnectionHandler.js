import { global, globalUI, sendServer } from "../global.js";

// Mise en place des event listeners liés à la connexion
document.getElementById("loginBtn").onclick = validateLogin;

// Permet de sauvegarder le mot de passe en localStorage
window.addEventListener("load", () => {
  const saved = localStorage.getItem("savedPassword");

  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    if (Date.now() < data.expireAt) {
      document.getElementById("passwordInput").value = data.password;
    } else {
      localStorage.removeItem("savedPassword");
    }
  } catch {
    localStorage.removeItem("savedPassword");
  }
});

// === Fonction handler de la connexion

// Gère l'affichage de l'interface après la tentative de connexion d'un client
async function handleConnectionResponse(data) {
  if (data.valid) {
    // Sauvegarde du mot de passe pendant 5 minutes
    const pass = document.getElementById("passwordInput").value.trim();
    localStorage.setItem(
      "savedPassword",
      JSON.stringify({
        password: pass,
        expireAt: Date.now() + 5 * 60 * 1000,
      })
    );

    // On affiche le nom dans l'interface de jeu
    document.getElementById("usernameDisplay").textContent = global.username;
    document.getElementById(
      "connectedUser"
    ).textContent = `Connecté en tant que ${global.username}`;

    globalUI.showScreen("homeScreen");
  } else {
    // Message d'erreur
    globalUI.showMessageScreen("Erreur", "Mot de passe invalide");
  }
}

// === Fonction d'interface onclick ===

// Fonction demandant la connexion ou la création d'un utilisateur au serveur
function validateLogin() {
  const user = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();
  if (!user || !pass) {
    globalUI.showMessageScreen(
      "Erreur",
      "Entrez un identifiant et un mot de passe"
    );
    return;
  }

  global.username = user;

  sendServer({
    type: "connectionPlayer",
    username: user,
    password: pass,
  });
}

export default { handleConnectionResponse };

let username = "";

// Restaure le mot de passe s'il n'a pas expiré
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

// Envoie la demande de connexion au serveur
function validateLogin() {
  const user = document.getElementById("loginInput").value.trim();
  const pass = document.getElementById("passwordInput").value.trim();

  if (!user || !pass) {
    showErrorScreen("Entrez un login et un mot de passe");
    return;
  }

  username = user;

  ws.send(JSON.stringify({
    type: "connectionPlayer",
    username: user,
    password: pass
  }));
}

// Réception de la réponse du serveur
async function checkValid(data) {
  if (data.valid) {

    // Sauvegarde du mot de passe 5 minutes
    const pass = document.getElementById("passwordInput").value.trim();
    localStorage.setItem("savedPassword", JSON.stringify({
      password: pass,
      expireAt: Date.now() + 5 * 60 * 1000
    }));

    document.getElementById("usernameDisplay").textContent = username;
    document.getElementById("connectedUser").textContent =
      `Connecté en tant que ${username}`;

    showScreen("homeScreen");

  } else {
    showErrorScreen("Mot de passe invalide");
  }
}

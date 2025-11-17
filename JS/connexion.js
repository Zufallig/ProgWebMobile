let username = "";
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
    showScreen("homeScreen");

    return user, pass;
  } else {
    alert("Entrez un login et un mot de passe");
  }
}

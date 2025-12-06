// === Variables et fonctions globales ===

// Variables globales
export const global = {
  ws: null,
  username: "",
  gameId: "",
  readySent: false,
};

// Fonctions globales d'interface utilisateur
export const globalUI = {
  showScreen,
  showMessageScreen,
  closeMessageScreen,
  goToHome,
};

// Fonction pour simplifier l'envoi de requêtes
export function sendServer(data) {
  global.ws.send(JSON.stringify(data));
}

// Fonction pour afficher un seul écran et fermer les autres
function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => (s.style.display = "none"));
  document.getElementById(id).style.display = "flex";
}

// Fonction pour afficher un message dans un modal (par défaut, une erreur)
function showMessageScreen(title, message) {
  document.getElementById("messageScreen").style.display = "block";
  document.getElementById("messageTitle").textContent = title || "Erreur";
  document.getElementById("messageText").textContent =
    message || "Une erreur est survenue";
}

// Fonction pour fermer un message ouvert
function closeMessageScreen() {
  document.getElementById("messageScreen").style.display = "none";
}

// Fonction de retour à l'accueil
function goToHome() {
  document.getElementById("gameEndedScreen").style.display = "none";
  showScreen("homeScreen");
}

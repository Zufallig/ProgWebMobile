import { global, globalUI } from "./global.js";

// === Initialisation côté client ===

export function init() {
  // On initialise le websocket
  global.ws = new WebSocket("ws://localhost:9898/");

  // On place l'event listener pour l'affichage UI des messages du serveur
  document.getElementById("messageScreenBtn").onclick =
    globalUI.closeMessageScreen;
}

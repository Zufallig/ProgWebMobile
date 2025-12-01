//Fonction de controle
document.addEventListener("keydown", (e) => {
  const movements = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  };

  const dir = movements[e.key];

  if (!dir) {
    // On ignore les touches qui ne sont pas up, down, left, right
    return;
  }

  if (gameId !== "") {
    // On n'écoute les mouvements que lorsque le joueur est dans une partie
    ws.send(
      JSON.stringify({
        type: "playerMovement",
        username: username,
        gameId: gameId,
        direction: dir,
      })
    );
  }
});

function setDirection(dir) {
  if (gameId !== "") {
    // On n'écoute les mouvements que lorsque le joueur est dans une partie
    ws.send(
      JSON.stringify({
        type: "playerMovement",
        username: username,
        gameId: gameId,
        direction: dir,
      })
    );
  }
}

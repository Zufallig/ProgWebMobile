//Fonction de controle 
document.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && dy !== gridSize) { dx = 0; dy = -gridSize; }
      if (e.key === 'ArrowDown' && dy !== -gridSize) { dx = 0; dy = gridSize; }
      if (e.key === 'ArrowLeft' && dx !== gridSize) { dx = -gridSize; dy = 0; }
      if (e.key === 'ArrowRight' && dx !== -gridSize) { dx = gridSize; dy = 0; }
    });

    function setDirection(dir){
      if(dir === 'up' && dy !== gridSize) { dx = 0; dy = -gridSize; }
      if(dir === 'down' && dy !== -gridSize) { dx = 0; dy = gridSize; }
      if(dir === 'left' && dx !== gridSize) { dx = -gridSize; dy = 0; }
      if(dir === 'right' && dx !== -gridSize) { dx = gridSize; dy = 0; }
    }
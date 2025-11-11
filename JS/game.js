    /* -----------------------------
       DÉMARRER / REJOUER LE JEU
    ----------------------------- */
    let svgCanvas, x = 1, y = 1, dx = 6, dy = 0;
    const gridSize = 6;
    const canvasWidth = 300, canvasHeight = 300;
    let trail = [], score = 0, tickInterval = 40;
    let trailColor = "#00ffff";

    function restartGame(){
      document.getElementById('gameOverScreen').style.display = 'none';
      startGame();
    }

    function startGame(){
      svgCanvas = document.getElementById('svgCanvas');
      trailColor = document.getElementById('colorPicker').value;
      svgCanvas.innerHTML = '';
      x = 1; y = 1; dx = gridSize; dy = 0;
      trail = []; score = 0;

      document.getElementById('scoreDisplay').textContent = "Score: 0";
      showScreen('gameScreen');
      document.getElementById('globalMobileControls').style.display = 'flex';

      clearInterval(window.loop);
      window.loop = setInterval(tick, tickInterval);
    }

    /* -----------------------------
       MISE À JOUR DU JEU
    ----------------------------- */
    function tick(){
      x += dx / gridSize;
      y += dy / gridSize;

      // Collision murs ou soi-même
      if (x < 0 || y < 0 || x >= canvasWidth / gridSize || y >= canvasHeight / gridSize) return gameOver();
      for (let seg of trail) {
        if (Math.round(seg.x) === Math.round(x) && Math.round(seg.y) === Math.round(y)) return gameOver();
      }

      trail.push({ x, y, alpha: 1 });
      score++;
      document.getElementById('scoreDisplay').textContent = "Score: " + score;

      svgCanvas.innerHTML = '';
	for (let seg of trail) {
	  let rect = createSvgElement('rect', {
		x: seg.x * gridSize,
		y: seg.y * gridSize,
		width: gridSize,
		height: gridSize,
		fill: trailColor
	  });
	  svgCanvas.appendChild(rect);
	}

      let circle = createSvgElement('circle', {
        cx: x * gridSize + gridSize/2,
        cy: y * gridSize + gridSize/2,
        r: gridSize/2,
        fill: 'white',
        stroke: trailColor,
        'stroke-width': 3
      });
      svgCanvas.appendChild(circle);
    }

    /* -----------------------------
       FIN DE PARTIE
    ----------------------------- */
    function gameOver(){
      clearInterval(window.loop);
      svgCanvas.innerHTML = '';
      trail = [];
      document.getElementById('finalScoreText').textContent = "Ton score : " + score;
      document.getElementById('gameOverScreen').style.display = 'block';
      document.getElementById('globalMobileControls').style.display = 'none';
    }

    /* -----------------------------
       OUTILS
    ----------------------------- */
    function createSvgElement(tag, attrs){
      const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (let attr in attrs) el.setAttribute(attr, attrs[attr]);
      return el;
    }

    function trailColorToRGBA(hex, alpha){
      let r = parseInt(hex.slice(1,3),16),
          g = parseInt(hex.slice(3,5),16),
          b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    
function goToHome(){ 
  document.getElementById('gameOverScreen').style.display = 'none';
  showScreen('homeScreen');
}
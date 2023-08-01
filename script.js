const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Size of each grid cell

const gridCellSize = 20;

// Calc # of cells

const gridSizeX = math.floor(canvas.width / gridCellSize);
const gridSizeY = math.floor(canvas.height / gridCellSize);

const snake = {
    body: [{x: 5, y: 5}],
    direction: {x: 1, y: 0},
};

// Loop interval (ms)
const gameLoopInterval = 100;

setInterval(gameLoop, gameLoopInterval);

function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
}
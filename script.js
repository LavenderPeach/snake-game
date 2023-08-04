const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restart = document.getElementById('restart-btn');
let gameStarted = false
let gameOverAlertShown = false

// Size of each grid cell 
const gridCellSize = 20;

// Calc # of cells
const gridSizeX = Math.floor(canvas.width / gridCellSize);
const gridSizeY = Math.floor(canvas.height / gridCellSize);

// the snake
const snake = {
    body: [{x: 5, y: 5}],
    direction: {x: 0, y: 0},
};

// Food position
let food = generateRandomFoodPosition();

// game variables
let hasEatenFood = false;
let score = 0;

// function to reset game upon defeat
function resetGame() {
    snake.body = [{x: 5, y: 5}];
    snake.direction = {x: 0, y:0};
    hasEatenFood = false;
    score = 0;
    food = generateRandomFoodPosition();
    document.addEventListener('keydown', handleKeyPress);
    gameLoopId = setInterval(gameLoop, fixedSpeed);
}
// Generate random food position
function generateRandomFoodPosition() {
    const x = Math.floor(Math.random() * gridSizeX);
    const y = Math.floor(Math.random() * gridSizeY);
    return {x, y};
}

function drawGridLines() {
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridCellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridCellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// scoreboard update
function updateScoreboard() {
    const scoreboardElement = document.getElementById('scoreboard');
    scoreboardElement.textContent = 'Score: ' + score;
}

// Draw food on Canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridCellSize, food.y * gridCellSize, gridCellSize, gridCellSize);
}

// draw snake on canvas
function drawSnake() {
    ctx.fillStyle = 'green';
    snake.body.forEach((segment) => {
        ctx.fillRect(segment.x * gridCellSize, segment.y * gridCellSize, gridCellSize, gridCellSize);
    });
}
// Loop interval (ms)
const snakeSpeed = 6;
const fixedSpeed = 1 / snakeSpeed * 1000;
let lastMoveTime = Date.now();
let gameLoopId;
restart.addEventListener ('click', () => {
    resetGame();
    gameLoopId = setInterval(gameLoop, fixedSpeed);
});

 // respond to user input
function handleKeyPress(event){
    if (snake.direction === null) {
        gameLoopId = setInterval(gameLoop, fixedSpeed);
    }

    if (!gameStarted) {
        gameLoopId = setInterval(gameLoop, fixedSpeed);
        gameStarted = true
    }

    if (event.key === 'ArrowUp' && snake.direction.y !== 1) {
        snake.direction = {x: 0, y: -1};
    } else if (event.key === 'ArrowDown' && snake.direction.y !== -1) {
         snake.direction = {x: 0, y: 1};
    } else if (event.key === 'ArrowRight' && snake.direction.x !== -1) {
         snake.direction = {x: 1, y: 0};
    } else if (event.key === 'ArrowLeft' && snake.direction.x !== 1) {
       snake.direction = {x: -1, y: 0};
    }
 }
document.addEventListener('keydown', handleKeyPress);

// Game over function
function handleGameOver() {
    if (!gameOverAlertShown) {
        alert('You are bad. Like... so bad. You scored ' + (snake.body.length - 1) + ' points. Think you can do any better?');
    }
    document.removeEventListener('keydown', handleKeyPress);
    resetGame();
}

gameLoopId = setInterval(gameLoop, fixedSpeed);

// INSIDE GAME LOOP
function gameLoop() {

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastMoveTime;
    if (timeElapsed >= fixedSpeed) {
        lastMoveTime = currentTime;
      
        // define head of snake and death when snake hits a boundary
       const headX = snake.body[0].x;
       const headY = snake.body[0].y;
       const hitBoundaryX = headX < 0 || headX >= gridSizeX;
       const hitBoundaryY = headY < 0 || headY >= gridSizeY;
       const suicide = snake.body.some((segment, index) => index !== 0 && segment.x === headX && segment.y === headY);
    
       if (snake.direction !== null) {
       const head = { ...snake.body[0]};
       head.x += snake.direction.x;
       head.y += snake.direction.y;
       snake.body.unshift(head);
   
       if(!hasEatenFood) {
           snake.body.pop();
       } else {
           hasEatenFood = false;
       }
   
       // update game if snake eats food
       if (head.x === food.x && head.y === food.y) {
           hasEatenFood = true;
           score++; // Increase score after snake eats
           updateScoreboard(); // update scoreboard
           food = generateRandomFoodPosition();
       }
   
       // check if game over condition is met
       if (hitBoundaryX || hitBoundaryY || suicide) {
           clearInterval(gameLoopId);
           handleGameOver();
           return;
       }
    }}
 
 
    // clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // draw snake + food on canvas
    drawFood();
    drawSnake();
    drawGridLines();
    // repeat loop
    requestAnimationFrame(gameLoop);
}


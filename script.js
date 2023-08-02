const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restart = document.getElementById('restart-btn');
const headX = snake.body[0].x;
const headY = snake.body[0].y;
const hitBoundaryX = headX < 0 || headX >= gridSizeX;
const hitBoundaryY = headY < 0 || headY >= gridSizeY;
const suicide = snake.body.some((segment, index) => index !== 0 && segment.x === headX && segment.y === headY);

// Size of each grid cell
const gridCellSize = 20;

// Calc # of cells
const gridSizeX = math.floor(canvas.width / gridCellSize);
const gridSizeY = math.floor(canvas.height / gridCellSize);

const snake = {
    body: [{x: 5, y: 5}],
    direction: {x: 1, y: 0},
};

function resetGame() {
    snake.body = [{x: 5, y: 5}];
    snake.direction = {x:1, y:0};
    hasEatenFood = false;
    score = 0;
    food = generateRandomFoodPosition();
    gameLoopId = setInterval(gameLoop, gameLoopInterval);
}
// Generate random food position.
function generateRandomFoodPosition() {
    const x = Math.floor(Math.random() * gridSizeX);
    const y = Math.floor(Math.random() * gridSizeY);
    return {x, y};
}
// Food position
let food = generateRandomFoodPosition();

// Draw food on Canvas
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridCellSize, food.y * gridCellSize, gridCellSize, gridCellSize);
}
// Loop interval (ms)
const gameLoopInterval = 100;
let gameLoopId;
restart-btn.addEventListener ('click', () => {

 // respond to user input
    function handleKeyPress(event){
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
})
function handleGameOver() {
    alert('You are so bad. Like... bad. You score ' + (snake.body.length - 1) + ' points. Think you can do any better?');
    document.removeEventListener('keydown', handleKeyPress);
}

gameLoopId = setInterval(gameLoop, gameLoopInterval);

// INSIDE GAME LOOP
function gameLoop() {
   

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

    // clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // draw snake + food on canvas
    drawFood();
    drawSnake();

    // repeat loop
    requestAnimationFrame(gameLoop);
}


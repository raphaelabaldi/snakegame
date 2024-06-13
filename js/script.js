const canvas = document.querySelector('canvas');
const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

const ctx = canvas.getContext("2d");
const audio = new Audio("../assets/audio.mp3");

const initialPosition = { x: 270, y: 240 }
const snakeBoxSize = 30;
let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

const randomNumber = ( min, max ) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - snakeBoxSize);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = { x: randomPosition(), y: randomPosition(), color: randomColor()};

let direction, loopId;

const drawFood = () => {
    const {x, y, color} = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, snakeBoxSize, snakeBoxSize);
    // zerar o blur após desenhar os retangulos, se não ele aplica blur no grid e na cobra também.
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index == snake.length -1){
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, snakeBoxSize, snakeBoxSize);
    });
}

const moveSnake = () => {
    if(!direction) return;

    const snakeHead = snake[snake.length -1];

    switch(direction){
        case "right":
            snake.push({ x: snakeHead.x + snakeBoxSize, y: snakeHead.y });
            break;

        case "left":
            snake.push({ x: snakeHead.x - snakeBoxSize, y: snakeHead.y });
            break;

        case "up":
            snake.push({ x: snakeHead.x, y: snakeHead.y - snakeBoxSize });
            break;

        case "down":
            snake.push({ x: snakeHead.x, y: snakeHead.y + snakeBoxSize });
            break;
    }
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

const checkEat = () => {
    const snakeHead = snake[snake.length -1];

    if (snakeHead.x == food.x && snakeHead.y == food.y) {
        incrementScore();
        snake.push(snakeHead);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        // para que a comida não seja gerada dentro da cobrinha, é verificado a posição. Caso a posição da comida e da cobra seja igual, ele gera uma nova posição dentro do canvas
        while(snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    };
}

const checkCollision = () => {
    const snakeHead = snake[snake.length - 1]
    const canvasLimit = canvas.width - snakeBoxSize
    const neckIndex = snake.length - 2

    const wallCollision = snakeHead.x < 0 || snakeHead.x > canvasLimit || snakeHead.y < 0 || snakeHead.y > canvasLimit;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == snakeHead.x && position.y == snakeHead.y
    })

    if (wallCollision || selfCollision) {
        gameOver();
    };
}

const gameOver = () => {
    direction = undefined;
    
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => { gameLoop() }, 300);
}

gameLoop();

document.addEventListener("keydown", ({key}) => {
   if (key === "ArrowRight" && direction != "left") {
    direction = "right"
   };

   if (key === "ArrowLeft" && direction != "right") {
    direction = "left"
   };

   if (key === "ArrowDown" && direction != "up") {
    direction = "down"
   };

   if (key === "ArrowUp" && direction != "down") {
    direction = "up"
   }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition]
})
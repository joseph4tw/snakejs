import { Snake } from './snake.js';
import { Sounds } from './sounds.js';

const canvas = document.getElementById('canvas');

if (!canvas.getContext) {
    console.warn('canvas element not supported - cannot run game');
}

const ctx = canvas.getContext('2d');

const sounds = new Sounds();
const snake = new Snake();
const snakePartSize = 10;
registerEventListeners();

const game = {
    gameOver: false,
    gameOverColors: {
        backgroundColor: '#ccc',
        snakeColor: '#555',
        snakeStrokeColor: '#ccc'
    },
    points: 0,
    apple: undefined,
    level: undefined,
    levels: [
        {
            index: 0,
            name: 1,
            speed: 300,
            backgroundColor: '#2e4057',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 1,
            name: 2,
            speed: 250,
            backgroundColor: '#2e4057',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 2,
            name: 3,
            speed: 200,
            backgroundColor: '#048ba8',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 3,
            name: 4,
            speed: 150,
            backgroundColor: '#048ba8',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 4,
            name: 5,
            speed: 100,
            backgroundColor: '#99c24d',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 5,
            name: 6,
            speed: 80,
            backgroundColor: '#99c24d',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 6,
            name: 7,
            speed: 60,
            backgroundColor: '#f18f01',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 7,
            name: 8,
            speed: 40,
            backgroundColor: '#f18f01',
            snakeColor: '#000',
            snakeStrokeColor: '#fff',
        },
        {
            index: 8,
            name: 9,
            speed: 30,
            backgroundColor: '#cb0000',
            snakeColor: '#fff',
            snakeStrokeColor: '#000',
        },
        {
            index: 9,
            name: 10,
            speed: 20,
            backgroundColor: '#990000',
            snakeColor: '#fff',
            snakeStrokeColor: '#000',
        },
    ],
};

game.level = game.levels[0];
game.apple = createNewApple(ctx, snake);
snake.setColors(game.level.snakeColor, game.level.snakeStrokeColor);

function startGame() {
    window.requestAnimationFrame(draw);
}

function draw() {
    if (!snake.canMove(ctx)) {
        game.gameOver = true;
        sounds.gameOver.play();
        return;
    }

    if (snake.canEatApple(game.apple)) {
        snake.eatApple(game.apple);
        game.apple = undefined;
        game.points += 10;
        console.log(`points: ${game.points}`);
        const appleSound = getRandomAppleSoundEffect();
        appleSound.play();

        if (canLevelUp(game)) {
            levelUp(game);
        }
    }

    if (!game.apple) {
        game.apple = createNewApple(ctx, snake);
    }

    snake.move();
    clearCanvas(ctx);
    snake.draw(ctx);
    drawApple(ctx, game.apple.x, game.apple.y);

    setTimeout(() => {
        window.requestAnimationFrame(draw);
    }, game.level.speed);
}

function clearCanvas(ctx) {
    ctx.fillStyle = game.level.backgroundColor;
    ctx.fillRect(0, 0, 300, 300);
}

function canLevelUp(game) {
    return (game.points % 50 === 0 && game.level.index < game.levels.length - 1);
}

function levelUp(game) {
    game.level = game.levels[++game.level.index];
    snake.setColors(game.level.snakeColor, game.level.snakeStrokeColor);
    playLevelUpSoundEffect(game.level.name);
    console.log(`level: ${game.level.name}`)
}

function createNewApple(ctx, snake) {
    const xSpots = ctx.canvas.width / snakePartSize - 2;
    const ySpots = ctx.canvas.height / snakePartSize - 2;
    // for now, keep it simple
    const x = Math.floor(Math.random() * xSpots + 1) * snakePartSize;
    const y = Math.floor(Math.random() * ySpots + 1) * snakePartSize;
    return {
        x,
        y,
    };

    // const totalSpots = (ctx.canvas.width * ctx.canvas.height) / snakePartSize;
    // const memoized = {};

    // while (true) {
    //     const randomX = Math.floor(Math.random() * ctx.canvas.width);
    //     const randomY = Math.floor(Math.random() * ctx.canvas.height);
        
    // }
}

function isSpotOccupied(snake, x, y) {
    for (let i = 0; i < snake.length; i++) {
        if (snake.x === x && snake.y === y) {
            return true;
        }
    }

    return false;
}

function drawApple(ctx, x, y) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, snakePartSize, snakePartSize);
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x, y, snakePartSize, snakePartSize);
}

function getRandomAppleSoundEffect() {
    const randomIndex = Math.floor(Math.random() * sounds.appleSounds.length);
    return sounds.appleSounds[randomIndex];
}

function playLevelUpSoundEffect(level) {
    sounds.levelUpSounds[level] && sounds.levelUpSounds[level].play();
}

function registerEventListeners() {
    document.addEventListener('keydown', (e) => {
        const code = e.code;
        if (code !== 'ArrowUp' && code !== 'ArrowRight' && code !== 'ArrowDown' && code !== 'ArrowLeft') {
            return;
        }

        snake.setNewDirection(code);
        e.preventDefault();
    });
}

export { startGame };

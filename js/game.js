import { Snake } from './snake.js';
import { Sounds } from './sounds.js';
import { Apples } from './apples.js';

const canvas = document.getElementById('canvas');
const scoreElem = document.getElementById('score');
const levelElem = document.getElementById('level');
const soundsBtn = document.getElementById('sounds');
const restartBtn = document.getElementById('restart');

if (!canvas.getContext) {
    console.warn('canvas element not supported - cannot run game');
}

const ctx = canvas.getContext('2d');

const sounds = new Sounds();
const snake = new Snake();
const snakePartSize = 20;
const apples = new Apples(ctx, snakePartSize);
registerEventListeners();
const soundSettingFromStorage = localStorage.getItem('sounds') !== null ? (localStorage.getItem('sounds').toLowerCase() === 'true') : true;

const game = {
    gameOver: false,
    soundsOn: soundSettingFromStorage,
    gameOverColors: {
        backgroundColor: '#ccc',
        snakeColor: '#555',
        appleColor: '#000'
    },
    points: 0,
    apple: undefined,
    level: undefined,
    levels: [
        {
            index: 0,
            name: 1,
            speed: 300,
            backgroundColor: '#395e66',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 1,
            name: 2,
            speed: 250,
            backgroundColor: '#387d70',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 2,
            name: 3,
            speed: 200,
            backgroundColor: '#32936f',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 3,
            name: 4,
            speed: 150,
            backgroundColor: '#26a96c',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 4,
            name: 5,
            speed: 100,
            backgroundColor: '#99c24d',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 5,
            name: 6,
            speed: 80,
            backgroundColor: '#eded4e',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 6,
            name: 7,
            speed: 60,
            backgroundColor: '#f0ae5d',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 7,
            name: 8,
            speed: 40,
            backgroundColor: '#f36b46',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 8,
            name: 9,
            speed: 30,
            backgroundColor: '#e93434',
            snakeColor: '#000',
            appleColor: '#000'
        },
        {
            index: 9,
            name: 10,
            speed: 20,
            backgroundColor: '#990000',
            snakeColor: '#fff',
            appleColor: '#fff'
        },
    ],
};

game.level = game.levels[0];
game.apple = apples.createNewApple(snake);
snake.setColor(game.level.snakeColor);
soundsBtn.textContent = `Sounds ${game.soundsOn ? 'On' : 'Off'}`;

function restartGame() {
    game.level = game.levels[0];
    game.points = 0;
    game.gameOver = false;
    snake.reset();
    game.apple = apples.createNewApple(snake);
    snake.setColor(game.level.snakeColor);
    updateLevelText();
    updateScoreText();
    startGame();
}

function startGame() {
    window.requestAnimationFrame(draw);
}

function draw() {
    if (!snake.canMove(ctx)) {
        game.gameOver = true;
        playSound(sounds.gameOver);
        return;
    }

    if (snake.canEatApple(game.apple)) {
        snake.eatApple(game.apple);
        game.apple = undefined;
        game.points += 10;
        updateScoreText();
        const appleSound = getRandomAppleSoundEffect();
        playSound(appleSound);

        if (canLevelUp(game)) {
            levelUp(game);
        }
    }

    if (!game.apple) {
        game.apple = apples.createNewApple(snake);
    }

    snake.move();
    clearCanvas(ctx);
    snake.draw(ctx);
    apples.draw(game.level.appleColor);

    setTimeout(() => {
        window.requestAnimationFrame(draw);
    }, game.level.speed);
}

function clearCanvas(ctx) {
    ctx.fillStyle = game.level.backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function canLevelUp(game) {
    return (game.points % 50 === 0 && game.level.index < game.levels.length - 1);
}

function levelUp(game) {
    game.level = game.levels[++game.level.index];
    snake.setColor(game.level.snakeColor);
    playLevelUpSoundEffect(game.level.name);
    updateLevelText();
}

function updateLevelText() {
    levelElem.textContent = game.level.name;
}

function updateScoreText() {
    scoreElem.textContent = game.points;
}

function getRandomAppleSoundEffect() {
    const randomIndex = Math.floor(Math.random() * sounds.appleSounds.length);
    return sounds.appleSounds[randomIndex];
}

function playLevelUpSoundEffect(level) {
    if (sounds.levelUpSounds[level]) {
        playSound(sounds.levelUpSounds[level]);
    };
}

function playSound(sound) {
    if (game.soundsOn) {
        sound.play();
    }
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

    soundsBtn.addEventListener('click', toggleSound);
    restartBtn.addEventListener('click', restartGame);

    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
}

let touchStart;

function handleStart(evt) {
    evt.preventDefault();
    touchStart = copyTouch(evt.changedTouches[0]);
}

function handleEnd(evt) {
    evt.preventDefault();
    const touchEnd = copyTouch(evt.changedTouches[0]);

    const xDiff = touchEnd.pageX - touchStart.pageX;
    const yDiff = touchEnd.pageY - touchStart.pageY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            snake.setNewDirection('ArrowRight');
        }
        else {
            snake.setNewDirection('ArrowLeft');
        }
    }
    else {
        if (yDiff > 0) {
            snake.setNewDirection('ArrowDown');
        }
        else {
            snake.setNewDirection('ArrowUp');
        }
    }
}

function handleCancel(evt) {
    touchStart = undefined;
}

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}

function toggleSound() {
    game.soundsOn = !game.soundsOn;
    localStorage.setItem('sounds', game.soundsOn);
    soundsBtn.textContent = `Sounds ${game.soundsOn ? 'On' : 'Off'}`;
}

export { startGame };

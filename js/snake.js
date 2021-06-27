function start() {
    const canvas = document.getElementById('canvas');

    if (!canvas.getContext) {
        console.warn('canvas element not supported - cannot run game');
        return;
    }

    const sounds = new Sounds();

    document.addEventListener('keydown', (e) => {
        const code = e.code;
        if (code !== 'ArrowUp' && code !== 'ArrowRight' && code !== 'ArrowDown' && code !== 'ArrowLeft') {
            return;
        }

        setNewDirection(code);
        e.preventDefault();
    });

    const ctx = canvas.getContext('2d');

    const snake = [
        { x: 30, y: 30 },
        { x: 20, y: 30 },
    ];
    const snakePartSize = 10;

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

    const moveAmount = snakePartSize;
    const directions = {
        left: 0,
        up: 1,
        right: 2,
        down: 3,
    };

    const directionsLinkedList = new CircularLinkedList();
    directionsLinkedList.append(directions.left);
    directionsLinkedList.append(directions.up);
    let currentDirection = directionsLinkedList.append(directions.right);
    directionsLinkedList.append(directions.down);

    window.requestAnimationFrame(draw);

    function draw() {
        if (game.gameOver) {
            ///return;
        }

        if (!canSnakeMove(snake[0], currentDirection.value)) {
            game.gameOver = true;
            sounds.gameOver.play();
            return;
        }

        if (canSnakeEatApple(snake[0], currentDirection.value, game.apple)) {
            snake.unshift({x: game.apple.x, y: game.apple.y});
            game.apple = undefined;
            game.points += 10;
            console.log(`points: ${game.points}`);
            const appleSound = getRandomAppleSoundEffect();
            appleSound.play();

            if (game.points % 50 === 0 && game.level.index < game.levels.length - 1) {
                // level up
                game.level = game.levels[++game.level.index];
                playLevelUpSoundEffect(game.level.name);
                console.log(`level: ${game.level.name}`)
            }
        }

        if (!game.apple) {
            game.apple = createNewApple(ctx, snake);
        }

        // move, then render
        // update body to follow head
        for (let i = snake.length - 1; i > 0; i--) {
            snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
        }
        // then move the head
        moveHead(snake[0], currentDirection.value);

        clearCanvas(ctx);
        drawApple(ctx, game.apple.x, game.apple.y);
        snake.forEach((part) => drawSnakePart(ctx, part.x, part.y));

        setTimeout(() => {
            window.requestAnimationFrame(draw);
        }, game.level.speed);
    }

    function clearCanvas(ctx) {
        ctx.fillStyle = game.level.backgroundColor;
        ctx.fillRect(0, 0, 300, 300);
    }

    // snake-related functions -------------------------------------------------------
    function drawSnakePart(ctx, x, y) {
        ctx.fillStyle = game.level.snakeColor;
        ctx.fillRect(x, y, snakePartSize, snakePartSize);
        ctx.strokeStyle = game.level.snakeStrokeColor;
        ctx.strokeRect(x, y, snakePartSize, snakePartSize);
    }

    function canSnakeMove(head, direction) {
        if (direction === directions.left) {
            if (head.x - moveAmount < 0) {
                return false;
            }
        }
        else if (direction === directions.up) {
            if (head.y - moveAmount < 0) {
                return false;
            }
        }
        else if (direction === directions.right) {
            if (head.x + moveAmount > ctx.canvas.width - snakePartSize) {
                return false;
            }
        }
        else if (direction === directions.down) {
            if (head.y + moveAmount > ctx.canvas.height - snakePartSize) {
                return false;
            }
        }

        return true;
    }

    function canSnakeEatApple(head, direction, apple) {
        if (direction === directions.left) {
            if (head.y === apple.y && head.x - moveAmount === apple.x) {
                return true;
            }
        }
        else if (direction === directions.up) {
            if (head.x === apple.x && head.y - moveAmount === apple.y) {
                return true;
            }
        }
        else if (direction === directions.right) {
            if (head.y === apple.y && head.x + moveAmount === apple.x) {
                return true;
            }
        }
        else if (direction === directions.down) {
            if (head.x === apple.x && head.y + moveAmount === apple.y) {
                return true;
            }
        }

        return false;
    }

    function moveHead(head, direction) {
        if (direction === directions.left) {
            head.x -= moveAmount;
        }
        else if (direction === directions.up) {
            head.y -= moveAmount;
        }
        else if (direction === directions.right) {
            head.x += moveAmount;
        }
        else if (direction === directions.down) {
            head.y += moveAmount;
        }
    }

    function setNewDirection(attemptedMove) {
        let requestedDirection;

        if (attemptedMove === 'ArrowUp') {
            requestedDirection = directions.up;
        }

        if (attemptedMove === 'ArrowRight') {
            requestedDirection = directions.right;
        }

        if (attemptedMove === 'ArrowDown') {
            requestedDirection = directions.down;
        }

        if (attemptedMove === 'ArrowLeft') {
            requestedDirection = directions.left;
        }

        if (currentDirection.prev.value === requestedDirection) {
            currentDirection = currentDirection.prev;
            return;
        }
        else if (currentDirection.next.value === requestedDirection) {
            currentDirection = currentDirection.next;
            return;
        }
    }
    // END snake-related functions ---------------------------------------------------

    // game-related functions --------------------------------------------------------
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
    // END game-related functions ----------------------------------------------------
}
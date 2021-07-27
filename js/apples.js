function Apples(ctx, gridItemSize) {
    const xPositions = ctx.canvas.width / gridItemSize;
    const yPositions = ctx.canvas.height / gridItemSize;
    this.ctx = ctx;
    this.gridItemSize = gridItemSize;
    this.grid = createGridTemplate(xPositions, yPositions, gridItemSize);
    this.getNewApplePosition = getNewApplePosition;
    this.apple = undefined;

    this.createNewApple = (snake) => {
        const position = getNewApplePosition(snake, this.grid);
        this.apple = Object.freeze({
            x: position.x,
            y: position.y,
        });

        return this.apple;
    };

    this.draw = (color) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.apple.x + 1, this.apple.y + 1, this.gridItemSize - 1, this.gridItemSize - 1);
    };
}

function createGridTemplate(xPositions, yPositions, gridItemSize) {
    const gridTemplate = [];

    for (let x = 0; x < xPositions; x++) {
        // don't add edges
        if (x === 0 || x === xPositions - 1) {
            continue;
        }

        for (let y = 0; y < yPositions; y++) {
            // don't add edges
            if (y === 0 || y === yPositions - 1) {
                continue;
            }

            gridTemplate.push(Object.freeze({
                x: (x * gridItemSize),
                y: (y * gridItemSize),
            }));
        }
    }

    return Object.freeze(gridTemplate);
}

const getNewApplePosition = (snake, grid) => {
    const gridCopy = [...grid];
    // since the snake body is smaller than the grid, we'll remove
    // occupied cells from the grid copy
    for (let i = 0; i < snake.body.length; i++) {
        const index = gridCopy.findIndex(({x, y}) => x === snake.body[i].x && y === snake.body[i].y);
        if (index !== -1) {
            gridCopy.splice(index, 1);
        }
    }

    const randomIndex = Math.floor(Math.random() * gridCopy.length);
    return gridCopy[randomIndex];
}

export { Apples };

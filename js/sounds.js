function Sounds() {
    const appleCrunch1 = document.querySelector('audio#apple-crunch-1');
    const appleCrunch2 = document.querySelector('audio#apple-crunch-2');
    const appleCrunch3 = document.querySelector('audio#apple-crunch-3');
    const appleCrunch4 = document.querySelector('audio#apple-crunch-4');

    this.appleSounds = [
        appleCrunch1,
        appleCrunch2,
        appleCrunch3,
        appleCrunch4
    ];

    const level2 = document.querySelector('audio#level2');
    const level3 = document.querySelector('audio#level3');
    const level4 = document.querySelector('audio#level4');
    const level5 = document.querySelector('audio#level5');
    const level6 = document.querySelector('audio#level6');
    const level7 = document.querySelector('audio#level7');
    const level8 = document.querySelector('audio#level8');
    const level9 = document.querySelector('audio#level9');
    const level10 = document.querySelector('audio#level10');

    this.levelUpSounds = {
        2: level2,
        3: level3,
        4: level4,
        5: level5,
        6: level6,
        7: level7,
        8: level8,
        9: level9,
        10: level10,
    };

    this.gameOver = document.querySelector('audio#game-over');
}

export { Sounds };

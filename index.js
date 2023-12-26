document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game after the DOM is fully loaded
    preloadImages().then(() => {
        resetBoard(); // Once all images are loaded, start/reset the game
    }).catch((error) => {
        console.error("Error loading images", error);
    });

    // Add event listener to the shuffle button
    document.getElementById('shuffleButton').addEventListener('click', resetBoard);
});

// Board configuration
const memBoardSize = 16;
const columns = Math.sqrt(memBoardSize);
const rows = memBoardSize / columns;

// Game state variables
let resetTimer;
let memoryBoard = [];
let firstTile = null;
let secondTile = null;
let score = 0;
let isWaiting = false;

// Set CSS variables for board layout
const root = document.documentElement;
root.style.setProperty('--num-columns', columns);
root.style.setProperty('--num-rows', rows);

// Function to create full image path
function createImagePath(path, alt) {
    return { src: basePath + path, alt: alt };
}

// Base path for images
const basePath = 'assets/pixel_art/Maygon Pack/';

// Image set for the memory game
const imageSet = [
    createImagePath('/Animals/Gray_Cat.png', 'cat'),
    createImagePath('/Balloon/Blue_Balloon.png', 'blue balloon'),
    createImagePath('/Food/Banana_1.png', 'banana'),
    createImagePath('/Items/Water_Bottle_1.png', 'water bottle'),
    createImagePath('/Trees/Purple_Tree_2.png', 'purple tree'),
    createImagePath('/Bomb_1.png', 'bomb'),
    createImagePath('/Animals/Lion.png', 'lion'),
    createImagePath('/Balloon/Pink_Balloon.png', 'pink balloon'),
];

// Preload all images before the game starts
function preloadImages() {
    let promises = imageSet.map(image => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = image.src;
        });
    });
    return Promise.all(promises);
}

// Initialize a new board
function newBoard() {
    imageSet.forEach((set) => {
        // Add each image twice for matching
        memoryBoard.push(set, set);
    });
    shuffleBoard(); // Shuffle the board
}

// Shuffle the memory board
function shuffleBoard() {
    memoryBoard.sort(() => Math.random() - 0.5);
}

let countdown;

// Reset and start a new game
function resetBoard() {
    memoryBoard = [];
    firstTile = null;
    secondTile = null;
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
    newBoard();
    renderNewBoard();
    clearTimeout(resetTimer); // Clear any existing game timer
    const resetTime = 180000; // Set game duration to 3 minutes
    resetTimer = setTimeout(resetBoard, resetTime);
    clearInterval(countdown);
    startTimer(180); // Start a new game timer
}

// Start a countdown timer for the game
function startTimer(duration) {
    let time = duration;
    document.getElementById('time').innerText = time;
    countdown = setInterval(() => {
        time--;
        document.getElementById('time').innerText = time;
        if (time <= 0) {
            clearInterval(countdown);
            endGame();
        }
    }, 1000);
}

// End the game when time is up
function endGame() {
    isWaiting = true;
    alert("Time's up! Game over!");
}

// Render the new board
function renderNewBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board

    // Create and append tiles to the board
    memoryBoard.forEach((image, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/background.png'; // Set default background image
        imageElement.classList.add('tile-image');
        tileElement.appendChild(imageElement);
        tileElement.dataset.index = index;

        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        boardElement.appendChild(tileElement);
    });
}

// Click handler for tiles
function tileClick(tile, index) {
    if (isWaiting) return; // Do nothing if waiting for tiles to flip back
    if (!firstTile) {
        firstTile = { tile, index };
        revealTile(tile);
    } else if (!secondTile && index !== firstTile.index) {
        secondTile = { tile, index };
        revealTile(tile);
        checkMatch();
    }
}

// Reveal a tile
function revealTile(tile) {
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[tile.dataset.index].src;
    tile.classList.add('flipped');
}

// Check if two tiles match
function checkMatch() {
    if (firstTile.index !== secondTile.index && memoryBoard[firstTile.index].src === memoryBoard[secondTile.index].src) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        firstTile = null;
        secondTile = null;
    } else {
        isWaiting = true;
        setTimeout(() => {
            hideTile(firstTile.tile);
            hideTile(secondTile.tile);
            firstTile = null;
            secondTile = null;
            isWaiting = false;
        }, 1000);
    }
}

// Hide a tile
function hideTile(tile) {
    const imgTile = tile.querySelector('.tile-image');
    imgTile.src = 'assets/background.png';
    tile.classList.remove('flipped');
}

// Start the game
resetBoard();

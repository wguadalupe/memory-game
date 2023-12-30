document.addEventListener('DOMContentLoaded', () => {
    Promise.all([preloadImages(imageSet), preloadImages(imageSet2)])
        .then(() => {
            resetBoard(); // Start/reset the game once all images are loaded
        })
        .catch(error => {
            console.error("Error loading images", error);
        });

    // Add event listener to the shuffle button
    document.getElementById('shuffleButton').addEventListener('click', resetBoard);
});

// Board configuration
const memBoardSize = 16;
const columns = Math.sqrt(memBoardSize);
const rows = memBoardSize / columns;
// Board configuration
const memBoardSize = 16;
const columns = Math.sqrt(memBoardSize);
const rows = memBoardSize / columns;

// Game state variables
// Game state variables
let resetTimer;
let memoryBoard = [];
let firstTile = null;
let memoryBoard = [];
let firstTile = null;
let secondTile = null;
let score = 0;
let score = 0;
let isWaiting = false;

// Set CSS variables for board layout
// Set CSS variables for board layout
const root = document.documentElement;
root.style.setProperty('--num-columns', columns);
root.style.setProperty('--num-rows', rows);

// Function to create full image path
function createImagePath(path, alt) {
    return { src: basePath + path, alt: alt };
}

// Base path for images
const basePath = 'assets/pixel_art/';

// Image set for the memory game
const imageSet = [
    createImagePath('Maygon Pack/Animals/Gray_Cat.png', 'cat'),
    createImagePath('Maygon Pack/Balloon/Blue_Balloon.png', 'blue balloon'),
    createImagePath('Maygon Pack/Food/Banana_1.png', 'banana'),
    createImagePath('Maygon Pack/Items/Water_Bottle_1.png', 'water bottle'),
    createImagePath('Maygon Pack/Trees/Purple_Tree_2.png', 'purple tree'),
    createImagePath('Maygon Pack/Bomb_1.png', 'bomb'),
    createImagePath('Maygon Pack/Animals/Lion.png', 'lion'),
    createImagePath('Maygon Pack/Balloon/Pink_Balloon.png', 'pink balloon'),
];

const imageSet2 = [
    createImagePath('Assets/wonderland/alice_newbground.png', 'alice'),
    createImagePath('Assets/wonderland/bishop_newbground.png', 'bishop'),
    createImagePath('Assets/wonderland/duece_newbground.png', 'duece'),
    createImagePath('Assets/wonderland/humpty_newbground.png', 'humpty'),
    createImagePath('Assets/wonderland/mad_hatter_newbground.png', 'mad hatter'),
    createImagePath('Assets/wonderland/king_of_hearts_newbground.png', 'king of hearts'),
    createImagePath('Assets/wonderland/queen_of_hearts_newbground.png','queen of hearts'),
    createImagePath('Assets/wonderland/rabbit_newbground.png', 'not quite white rabbit'),
];

// Preload all images before the game starts
function preloadImages(imageSet) {
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

// Preload images for both sets when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    Promise.all([preloadImages(imageSet), preloadImages(imageSet2)])
        .then(() => {
            resetBoard(); // Start/reset the game once all images are loaded
        })
        .catch(error => {
            console.error("Error loading images", error);
        });
    // ... rest of your code ...
});


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
let firstBoardCompleted = false; // Track if the first board is completed
let matchedPairs = 0; // Track the number of matched pairs

//reset score when starting a whole new game
function resetBoard() {
    memoryBoard = [];
    memoryBoard = [];
    firstTile = null;
    secondTile = null;
    matchedPairs = 0;
    if (!firstBoardCompleted) {
        score = 0;
        document.getElementById('score').innerText = 'Score: 0';
    }
    newBoard();
    renderNewBoard();
    clearTimeout(resetTimer);
    clearInterval(countdown);
    startTimer(180);
    resetTimer = setTimeout(() => endGame(true), 180000); // Pass true to indicate timeout
}

// Start a countdown timer for the game
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

function newSecondBoard() {
    imageSet2.forEach((set) => {
        // Add each image twice for matching
        memoryBoard.push(set, set);
    });
    shuffleBoard(); // Shuffle the board
}


// End the game when time is up or if a board is completed
function endGame(isTimeout) {
    isWaiting = true;
    clearInterval(countdown);

    if (firstBoardCompleted) {
        alert("Congratulations! You've completed the second board!");
        updateHighScore();
        resetGame();
    } else if (isTimeout) {
        alert("Time's up! Game over!");
        if (matchedPairs < memBoardSize / 2) {
            score = 0; // Reset score if time runs out
            document.getElementById('score').innerText = 'Score: 0';
        }
        firstBoardCompleted = false;
        updateHighScore();
    } else {
        alert("Congratulations! Moving to the second board.");
        firstBoardCompleted = true;
        newSecondBoard();
    }
}

function resetGame() {
    firstBoardCompleted = false;
    resetBoard();
}

function updateHighScore() {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        document.getElementById('highScore').innerText = `High Score: ${score}`;
    }
}


// Render the new board
function renderNewBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Clear the board

    // Create and append tiles to the board
    memoryBoard.forEach((image, index) => {
    // Create and append tiles to the board
    memoryBoard.forEach((image, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/background.png'; // Set default background image
        imageElement.src = 'assets/background.png'; // Set default background image
        imageElement.classList.add('tile-image');
        tileElement.appendChild(imageElement);
        tileElement.dataset.index = index;
        tileElement.dataset.index = index;

        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        boardElement.appendChild(tileElement);
        boardElement.appendChild(tileElement);
    });
}

// Click handler for tiles
// Click handler for tiles
function tileClick(tile, index) {
    if (isWaiting) return; // Do nothing if waiting for tiles to flip back
    if (isWaiting) return; // Do nothing if waiting for tiles to flip back
    if (!firstTile) {
        firstTile = { tile, index };
        firstTile = { tile, index };
        revealTile(tile);
    } else if (!secondTile && index !== firstTile.index) {
        secondTile = { tile, index };
        secondTile = { tile, index };
        revealTile(tile);
        checkMatch();
    }
}

// Reveal a tile
// Reveal a tile
function revealTile(tile) {
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[tile.dataset.index].src;
    img.src = memoryBoard[tile.dataset.index].src;
    tile.classList.add('flipped');
}


function checkMatch() {
    // Check if two selected tiles match
    if (firstTile.index !== secondTile.index && memoryBoard[firstTile.index].src === memoryBoard[secondTile.index].src) {
        // Increase score by one for a successful match
        score++;
        // Update the score display on the web page
        document.getElementById('score').innerText = 'Score: ' + score;
        // Increment the count of matched pairs
        matchedPairs++;
    // Check if all pairs on the board have been matched
    // The total number of pairs is half the memory board size
    // Check if it's the first board to transition to the second board after completion
        if (matchedPairs === memBoardSize / 2 && !firstBoardCompleted) {
            endGame(false); // Call endGame when the first board is completed
        }
        firstTile = null;
        secondTile = null;
    } else {
        isWaiting = true;
        setTimeout(() => {
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


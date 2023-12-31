document.addEventListener('DOMContentLoaded', () => {
    Promise.all([preloadImages(imageSet), preloadImages(imageSet2)])
        .then(() => {
            resetBoard(); // Start/reset the game once all images are loaded
        })
        .catch(error => {
            console.error("Error loading images", error);
        });

    document.getElementById('shuffleButton').addEventListener('click', resetBoard);
});

const memBoardSize = 16;
const columns = Math.sqrt(memBoardSize);
const rows = memBoardSize / columns;

let resetTimer;
let memoryBoard = [];
let firstTile = null;
let secondTile = null;
let score = 0;
let isWaiting = false;
let firstBoardCompleted = false; 
let matchedPairs = 0; 
let countdown;

const root = document.documentElement;
root.style.setProperty('--num-columns', columns);
root.style.setProperty('--num-rows', rows);

const basePath = 'assets/pixel_art/';
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

function createImagePath(path, alt) {
    return { src: basePath + path, alt: alt };
}

const basePath2 = 'assets/wonderland/';

const imageSet2 = [
    createImagePath2('alice_newbground.png', 'alice'),
    createImagePath2('bishop_newbground.png', 'bishop'),
    createImagePath2('duece_newbground.png', 'duece'),
    createImagePath2('humpty_newbground.png', 'humpty'),
    createImagePath2('mad_hatter_newbground.png', 'mad hatter'),
    createImagePath2('king_of_hearts_newbground.png', 'king of hearts'),
    createImagePath2('queen_of_hearts_newbground.png','queen of hearts'),
    createImagePath2('rabbit_newbground.png', 'not quite white rabbit'),
];

function createImagePath2(path, alt) {
    return { src: basePath2 + path, alt: alt };
}


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

function newBoard(imageSet) {
    memoryBoard = [];
    imageSet.forEach(set => {
        memoryBoard.push(set, set);
    });
    shuffleBoard();
}

function shuffleBoard() {
    memoryBoard.sort(() => Math.random() - 0.5);
}



function resetBoard() {
    firstTile = null;
    secondTile = null;
    matchedPairs = 0;
    if (!firstBoardCompleted) {
        score = 0;
        document.getElementById('score').innerText = 'Score: 0';
    }
    newBoard(imageSet);
    renderNewBoard();
    clearTimeout(resetTimer);
    clearInterval(countdown);
    startTimer(180);
    resetTimer = setTimeout(() => endGame(true), 180000);
}

function transitionToSecondBoard() {
    newBoard(imageSet2);
}

function startTimer(duration) {
    let time = duration;
    document.getElementById('time').innerText = time;
    countdown = setInterval(() => {
        if (--time <= 0) {
            clearInterval(countdown);
            endGame(true);
        } else {
            document.getElementById('time').innerText = time;
        }
    }, 1000);
}



function endGame(isTimeout) {
    isWaiting = true;
    clearInterval(countdown);

    if (isTimeout && !firstBoardCompleted) {
        alert("Time's up! Game over!");
        score = 0; // Reset score if time runs out on the first board
        document.getElementById('score').innerText = 'Score: 0';
        updateHighScore();
        resetGame();
    } else if (firstBoardCompleted) {
        // Handle end of second board or timeout on second board
        let message = isTimeout ? "Time's up! Game over!" : "Congratulations! You've completed the game!";
        alert(message);
        updateHighScore();
        resetGame();
    }
}

function resetGame() {
    firstBoardCompleted = false; // Reset this flag for a completely new game
    resetBoard();
}

function updateHighScore() {
    const highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        document.getElementById('highScore').innerText = `High Score: ${score}`;
    }
}

// Renders the new game board
function renderNewBoard() {
    // Accesses the board element in the HTML
    const boardElement = document.getElementById('board');
    // Clears any existing content in the board element
    boardElement.innerHTML = '';

    // Iterates over each image in the memoryBoard array
    memoryBoard.forEach((image, index) => {
        // Creates a new div element for each tile
        const tileElement = document.createElement('div');
        // Adds 'tile' class for styling
        tileElement.classList.add('tile');

        // Creates an img element for the tile
        const imageElement = document.createElement('img');
        // Sets the default image (hidden face of tile)
        imageElement.src = 'assets/background.png';
        // Adds 'tile-image' class for styling
        imageElement.classList.add('tile-image');

        // Appends the image element to the tile element
        tileElement.appendChild(imageElement);
        // Stores the index of the tile for later reference
        tileElement.dataset.index = index;
        // Adds a click event listener to each tile
        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        // Appends the tile element to the board element
        boardElement.appendChild(tileElement);
    });
}

// Handles the tile click event
function tileClick(tile, index) {
    // Prevents action if waiting for animation or if the same tile is clicked twice
    if (isWaiting || tile === firstTile) return;

    // Check if it's the first tile being clicked
    if (!firstTile) {
        // Sets the first tile and reveals it
        firstTile = tile;
        revealTile(tile, index);
    } else if (!secondTile) {
        // Sets the second tile, reveals it, and checks for a match
        secondTile = tile;
        revealTile(tile, index);
        checkMatch();
    }
}

// Reveals the face of the tile
function revealTile(tile, index) {
    // Selects the image element within the tile and sets its source to the actual image
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[index].src;
    // Adds 'flipped' class to show the tile face
    tile.classList.add('flipped');
}

// Checks if the two selected tiles match
function checkMatch() {
    // Compares the source of both selected tiles
    if (memoryBoard[firstTile.dataset.index].src === memoryBoard[secondTile.dataset.index].src) {
        // Increments the score for a match
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        // Increments the count of matched pairs
        matchedPairs++;

        // Checks if all pairs on the first board have been matched
        if (matchedPairs === memBoardSize / 2 && !firstBoardCompleted) {
            // Flag set to indicate completion of the first board
            firstBoardCompleted = true;
            // Resets matched pairs count for the second board
            matchedPairs = 0;

            // Waits 1 second before transitioning to the second board
            setTimeout(() => {
                alert("Congratulations! Moving to the second board.");
                transitionToSecondBoard();
                renderNewBoard();
                resetTimerForNewBoard(); // Resets and restarts the timer for the second board
            }, 1000);
        }
        // Resets the selected tiles
        firstTile = secondTile = null;
    } else {
        // Waits 1 second and then hides both tiles if they don't match
        isWaiting = true;
        setTimeout(() => {
            hideTile(firstTile);
            hideTile(secondTile);
            firstTile = secondTile = null;
            isWaiting = false;
        }, 1000);
    }
}

// Transitions to the second image set for the board
function transitionToSecondBoard() {
    newBoard(imageSet2); 
}

// Resets the timer for the new board
function resetTimerForNewBoard() {
    // Clears the existing timers
    clearTimeout(resetTimer);
    clearInterval(countdown);
    // Starts a new timer
    startTimer(180);
    // Sets a timer to end the game after the duration
    resetTimer = setTimeout(() => endGame(true), 180000);
}

// Hides the tile by flipping it back to show the background image
function hideTile(tile) {
    // Selects the image element and sets its source to the background image
    const imgTile = tile.querySelector('.tile-image');
    imgTile.src = 'assets/background.png';
    // Removes the 'flipped' class to hide the tile face
    tile.classList.remove('flipped');
}


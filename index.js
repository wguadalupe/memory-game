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

function renderNewBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    memoryBoard.forEach((image, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/background.png';
        imageElement.classList.add('tile-image');
        tileElement.appendChild(imageElement);
        tileElement.dataset.index = index;
        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        boardElement.appendChild(tileElement);
    });
}

function tileClick(tile, index) {
    if (isWaiting || tile === firstTile) return;
    if (!firstTile) {
        firstTile = tile;
        revealTile(tile, index);
    } else if (!secondTile) {
        secondTile = tile;
        revealTile(tile, index);
        checkMatch();
    }
}

function revealTile(tile, index) {
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[index].src;
    tile.classList.add('flipped');
}

function checkMatch() {
    if (memoryBoard[firstTile.dataset.index].src === memoryBoard[secondTile.dataset.index].src) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        matchedPairs++;
        // Check if all pairs on the first board have been matched
        if (matchedPairs === memBoardSize / 2 && !firstBoardCompleted) {
            // Transition to the second board
            firstBoardCompleted = true;
            matchedPairs = 0; // Reset matched pairs for the second board
            setTimeout(() => {
                alert("Congratulations! Moving to the second board.");
                transitionToSecondBoard();
                renderNewBoard();
                resetTimerForNewBoard(); // Reset and restart the timer for the second board
            }, 1000); // Delay to allow the last pair to be shown before alert
        }
        firstTile = secondTile = null;
    } else {
        isWaiting = true;
        setTimeout(() => {
            hideTile(firstTile);
            hideTile(secondTile);
            firstTile = secondTile = null;
            isWaiting = false;
        }, 1000);
    }
}

function transitionToSecondBoard() {
    newBoard(imageSet2); 
}


function resetTimerForNewBoard() {
    clearTimeout(resetTimer);
    clearInterval(countdown);
    startTimer(180);
    resetTimer = setTimeout(() => endGame(true), 180000); // Reset end game timer
}

function hideTile(tile) {
    const imgTile = tile.querySelector('.tile-image');
    imgTile.src = 'assets/background.png';
    tile.classList.remove('flipped');
}

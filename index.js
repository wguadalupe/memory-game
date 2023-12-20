document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    resetBoard();
    document.getElementById('shuffleButton').addEventListener('click', resetBoard);
});


const memBoardSize = 16; //Determines board size
let resetTimer;
let memoryBoard = []; // Array for board elements like times
let firstTile = null; //Tracks the first tile chosen by the player
let secondTile = null;
let score = 0; //tracks score
let isWaiting = false;

const imageSet = [
    'assets/pixel_art/Maygon Pack/Animals/Gray_Cat.png',
    'assets/pixel_art/Maygon Pack/Balloon/Blue_Balloon.png',
    'assets/pixel_art/Maygon Pack/Food/Banana_1.png',
    'assets/pixel_art/Maygon Pack/Items/Water_Bottle_1.png',
    'assets/pixel_art/Maygon Pack/Trees/Purple_Tree_2.png',
    'assets/pixel_art/Maygon Pack/Bomb_1.png',
    'assets/pixel_art/Maygon Pack/Animals/Lion.png',
    'assets/pixel_art/Maygon Pack/Balloon/Pink_Balloon.png',
    'assets/background.png'

]

//initialize a new board:
function newBoard() {
    imageSet.forEach((set) => {
        memoryBoard.push(set, set); //add each image twice
    });
    

    shuffleBoard(); //shuffle the board
}

//shuffle function
function shuffleBoard() {
    memoryBoard.sort(() => Math.random() - 0.5);
}

//reset the board
function resetBoard() {
    memoryBoard = []
    firstTile = null;
    secondTile = null;
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
    newBoard();
    renderNewboard();
    clearTimeout(resetTimer); //clear and reset the timer
    const resetTime = 300000; //5 minutes
    resetTimer =setTimeout(resetBoard, resetTime); //set the timer
}

//render the new board
function renderNewboard() {
    const boardElement = document.getElementById('board'); //get the board element should be displayed
    boardElement.innerHTML = ''; //clear any existing content in the board

    //iterare over each value in the memoryBoard array
    memoryBoard.forEach((imageSet, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/background.png';
        imageElement.classList.add('tile-image');
        tileElement.appendChild(imageElement);
        tileElement.dataset.index = index; //store the index

        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        boardElement.appendChild(tileElement); //append the tile

  
    });
}

function preloadImages() {
    imageSet.forEach((set) => {
        const img = new Image();
        img.src = set;
    })
}

//click handler
function tileClick(tile, index) {
    if (isWaiting) return;
    if (!firstTile) {
        firstTile = { tile, index};
        revealTile(tile);
    } else if (!secondTile && index !== firstTile.index) {
        secondTile = { tile, index};
        revealTile(tile);
        checkMatch();
    }
    
}

//reveal a tile
function revealTile(tile) {
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[tile.dataset.index]; //set the actual image
    tile.classList.add('flipped');
}

//check if 2 tiles match
function checkMatch() {
    if (firstTile.index !== secondTile.index && memoryBoard[firstTile.index] === memoryBoard[secondTile.index]) {
        score++;
        document.getElementById('score').innerText = 'Score: ' + score;
        firstTile = null;
        secondTile = null;
    } else {
        isWaiting = true; // Set waiting flag to true
        setTimeout(() => { // Hide the tiles
            hideTile(firstTile.tile);
            hideTile(secondTile.tile);
            firstTile = null;
            secondTile = null;
            isWaiting = false; // Reset waiting flag
        }, 1000); // Flip the cards over after 1 second
    }
}

    //hide a tile
    function hideTile(tile) {
       const imgTile = tile.querySelector('.tile-image');
       imgTile.src = 'assets/background.png';
       tile.classList.remove('flipped');
    }
resetBoard();
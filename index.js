document.addEventListener('DOMContentLoaded', () => {
    //Call the preload function and wait for all images to load
    preloadImages().then(() => {
    resetBoard();  //Once all images are loaded, start/reset the game
    }).catch((error) => {
      console.error("Error loadig images", error);
    });
    document.getElementById('shuffleButton').addEventListener('click', resetBoard);
});


const memBoardSize = 16; //Determines board size
const columns = Math.sqrt(memBoardSize);//returns the square root of the board size
const rows = memBoardSize / columns; //calculates the number of rows, divides the total number of tiles by the number of columns
let resetTimer;
let memoryBoard = []; // Array for board elements like times
let firstTile = null; //Tracks the first tile chosen by the player
let secondTile = null;
let score = 0; //Tracks score
let isWaiting = false;

const root = document.documentElement;
root.style.setProperty('--num-columns', columns);
root.style.setProperty('--num-rows', rows);


const imageSet = [
    'assets/pixel_art/Maygon Pack/Animals/Gray_Cat.png',
    'assets/pixel_art/Maygon Pack/Balloon/Blue_Balloon.png',
    'assets/pixel_art/Maygon Pack/Food/Banana_1.png',
    'assets/pixel_art/Maygon Pack/Items/Water_Bottle_1.png',
    'assets/pixel_art/Maygon Pack/Trees/Purple_Tree_2.png',
    'assets/pixel_art/Maygon Pack/Bomb_1.png',
    'assets/pixel_art/Maygon Pack/Animals/Lion.png',
    'assets/pixel_art/Maygon Pack/Balloon/Pink_Balloon.png',
    

]

//Initialize a new board:
function newBoard() {
    imageSet.forEach((set) => {
        memoryBoard.push(set, set); //Add each image twice
        
    });
    

    shuffleBoard(); //Shuffle the board
    console.log(memoryBoard.length)
}

//Shuffle function
function shuffleBoard() {
    memoryBoard.sort(() => Math.random() - 0.5);
}

let countdown;

//Reset the board
function resetBoard() {
    memoryBoard = []
    firstTile = null;
    secondTile = null;
    score = 0;
    document.getElementById('score').innerText = 'Score: 0';
    newBoard();
    renderNewboard();
    clearTimeout(resetTimer); //Clear and reset the timer
    const resetTime = 180000; //3 minutes
    resetTimer =setTimeout(resetBoard, resetTime); //Set the timer
    clearInterval(countdown);
    startTimer(180); //180 seconds equal 3 minutes
}

function startTimer(duration) {
    let time = duration;
    console.log(document.getElementById('time'));
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

function endGame() {
    isWaiting = true;
    alert("Time's up! Game over!");

}

endGame();



//Render the new board
function renderNewboard() {
    const boardElement = document.getElementById('board'); //Get the board element should be displayed
    boardElement.innerHTML = ''; //Clear any existing content in the board

    //Iterare over each value in the memoryBoard array
    memoryBoard.forEach((imageSet, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/background.png';
        imageElement.classList.add('tile-image');
        tileElement.appendChild(imageElement);
        tileElement.dataset.index = index; //Store the index

        tileElement.addEventListener('click', () => tileClick(tileElement, index));
        boardElement.appendChild(tileElement); //Append the tile

  
    });
}

function preloadImages() {
    //Create an array of promises for each image
let promises = imageSet.map((src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve; //Fires immediately after the browser loads the object
        img.onerror = reject; //Fires when an error occurs during object loading.
        img.src = src;
    });
});
 return Promise.all(promises);
}

//Click handler
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

//Reveal a tile
function revealTile(tile) {
    const img = tile.querySelector('.tile-image');
    img.src = memoryBoard[tile.dataset.index]; //Set the actual image
    tile.classList.add('flipped');
}

//Check if 2 tiles match
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

    //Hide a tile
    function hideTile(tile) {
       const imgTile = tile.querySelector('.tile-image');
       imgTile.src = 'assets/background.png';
       tile.classList.remove('flipped');
    }


resetBoard();
const memBoardSize = 16; //This will help determine the board size
let memoryBoard = [];//empty array for board elements like tiles
let firstTile = null; //tracks the first tile chosen by the player
let secondTile = null; //tracks the 2nd tile picked by the player
let score = 0;//tracks score

function newBoard() {
    //this loop will run until i is less than half of boardSize
for (let i = 0; i < memBoardSize /2; i++) { 
    memoryBoard.push(i);//this adds the current value of 'i' to the end of the memoryBoard array
    memoryBoard.push(i);//since this needs to be done twice for the memory game, it adds 2 identical values each time. 
}

//shuffle the board
memoryBoard = memoryBoard.sort(() => Math.random() - 0.5);//memoryBoard.sort is a method that sorts the elements of an array. 
                                                         //the sorting function () => Math.random() - 0.5 is a funtion that returns a random number that is less than, equal to, or greater than 0.5
}

//reset board function
function resetBoard() {
    memoryBoard = [];
    firstTile = null;
    secondTile = null; 
    score = 0;
    document.getElementById('score').innerText = 'Score: 0'; //selects the ID 'score' then sets its innerText property to 0
    newBoard();
    rendernewBoard();
}

//create a new board
function rendernewBoard() {
    const memoryGameBoard = document.getElementById('board'); //gets the HTML element w/the 'board' ID and assigns it to memoryGameBoard
    memoryGameBoard.innerHTML = ''; //resets the board
    //iterates over the memoryBoard array
    for (let i = 0; i < memoryBoard.length; i++) {
    const tileElement = document.createElement('div'); //creates a new div for each tile.
    tileElement.classList.add('tile');//adds a class of 'tile' for styling.
    tileElement.dataset.value = memoryBoard[i]; //Each tile's value (from the memoryBoard array) is stored in a custom data attribute (data-value)
    tileElement.innerText = '?';// Initially, each tile displays a '?' character.
    
    //responds when a tile is clicked
    tileElement.addEventListener('click', () => {
        if (!firstTile) { //if 'firstTile' is not already set the clicked tile becomes the firstTile.
            firstTile = tileElement;
            tileElement.classList.add('flipped'); //shows the tile's value
            tileElement.innerText = tileElement.dataset.value;
        } else if (!secondTile && tileElement !== firstTile) { //else if 'secondTile' is not set and the clicked tile is not the same as 'firstTile', the ckicked tile becomes the sercondTile.
            secondTile = tileElement;
            tileElement.classList.add('flipped');
            tileElement.innerText = tileElement.dataset.value;
            //if firstTile and the clicked tile ('secondTile') have the same 'dataset.value', the score is incremented.
            if (firstTile.dataset.value === tileElement.dataset.value) {
                score++;
                document.getElementById('score').innerText = 'Score: ' + score; //the score is updated and bot 'firstTile' and 'secondTile' is set to null.
                firstTile = null;
                secondTile = null;
            } else {
                //if the tiles don't match, a 'setTimeout' is used to flip the tiles back over after 1 second
                setTimeout(() => {
                    firstTile.classList.remove('flipped');
                    secondTile.classList.remove('flipped');
                    firstTile = null;
                    secondTile = null;
                }, 1000);
            
        }
    });

    memoryGameBoard.appendChild(tileElement);
    }


document.getElementById('shuffle').addEventListener('click', resetBoard);

resetBoard();
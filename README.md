# memory-game: This is a memory game where a user needs to match 2 alike cards to gain a score.

## Credits: 
Images by: 
Maygonpepetreynsh https://opengameart.org/users/maygonpepetreynsh
Behnam-Norouzi: https://unsplash.com/@behy_studio

### JavaScript Logic
1. **Global Variables**:
   - `memBoardSize`: Specifies the board size (16 tiles).
   - `memoryBoard`: Array to store board elements (tiles).
   - `firstTile`, `secondTile`: Variables to track the first and second tiles chosen by the player.
   - `score`: Tracks the player's score.

2. **`newBoard` Function**:
   - Populates `memoryBoard` with pairs of identical values (up to half of `memBoardSize`).
   - Shuffles the board using a sort function with a random comparator.

3. **`resetBoard` Function**:
   - Resets `memoryBoard`, `firstTile`, `secondTile`, and `score`.
   - Updates the score display to '0'.
   - Calls `newBoard` and `rendernewBoard` functions to reinitialize the game.

4. **`rendernewBoard` Function**:
   - Creates and displays each tile as a `div` element.
   - Sets up a click event listener for each tile to handle tile flipping and score updates.
   - If two tiles match, the score is incremented; otherwise, the tiles are flipped back after 1 second.

5. **Event Listener for 'Shuffle' Button**:
   - Calls `resetBoard` function when the 'Shuffle tiles' button is clicked.

6. **Image array**:
   -

### HTML Structure
- Contains a score section, a shuffle button, a timer display, and a `div` for the game board.

### CSS Styling
- Uses Google Font 'Inconsolata'.
- Sets basic styles for body and elements like the game board and tiles.
- Includes styling for flipped tiles and other visual aspects like the background image.

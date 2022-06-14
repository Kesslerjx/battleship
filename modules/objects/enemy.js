// Pattern enum wit some function
// Used to determine the possible directions the next move can be
// Get pattern takes the last two hits to determine if theres a pattern
// There can be a pattern when the difference is 10, -10, 1, or -1
// There can also be a pattern going the opposite direction
//// Example, the ship is at 6,7,8,9
//// The enemy hits 8,9,7
//// From our perspective, the enemy should choose the number 6
//// To get, subtract the last 2 (7-9) and then divide by 2
//// In this case it should be equal to -1 which means the ship is going left
//// Since there is a pattern it will add the last move (7) to the pattern (-1)
//// This will result in 6 and successfully sink the ship
//// The same logic applies going up and down
const PATTERN = {
    VERTICAL_UP: -10,
    VERTICAL_DOWN: 10,
    HORIZONTAL_RIGHT: 1,
    HORIZONTAL_LEFT: -1,
    getPattern: (last, secondToLast) => {
        if(last - secondToLast === 10 || (last - secondToLast)/2 === 10 || (last - secondToLast)/3 === 10) {
            return PATTERN.VERTICAL_DOWN;
        } else
        if(last - secondToLast === -10 || (last - secondToLast)/2 === -10 || (last - secondToLast)/3 === -10) {
            return PATTERN.VERTICAL_UP;
        } else
        if(last - secondToLast === 1 || (last - secondToLast)/2 === 1 || (last - secondToLast)/3 === 1) {
            return PATTERN.HORIZONTAL_RIGHT;
        } else
        if(last - secondToLast === -1 || (last - secondToLast)/2 === -1 || (last - secondToLast)/3 === -1) {
            return PATTERN.HORIZONTAL_LEFT;
        } else {
            return false;
        }
    },
    isHorizontal: (pattern) => {
        return (pattern === PATTERN.HORIZONTAL_LEFT || pattern === PATTERN.HORIZONTAL_RIGHT);
    }
}

class Enemy {

    constructor(board) {
        this.board = board;
        this.potentialHits = [];
        this.patternIndex  = undefined;
        this.patternType   = undefined;
        this.patternStart   = undefined;
    }

    // Notify the enemy that a ship was hit
    // Calls the getAdjacentBoxes function to find potential hits
    shipWasHit() {
        this.#getAdjacentBoxes();
    }

    // Notifies the enemy that ship was sunk
    // Clears the values when a ship has been sunk
    shipWasSunk() {
        this.potentialHits = [];
        this.patternStart = undefined;
    }

    // Called from the game to get a move for the enemy to play
    // If there are no potential hits to use, return a random move
    // If there are potential hits, it will use them to look for a pattern
    // If there isn't a pattern it will play a potential hit and then remove that from the array
    getMove() {

        //Default value for move
        let move = -1;

        //Ensures there are no invalid moves in the array before picking from it
        this.potentialHits = this.potentialHits.filter(index => this.board.isMoveValid(index));

        if(this.potentialHits.length === 0) {
            move = this.#randomMove();
        } else {
            //Gets an index if a pattern was found
            //If not, its equal to false
            let pattern = this.#lookForPattern();

            if(pattern === false) {
                this.patternStart = undefined; //Reset the pattern start if there is no pattern
                let index = Math.floor(Math.random()*this.potentialHits.length);
                move = this.potentialHits[index]; //Get the first potential move
                this.potentialHits.splice(index, 1); //Remove that move
            } else {
                move = pattern;
            }
        }

        //Remove from the gridArray as a potential grid box
        //This will stop the enemy from choosing that again
        let indexToRemove = this.board.grid.indexOf(move);
        this.board.grid.splice(indexToRemove, 1);

        console.log(this.board);
        console.log(this.potentialHits);
        console.log(this.patternStart);
        console.log(move)

        return move;
    }

    // Gets all the potential adjacent boxes after a hit
    #getAdjacentBoxes() {
        // Get previous hit
        let previousHit = this.board.hits[this.board.hits.length-1];

        // Get potential indexes
        this.potentialHits = [previousHit-10, previousHit+1, previousHit+10, previousHit-1];

        // Removes the +1 if it's not on the same row
        // Removes any numbers less than 0 (off grid)
        // Removes any numbers above 100 (off grid)
        // Removes any numbers that are not valid moves
        if(!this.#isMoveSameRow(previousHit, this.potentialHits[1])) {this.potentialHits.splice(1,1)};
        this.potentialHits = this.potentialHits.filter(index => index >= 0);
        this.potentialHits = this.potentialHits.filter(index => index <= 99);
        this.potentialHits = this.potentialHits.filter(index => this.board.isMoveValid(index));
    }

    // Looks to see if there is a pattern in the hits
    // Returns a false if no pattern
    #lookForPattern() {

        let last         = this.board.hits[this.board.hits.length-1];
        let secondToLast = this.board.hits[this.board.hits.length-2];
        let pattern      = PATTERN.getPattern(last, secondToLast);

        // Determines that there is a pattern
        if(typeof pattern === 'number') {
            let move = last + pattern;

            //Only set the pattern start if it's not defined
            if(this.patternStart === undefined) { 
                this.patternStart = secondToLast; 
            }

            // If the move is valid, return it
            // If not, try the opposite
            // If the pattern is horizontal, make sure it's on the same row
            if(this.board.isMoveValid(move) || (PATTERN.isHorizontal(pattern) && this.#isMoveSameRow(last, move) && this.board.isMoveValid(move))) {
                return move;
            } else {
                move = this.patternStart + (pattern * -1);

                if(this.board.isMoveValid(move)) {
                    return move;
                } else {
                    return false;
                }
            }
        } else {
            return pattern;
        }

    }

    // Uses the grid array to find a random move
    #randomMove() {
        return this.board.grid[Math.floor(Math.random() * this.board.grid.length)];
    }

    // Checks to see if the move is in the same row
    //// Example, previous = 19, move = 20
    //// Divide both by 10, 19->1.9 & 20->2.0
    //// Get the floor value 1.9->1 && 2.0 stays the same
    //// If the numbers aren't the same then they aren't on the same row
    #isMoveSameRow(previous, move) {
        return (Math.floor(previous/10) === Math.floor(move/10));
    }
}

export {Enemy}
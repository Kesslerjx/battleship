import { Player } from "./player.js";

class Enemy extends Player {
    constructor(board) {
        super(board);
        this.adjacentBoxes = [];
        this.possibleHits  = [];
    }

    //Algorithm to determine which move to play
    //It will do a random move unless one of the other arays aren't empty
    //Once a move is tried, it should be removed from the array
    move() {

        this.#checkPattern();

        if(this.possibleHits.length > 0) {
            let move = this.possibleHits[0];
            this.possibleHits.shift();
            return move;
        } else
        if(this.adjacentBoxes.length > 0 ){
            let move = this.adjacentBoxes[0];
            this.adjacentBoxes.shift();
            return move;
        } else {
            return this.#randomMove();
        }
        
    }

    //Gets all the adjacent boxes are a hit is registered
    //Those adjacent boxes must be valid moves
    getAdjacentBoxes(i) {
        this.adjacentBoxes = [10,-10,1,-1].map(n => {
            if(this.#isMoveValid(i+n, n)) {
                return i+n;
            }
        }).filter(n => n !== undefined);
    }

    //Notifies the enemy AI that it missed
    //This only matters if the AI is currently attacking a ship and hasn't sunk it
    //It will filter out all the possible hits continuing in the direction it was going
    //That'll force it to go the opposite direction
    missed() {
        if(this.possibleHits.length > 0 ) {
            let nextHit    = this.possibleHits[0];
            let lastMiss   = this.misses[this.misses.length - 1]
            let difference = nextHit - lastMiss;

            if(Math.sign(difference) === -1) {
                this.possibleHits = this.possibleHits.filter(hit => hit > lastMiss);
            } else {
                this.possibleHits = this.possibleHits.filter(hit => hit < lastMiss);
            }

        }
    }

    //Registers that a ship was sunk and resets the arrays
    shipSunk() {
        this.adjacentBoxes = [];
        this.possibleHits  = [];
    }

    //Gets a random move based on what's in the grid array
    #randomMove() {
        return this.grid[Math.floor(Math.random() * this.grid.length)];
    }

    //Checks to see if there a current pattern in the hits array
    //This would only matter if the enemy AI is searching for the rest of the ship
    //Once a pattern is found it will set the possible hits array
    #checkPattern() {
        if(this.hits.length >= 2 && this.possibleHits.length === 0 && this.adjacentBoxes.length > 0) {
            let lastIndex  = this.hits.length - 1;
            let difference = this.hits[lastIndex] - this.hits[lastIndex - 1];
            let isPattern  = [10,-10,1,-1].includes(difference);

            if(isPattern) {
                this.#setPossibleHits(difference, this.hits[lastIndex]);
            }

        }
    }

    //Builds the possible hits array based on the last place hit and the pattern
    //It will go one direction until the move isn't valid, then it will turn around
    //This could be recursive, but the last algorithm I had didn't work properly
    #setPossibleHits(pattern, lastHit) {

        let next = lastHit + pattern;

        while(this.#isMoveValid(next, pattern)) {
            this.possibleHits.push(next);
            next += pattern;
        }

        next = (lastHit-pattern) - pattern;

        while(this.#isMoveValid(next, pattern)) {
            this.possibleHits.push(next);
            next -= pattern;
        }
    }

    //Determines if the move is valid
    //It's valid if its included in the grid array
    //It's also valid if the ship is left to right and the move is on the same row
    #isMoveValid(move, pattern) {
        let previousMove = move - pattern;
        let valid        = this.grid.includes(move);
        let isHorizontal = [-1,1].includes(pattern);
        let sameRow      = (Math.floor(previousMove/10) === Math.floor(move/10));

        return ((valid && !isHorizontal) || (isHorizontal && sameRow && valid));
    }

}

export {Enemy}
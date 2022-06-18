import { Player } from "./player.js";

class Enemy extends Player {
    constructor(board) {
        super(board);
        this.possibleHits = [];
        this.patternStart = undefined;
    }

    move() {
        let move = this.#randomMove();

        if(this.possibleHits.length > 0) {
            let pattern = this.#isPattern();
            console.log(pattern);

            if(!pattern) {
                this.patternStart = undefined;
                this.#filterPossibleHits();
                move = this.possibleHits[Math.floor(Math.random() * this.possibleHits.length)];
            } else {
                move = pattern;
            }
        }

        return move;
    }

    setPossibleHits(index) {
        this.possibleHits = [index + 10, index-10, index+1, index-1];
        this.#filterPossibleHits(index);
    }

    shipSunk() {
        this.possibleHits = [];
        this.patternStart = undefined;
    }

    #randomMove() {
        return this.grid[Math.floor(Math.random() * this.grid.length)];
    }

    #filterPossibleHits(i = undefined) {
        if(this.possibleHits.length !== 0) {
            this.possibleHits = this.possibleHits.filter(index => this.grid.includes(index));

            if(i !== undefined) {
                this.possibleHits = this.possibleHits.filter(index => (this.#isVertical(index, i) ||  this.#isHorizontal(index, i) && this.#isSameRow(index, i)));
            }
        }
    }

    #isPattern() {

        let move = false;

        if(this.hits.length >= 2) {
            let lastIndex  = this.hits.length - 1;
            let difference = this.hits[lastIndex] - this.hits[lastIndex - 1];

            //[35,45,55,65,75]
            //[55,45,35,65]

            if([10,-10,1,-1,2,-2,20,-20,3,-3,30,-30].includes(difference)) {

               difference = this.#normalizeDifference(difference);

                if(this.patternStart === undefined) {
                    this.patternStart = this.hits[lastIndex - 1];
                }

                console.log(this.hits);
                move = this.#checkPattern(this.hits[lastIndex] + difference, difference, 0);
            } 
        }

        return move;
    }

    #normalizeDifference(difference) {
        if([10,-10].includes(difference)) {
            return difference;
        } else
        if([20,-20,30,-30].includes(difference)) {
            return (10 * Math.sign(difference));
        } else {
            return (1 * Math.sign(difference));
        }
    }

    #checkPattern(move, pattern, count) {
        let valid = this.#isMoveValid(move, pattern);

        console.log(move);
        console.log(pattern);
        console.log(count);
        console.log(valid);

        if(valid) {
            return move;
        } else
        if(!valid && count < 1) {
            let opposite = this.patternStart + (pattern*-1);
            return this.#checkPattern(opposite, pattern, 1);
        } else {
            return false;
        }
    }

    #isMoveValid(move, pattern) {
        let previousMove = move - pattern;
        let valid        = this.isMoveValid(move);
        let isHorizontal = [-1,1].includes(pattern);
        let sameRow      = (Math.floor(previousMove/10) === Math.floor(move/10));

        return ((valid && !isHorizontal) || (isHorizontal && sameRow && valid));
    }

    #isHorizontal(num1, num2) {
        return (Math.abs(num1 - num2) === 1);
    }
    
    #isVertical(num1, num2) {
        return (Math.abs(num1 - num2) === 10);
    }
    
    #isSameRow(num1, num2) {
        return (Math.floor(num1/10) === Math.floor(num2/10));
    }

}

export {Enemy}
import { Player } from "./player.js";

class Enemy extends Player {
    constructor(board) {
        super(board);
        this.adjacentBoxes = [];
        this.possibleHits  = [];
    }

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

    getAdjacentBoxes(i) {
        this.adjacentBoxes = [i + 10, i-10, i+1, i-1];
        this.adjacentBoxes = this.adjacentBoxes.filter(index => this.isMoveValid(index, i));
    }

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

    shipSunk() {
        this.adjacentBoxes = [];
        this.possibleHits  = [];
    }

    #randomMove() {
        return this.grid[Math.floor(Math.random() * this.grid.length)];
    }

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

    #isMoveValid(move, pattern) {
        let previousMove = move - pattern;
        let valid        = this.grid.includes(move);
        let isHorizontal = [-1,1].includes(pattern);
        let sameRow      = (Math.floor(previousMove/10) === Math.floor(move/10));

        return ((valid && !isHorizontal) || (isHorizontal && sameRow && valid));
    }

}

export {Enemy}
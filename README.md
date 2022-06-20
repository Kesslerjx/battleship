# Battleship
Web page to play a game of battlefield

# Enemy.js

I wanted to explain how the AI works for this. To begin, the Enemy object inherits the grid array from the Player object. 
The grid array contains all the possible locations the enemy can hit. The very first move the AI will do will also be a random index
from this grid array. It will continue to make random moves until a ship has been hit.

    #randomMove() {
        return this.grid[Math.floor(Math.random() * this.grid.length)];
    }

Once a ship has been hit, it will get the 4 adjecent boxes. Those will always be +10, -10, +1, and -1 from the index. Those adjacent indexes will be
filtered to ensure they are valid moves. Moves aren't valid if they aren't in the grid array (meaning they've already been played), or if the 
ship is horizontal and the index is not on the same row (see isSameRow section). Once these are found, it will start using indexes from this array
(adjacentBoxes) until there are at least 2 hits.

    getAdjacentBoxes(i) {
        this.adjacentBoxes = [i + 10, i-10, i+1, i-1];
        this.adjacentBoxes = this.adjacentBoxes.filter(index => this.isMoveValid(index, i));
    }
    
    #isMoveValid(move, pattern) {
        let previousMove = move - pattern;
        let valid        = this.grid.includes(move);
        let isHorizontal = [-1,1].includes(pattern);
        let sameRow      = (Math.floor(previousMove/10) === Math.floor(move/10));

        return ((valid && !isHorizontal) || (isHorizontal && sameRow && valid));
    }

Once at least 2 hits have been registered, it will start to look for a pattern. The pattern is found by finding the difference between the last 2 hits.
If there is a pattern, the difference will equal to 10, -10, 1, or -1. It will then find the possible places for the ship to be (possibleHits). It does
this by using the pattern to find all valid indexes spanning each direction from the last hit. For example, if the last hit was 35, and the pattern was 1.
possibleHits will be equal to [36,37,38,39,33,32,31,30]. Notice it skips 35 and 34, because those would have been the last 2 hits, making those moves
invalid.

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

It will start to use the indexes from this array until the ship has been sunk, or until it misses. Once it misses, it will go in the opposite direction.
It does this by removing any number greater or less than (depending on the direction it was moving) the last miss from the possibleHits array. Doing that
leaves all the indexes in the opposite direction. For example, lets say the ship lives at indexes [32,33,34,35]. The AI had previously hit spots 34 and 35, 
which leaves it with a pattern of +1. Because of that, it will continue in that direction until it misses. Index 36 will be a miss, so it will then 
remove any number greater than 36 from the possibleHits array (36 would have already been removed). The new array would equal [33,32,31,30]. The AI 
would play 33 and then 32 successfully sinking the ship.

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

One thing to note, it will only look for a pattern if the AI is currently searching for a ship. The AI is searching for a ship if there are
adjacent indexes to try and if there are no possible places to hits. If there are possible places to hit, then the pattern has already been found
and it doesn't need to keep searching for it.

# isSameRow

To compare 2 numbers to see if they're on the same row, you can divide both by 10. After that, use the Math.floor() function to get the final numbers
for comparison. For example lets use the 2 numbers 19 and 20. 19 is the end of a row, and 20 is the start of another row. Divide both by 10, 19 = 1.9
and 20 = 2.0. The floor of those numbers are 1 and 2. Since those numbers are not equal to each other, then they are not on the same row.

    let num1 = 19;
    let num2 = 20;
    let isSameRow = (Math.floor(num1/10) === Math.floor(num2/10));
    console.log(isSameRow) //False

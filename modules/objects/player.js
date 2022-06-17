
class Player {
    constructor(board) {
        this.board  = board
        this.grid   = Array.from(Array(100).keys()); //Used for making moves
        this.hits   = []; //Used for tracking hits on the enemy board
        this.misses = []; //Used for tracking misses on the enemy board
    }

    isMoveValid(index) {
        return this.grid.some(box => box === index);
    }

    moveIndex(index, isHit) {
        let i = this.grid.indexOf(index);
        this.grid.splice(i, 1);

        if(isHit) {
            this.hits.push(index); 
        } else {
            this.misses.push(index);
        }
    }

}

export { Player }

class Ship {
    constructor(name, length, locations = []) {
        this.name = name;
        this.length = length;
        this.locations = locations;
        this.hits = [];
    }

    //If they're equal, then it's sunk
    isSunk() {
        return (locations === hits);
    }
}

export { Ship }
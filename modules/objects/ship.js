
class Ship {
    constructor(name, length, locations = []) {
        this.name = name;
        this.length = length;
        this.locations = locations;
        this.hits = [];
    }

    hit(index) {
        this.hits.push(index);
    }

    //If they're equal, then it's sunk
    isSunk() {
        return (this.locations.length === this.hits.length);
    }
}

export { Ship }

class Board {
    constructor(ships = []) {
        this.ships = ships;
    }

    hit(index) {
        let shipIndex = this.#shipIndex(index);
        this.ships[shipIndex].hit(index);
    }

    wasSunk(index) {
        return this.ships[this.#shipIndex(index)].isSunk();
    }

    allSunk() {
        for(const ship of this.ships) {
            if(ship.isSunk() === false) {
                return false;
            }
        }
        return true;
    }

    getShipName(index) {
        return this.ships[this.#shipIndex(index)].name;
    }

    //Determines if there is a ship at any of the provided locations
    hasShip(locations) {
        for(const location of locations) {
            if(this.ships.some(ship => ship.locations.includes(location))) {
                return true;
            }
        }
        return false;
    }

    hasShipAt(index) {
        for(const ship of this.ships) {
            if(ship.locations.includes(index)) {
                return true;
            }
        }

        return false;
    }

    #shipIndex(index) {
        return this.ships.findIndex(ship => ship.locations.includes(index));
    }
}

export { Board }
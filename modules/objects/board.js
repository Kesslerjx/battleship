
class Board {
    constructor(ships = []) {
        this.ships = ships;
        this.grid = Array.from(Array(100).keys());
        this.hits = [];             
        this.misses = [];
    }

    shipName(index) {
        for(const ship of this.ships) {
            if(ship.locations.includes(index)) {
                return ship.name;
            }
        }
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
        return this.ships.some(ship => ship.locations.includes(index));
    }

    isMoveValid(index) {
        return this.grid.includes(index);
    }
}

export { Board }
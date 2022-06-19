import * as Game from './game.js'
import * as Grid from './handlers/grid-handler.js';
import * as Button from './handlers/button-handler.js';
import { ships } from './data/ships.js'
import { Board } from './objects/board.js';
import { Ship } from './objects/ship.js';

const ORIENTATION = {
    VERTICAL: 'v',
    HORIZONTAL: 'h',
    opposite: (o) => { return o === ORIENTATION.VERTICAL ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL },
    random: () => { return Math.floor(Math.random() * 2) ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL }
}

let shipIndex       = -1;
let shipOrientation = ORIENTATION.VERTICAL;
let playerBoard     = new Board();
let storedEvent     = undefined;

export function start() {

    nextShip();

    Button.removeListener(start);
    document.addEventListener('keydown', changeOrientation);
    Grid.addEventListener('click', placeShip);
    Grid.addEventListener('mouseover', drawShip);
    Grid.addEventListener('mouseout', eraseShip);

}

export function restart() {
    shipIndex       = -1;
    shipOrientation = ORIENTATION.VERTICAL;
    playerBoard     = new Board();
    storedEvent     = undefined;

    start();
}

function end() {
    document.removeEventListener('keydown', changeOrientation);
    Grid.removeEventListener('click', placeShip);
    Grid.removeEventListener('mouseover', drawShip);
    Grid.removeEventListener('mouseout', eraseShip);
}

function nextShip() {
    shipIndex += 1;
    
    if(shipIndex < ships.length) {
        Button.changeText(`Place your ${ships[shipIndex].name}. Press 'R' to rotate.`);
    } else {
        end();
        Game.start(playerBoard, buildEnemyBoard());
    }
    
}

function placeShip(event) {
    let index = Grid.boxIndex(event);
    let locations = getLocations(index, shipOrientation, ships[shipIndex].length);

    if(canBePlaced(playerBoard, locations, shipOrientation)) {
        let ship = new Ship(ships[shipIndex].name, ships[shipIndex].length, locations);
        playerBoard.ships.push(ship);
        nextShip();
    }
}

function drawShip(event) {
    storedEvent = event;

    let index = Grid.boxIndex(event);
    let locations = getLocations(index, shipOrientation, ships[shipIndex].length);

    if(canBePlaced(playerBoard, locations, shipOrientation)) {
        Grid.drawShip(locations);
    }
}

function eraseShip() {
    Grid.eraseShip(playerBoard);
}

function changeOrientation(event) {
    if(event.key === 'r') {
        shipOrientation = ORIENTATION.opposite(shipOrientation);
        eraseShip();
        if(storedEvent !== undefined) { drawShip(storedEvent) };
    }
}

function canBePlaced(board, locations, orientation) {

    let hasShip = board.hasShip(locations);
    let offGridH = (orientation === ORIENTATION.HORIZONTAL && isOffGridHorizontally(locations));
    let offGridV = (orientation === ORIENTATION.VERTICAL && isOffGridVertically(locations));

    if(hasShip || offGridH || offGridV) {
        return false;
    } else {
        return true;
    }
}

function getLocations(index, orientation, length) {
        
    let startIndex = index;
    let array = [];

    for(let x=0; x < length; x++) {

        array.push(startIndex);

        if(orientation === ORIENTATION.VERTICAL) {
            startIndex -= 10;
        } else {
            startIndex += 1;
        }
    }

    return array;
}

function isOffGridVertically(indexes) {
    let filtered = indexes.filter(index => index < 0);
    return (filtered.length > 0);
}

function isOffGridHorizontally(indexes) {
    return (
        Math.floor(indexes[0]/10) != Math.floor(indexes[indexes.length-1]/10)
    )
}

function buildEnemyBoard() {

    let finished = false;
    let shipIndex = 0;
    let enemyBoard = new Board();

    //Loop until the board is complete
    while(finished === false) {
        //Pick random number from 0-99
        //Pick random orientation
        let randomIndex = Math.floor(Math.random() * 100);
        let randomOrientation = ORIENTATION.random();

        //Get indexes
        let locations = getLocations(randomIndex, randomOrientation, ships[shipIndex].length);

        //If it can be placed, place the ship and continue
        if(canBePlaced(enemyBoard, locations, randomOrientation)) {

            //Create the ship
            let ship = new Ship(ships[shipIndex].name, locations.length, locations);

            //Add to the gameboard
            enemyBoard.ships.push(ship);

            //Go to next index of the ship references
            shipIndex += 1;

            //Check index value to set if finished or not
            if(shipIndex >= ships.length) {
                finished = true;
            }
        }

    }

    return enemyBoard;
}


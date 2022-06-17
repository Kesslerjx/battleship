import * as Grid from './handlers/grid-handler.js';
import * as Button from './handlers/button-handler.js';
import { ships } from './data/ships.js'
import { Board } from './objects/board.js';
import { Enemy } from './objects/enemy.js';
import { Player } from './objects/player.js';

let player = undefined;
let enemy  = undefined;

export function start(playerBoard, enemyBoard) {
    console.log('Game is starting');
    player = new Player(playerBoard);
    enemy  = new Enemy(enemyBoard);

    playerTurn();
    Button.changeText('Pick a location');
}

function endGame() {
    console.log('Game has ended');
}

function playerTurn() {
    allowInput();
    Grid.clearGrid();
    Grid.fillGridNoShips(player);
}

function enemyTurn() {
    disableInput();
    Grid.clearGrid();
    Grid.fillGrid(player.board, enemy);
    setTimeout(enemyMove, 1000);
}

function allowInput() {
    Grid.addEventListener('click', playMove);
    Grid.addEventListener('mouseover', Grid.highlightBox);
    Grid.addEventListener('mouseout', Grid.unhighlightBox);
}

function disableInput() {
    Grid.removeEventListener('click', playMove);
    Grid.removeEventListener('mouseover', Grid.highlightBox);
    Grid.removeEventListener('mouseout', Grid.unhighlightBox);
}

function playMove(event) {

    let index = Grid.boxIndex(event);

    if(player.isMoveValid(index)) {
        if(enemy.board.hasShipAt(index)) {
            Button.changeText('You hit a ship');
            enemy.board.hit(index);
            if(enemy.board.wasSunk(index))  {
                Button.changeText(`You sunk their ${enemy.board.getShipName(index)}`);
            }
            Grid.boxHit(index);
        } else {
            Button.changeText('You missed');
            Grid.boxMiss(index);
        }

        player.moveIndex(index, enemy.board.hasShipAt(index));

        if(isGameOver()) { 
            endGame(); 
        } else {
            setTimeout(enemyTurn, 1500);
        }

    } else {
        console.log('Move is invalid');
    }
}



function enemyMove() {
    let move = enemy.move();

    if(player.board.hasShipAt(move)) {
        Button.changeText(`The enemy hit your ${player.board.getShipName(move)}`);
        player.board.hit(move);
        Grid.boxHit(move);

        if(enemy.possibleHits.length === 0) {
            enemy.setPossibleHits(move);
        }

        if(player.board.wasSunk(move))  {
            Button.changeText(`They sunk your ${player.board.getShipName(move)}`);
            enemy.shipSunk();
        } 
    } else {
        Button.changeText(`The enemy missed`);
        Grid.boxMiss(move);
    }
    
    console.log(enemy.possibleHits);
    enemy.moveIndex(move, player.board.hasShipAt(move));

    if(isGameOver()) { 
        endGame(); 
    } else {
        setTimeout(playerTurn, 1500);
    }
}

function isGameOver() {
    return (player.board.allSunk() || enemy.board.allSunk());
}

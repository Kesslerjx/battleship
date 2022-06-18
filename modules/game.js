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

function endGame(loser) {

    if(loser === player) {
        Button.changeText('You lose. Play again?')
    } else {
        Button.changeText('You win! Play again?')
    }
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

        checkGameEnd(enemyTurn);

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
    
    enemy.moveIndex(move, player.board.hasShipAt(move));

    checkGameEnd(playerTurn);
}

function checkGameEnd(turnFunction) {
    if(player.board.allSunk()) {
        endGame(player); ;
    }else
    if(enemy.board.allSunk()) {
        endGame(enemy); 
    } else {
        setTimeout(turnFunction, 1500);
    }
}

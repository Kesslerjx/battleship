import * as Grid from './handlers/grid-handler.js';
import * as Button from './handlers/button-handler.js';
import { ships } from './data/ships.js'
import { Board } from './objects/board.js';
import { Enemy } from './objects/enemy.js';

let player = undefined;
let enemy  = undefined;

export function start(p, e) {
    player = p;
    enemy  = new Enemy(e);

    allowInput();
    Grid.clearGrid();
}

function changeTurn() {
    disableInput();
    //Wait 1 second before clearing the grid
    setTimeout(function(){
        Grid.clearGrid();
        Grid.fillGrid(player, enemy.board);

        //Wait 1 second before making a move for the enemy
        setTimeout(function() {
            enemyTurn();
        }, 1000)
    }, 1000);
}

function playerTurn() {
    setTimeout(function() {
        Grid.clearGrid();
        Grid.fillGridNoShips(player);
        allowInput();
    }, 1000)
}

function enemyTurn() {
    let index = enemy.getMove();

    if(player.hasShipAt(index)) {
        Button.changeText(`Your ${player.shipName(index)} was hit`);
        enemy.board.hits.push(index); //Add index to hit array
        Grid.boxHit(index); //Set the grid box accordingly
    } else {
        Button.changeText('The enemy missed');
        enemy.board.misses.push(index); //Add index to misses array
        Grid.boxMiss(index); //Set the grid box accordingly
    }

    playerTurn();
}

function allowInput() {
    Button.changeText('Pick a location to hit');
    Grid.addEventListener('click', selectGridBox);
    Grid.addEventListener('mouseover', Grid.highlightBox);
    Grid.addEventListener('mouseout', Grid.unhighlightBox);
}

function disableInput() {
    Grid.removeEventListener('click', selectGridBox);
    Grid.removeEventListener('mouseover', Grid.highlightBox);
    Grid.removeEventListener('mouseout', Grid.unhighlightBox); 
}

function selectGridBox(event) {
    let index = Grid.boxIndex(event);
    
    if(player.isMoveValid(index)) {
        if(enemy.board.hasShipAt(index)) {
            Button.changeText(`You hit their ${enemy.board.shipName(index)}`);
            player.hits.push(index); //Add index to hit array
            Grid.boxHit(index); //Set the grid box accordingly
        } else {
            Button.changeText('You missed');
            player.misses.push(index); //Add index to misses array
            Grid.boxMiss(index); //Set the grid box accordingly
        }

        player.grid.splice(player.grid.indexOf(index), 1); //Remove the index from the grid array
        changeTurn();
    }
}

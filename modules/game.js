import * as Grid from './handlers/grid-handler.js';
import * as Button from './handlers/button-handler.js';
import { ships } from './data/ships.js'

let setupShipIndex = -1;

//Starts the player board setup process
export function startSetup () {
    setupShipIndex += 1;
    Button.changeText(`Place your ${ships[setupShipIndex].name}`);
    Button.removeListener(startSetup);
    Grid.addSetupListeners();
}

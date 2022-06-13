import * as Grid from "./modules/handlers/grid-handler.js";
import * as Game from './modules/game.js';
import * as Button from './modules/handlers/button-handler.js';

Grid.addBoxes();
Button.setListener(Game.startSetup);
import * as Grid from "./modules/handlers/grid-handler.js";
import * as Setup from './modules/setup.js';
import * as Button from './modules/handlers/button-handler.js';

Grid.addBoxes();
Button.setListener(Setup.start);
import { Ship } from "../objects/ship.js"

// These are used as references when building the player and enemy board
const ships = [
    new Ship("Carrier", 5),
    new Ship("Battleship", 4),
    new Ship("Destroyer", 3),
    new Ship("Submarine", 3),
    new Ship("Patrol Boat", 2)
]

export { ships }
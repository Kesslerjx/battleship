import { Board } from "../objects/board";
import { Enemy } from "../objects/enemy";

let enemy          = new Enemy(new Board());
enemy.possibleHits = [65,45,56,54];
enemy.patternStart = 55;
enemy.hits         = [55,45,35,65];

test('Getting the next spot after trying the opposite direction', () => {
    expect(enemy.move()).toBe(75);
});
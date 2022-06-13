
export function addBoxes() {
    let grid = document.querySelector('#grid');

    for(let x=0;x<100;x++) {
        let box = document.createElement('div');
        box.classList.add('grid-box');
        grid.append(box);
    }
}
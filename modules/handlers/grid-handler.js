
export function addBoxes() {
    let grid = document.querySelector('#grid');

    for(let x=0;x<100;x++) {
        let box = document.createElement('div');
        box.classList.add('grid-box');
        grid.append(box);
    }
}

export function addSetupListeners() {
    let grid = document.querySelector('#grid');

    grid.childNodes.forEach(child => {
        child.addEventListener('mouseover', drawShip);
    })
}

export function drawShip(event) {
    event.target.classList.add('box-ship');
}
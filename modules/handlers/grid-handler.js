
//Gets the grid
export function getGrid() {
    return document.querySelector('#grid');
}

//Adds the grid boxes to the grid
export function addBoxes() {
    for(let x=0;x<100;x++) {
        let box = document.createElement('div');
        box.classList.add('grid-box');
        getGrid().append(box);
    }
}

//Adds an event listener to each grid box
export function addEventListener(type, f) {
    getGrid().childNodes.forEach(child => {
        child.addEventListener(type, f);
    })
}

//Removes an event listener from each grid box
export function removeEventListener(type, f) {
    getGrid().childNodes.forEach(child => {
        child.removeEventListener(type, f);
    })
}

//Draws the ship at the locations
export function drawShip(locations) {
    for(const location of locations) {
        getGrid().childNodes.item(location).classList.add('box-ship');
    }
}

//Erases ships from the grid based on whats in the board
export function eraseShip(board) {
    getGrid().childNodes.forEach( (element, index) => {
        if(board.hasShipAt(index) === false) {
            element.classList.remove('box-ship');
        }
    });
}

export function clearGrid() {
    getGrid().childNodes.forEach( (element, index) => {
        element.classList.remove('box-ship');
        element.classList.remove('box-hit');
        element.classList.remove('box-miss');
        element.classList.remove('box-hover');
    });
}

export function fillGrid(fillBoard, otherBoard) {
    getGrid().childNodes.forEach( (element, index) => {
        if(fillBoard.hasShipAt(index)) {
            element.classList.add('box-ship');
        }
        if(otherBoard.hits.includes(index)) {
            element.classList.add('box-hit');
        }
        if(otherBoard.misses.includes(index)) {
            element.classList.add('box-miss');
        }
    });
}

export function fillGridNoShips(board) {
    getGrid().childNodes.forEach( (element, index) => {
        if(board.hits.includes(index)) {
            element.classList.add('box-hit');
        }
        if(board.misses.includes(index)) {
            element.classList.add('box-miss');
        }
    });
}

export function boxIndex(event) {
    let element = event.target;
    let array = Array.from(event.target.parentElement.childNodes);
    return array.indexOf(element);
}

export function highlightBox(event) {
    getGrid().childNodes.item(boxIndex(event)).classList.add('box-hover');
}

export function unhighlightBox(event) {
    getGrid().childNodes.item(boxIndex(event)).classList.remove('box-hover');
}

export function boxHit(index) {
    getGrid().childNodes.item(index).classList.add('box-hit');
}

export function boxMiss(index) {
    getGrid().childNodes.item(index).classList.add('box-miss');
}
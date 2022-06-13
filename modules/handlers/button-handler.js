
const ID = '#game-button';

export function setListener(lFunction) {
    document.querySelector(ID).addEventListener('click', lFunction);
}

export function removeListener(lFunction) {
    document.querySelector(ID).removeEventListener('click', lFunction);
}

export function changeText(text) {
    document.querySelector(ID).textContent = text;
}
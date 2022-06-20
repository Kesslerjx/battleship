let grid = [20,0,11,9];

function getAdjacentBoxes(i) {
    return [10,-10,1,-1].map(n => {
        let valid = isMoveValid(i+n, n);
        console.log(valid);
        if(valid) {
            return i+n;
        }
    }).filter(n => n !== undefined);
}

function isMoveValid(move, pattern) {
    let previousMove = move - pattern;
    let valid        = grid.includes(move);
    let isHorizontal = [-1,1].includes(pattern);
    let sameRow      = (Math.floor(previousMove/10) === Math.floor(move/10));

    return ((valid && !isHorizontal) || (isHorizontal && sameRow && valid));
}

test('Test for correct adjacent boxes', () => {
    expect(getAdjacentBoxes(10)).toStrictEqual([20,0,11]);
})
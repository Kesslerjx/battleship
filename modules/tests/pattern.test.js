
function isPattern(hits) {
    let move = false;

    if(hits.length >= 2) {
        
        let lastIndex  = hits.length - 1;
        let difference = hits[lastIndex] - hits[lastIndex - 1];

        if([10,-10,1,-1,2,-2,20,-20,3,-3,30,-30].includes(difference)) {
           move = difference
        } 
    }

    return move;
}

test('Pattern from hits', () => {
    expect(isPattern([55,45,35,65])).toBe(30);
});

test('No pattern with 1 item', () => {
    expect(isPattern([10])).toBe(false);
});

test('No pattern with 0 items', () => {
    expect(isPattern([])).toBe(false);
});

test('Horizontal pattern', () => {
    expect(isPattern([1,2,3])).toBe(1);
});
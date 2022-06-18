
function normalizeDifference(difference) {
    if([10,-10].includes(difference)) {
        return difference;
    } else
    if([20,-20,30,-30].includes(difference)) {
        return (10 * Math.sign(difference));
    } else {
        return (1 * Math.sign(difference));
    }
}

test('Vertical by 10', () => {
    expect(normalizeDifference(10)).toBe(10);
})

test('Vertical by -10', () => {
    expect(normalizeDifference(-10)).toBe(-10);
})

test('Vertical by 20', () => {
    expect(normalizeDifference(20)).toBe(10);
})

test('Vertical by -20', () => {
    expect(normalizeDifference(-20)).toBe(-10);
})

test('Vertical by 30', () => {
    expect(normalizeDifference(30)).toBe(10);
})

test('Vertical by -30', () => {
    expect(normalizeDifference(-30)).toBe(-10);
})

test('Horizontal by 1', () => {
    expect(normalizeDifference(1)).toBe(1);
})

test('Horizontal by 3', () => {
    expect(normalizeDifference(3)).toBe(1);
})

test('Horizontal by -2', () => {
    expect(normalizeDifference(-2)).toBe(-1);
})
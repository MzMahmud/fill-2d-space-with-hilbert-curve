const baseHilberIndexToPoint = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
];

function lastTwoBits(n) {
    return n & 3;
}

function hilbertIndexToPoint(hilbertIndex, N) {
    const point = { ...baseHilberIndexToPoint[lastTwoBits(hilbertIndex)] };
    for (let n = 4; n <= N; n *= 2) {
        const nBy2 = n >>> 1;
        const pointOld = { ...point };
        hilbertIndex = hilbertIndex >>> 2;
        switch (lastTwoBits(hilbertIndex)) {
            case 0:
                point.x = pointOld.y;
                point.y = pointOld.x;
                break;
            case 1:
                point.y += nBy2;
                break;
            case 2:
                point.x += nBy2;
                point.y += nBy2;
                break;
            case 3:
                point.x = nBy2 - 1 - pointOld.y + nBy2;
                point.y = nBy2 - 1 - pointOld.x;
                break;
        }
    }
    return point;
}
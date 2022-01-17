// main.ts 
function largestSquare(x: number): number {
    if(x < 0){
        throw RangeError();
    }
    let perfect_square = 0;
    for(let i = 0; perfect_square <= x; i++){
        perfect_square = i * i;
    }
    return perfect_square;
}

console.log(largestSquare(17)) // 16
// console.log(largestSquare(-5)) // range error

"use strict";
function fibRec(n) {
    if (n < 0n) {
        throw new RangeError();
    }
    if (n == 0n) {
        return 0n;
    }
    if (n == 1n) {
        return 1n;
    }
    return fibRec(n - 1n) + fibRec(n - 2n);
}
console.log(fibRec(0n)); // 0
console.log(fibRec(1n)); // 1
console.log(fibRec(4n)); // 3
console.log(fibRec(6n)); // 8 
console.log(fibRec(-3n)); // error

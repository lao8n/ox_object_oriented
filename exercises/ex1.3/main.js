"use strict";
function fib(n) {
    let beforeLastValue = 0n;
    if (n == 0n) {
        return beforeLastValue;
    }
    let lastValue = 1n;
    let tempSum;
    for (let i = 1n; i <= n; i++) {
        tempSum = beforeLastValue + lastValue;
        beforeLastValue = lastValue;
        lastValue = tempSum;
    }
    return lastValue;
}
console.log(fib(0n)); // 0
console.log(fib(1n)); // 1
console.log(fib(2n)); // 1
console.log(fib(3n)); // 2
console.log(fib(4n)); // 3
console.log(fib(5n)); // 5
console.log(fib(6n)); // 8
console.log(fib(7n)); // 13

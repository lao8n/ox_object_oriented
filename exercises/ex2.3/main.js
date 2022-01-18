"use strict";
function filter(a, f) {
    let result = [];
    for (const num of a) {
        if (f(num)) {
            result.push(num);
        }
    }
    return result;
}
function isEven(a) {
    if (a % 2 == 0) {
        return true;
    }
    return false;
}
console.log(filter([5, 3, 4], isEven)); // [4]
console.log(filter([-2, 3, 0], isEven)); // [-2, 0]
console.log(filter([5, 3, 4], (x) => { if (x % 2 == 0) {
    return true;
} return false; }));

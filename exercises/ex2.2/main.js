"use strict";
function map(a, f) {
    for (let i = 0; i < a.length; i++) {
        a[i] = f(a[i]);
    }
    return a;
}
function multiplyBy2(x) {
    return x * 2;
}
console.log(map([5, 3, 4], multiplyBy2));
console.log(map([-2, 3, 0], multiplyBy2));

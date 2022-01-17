"use strict";
// function range(n : number): number[]{
//     let result = [];
//     for(let i=0 ; i < n; i++){
//         result.push(i);
//     }
//     return result;
// }
function range(s, n) {
    if (n == undefined) {
        n = s;
        s = 0;
    }
    let result = [];
    for (s; s < n; s++) {
        result.push(s);
    }
    return result;
}
console.log(range(5)); // [0, 1, 2, 3, 4]
console.log(range(3, 7)); // [3, 4, 5, 6]

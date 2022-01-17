function map(a: number[], f: (x: number) => number): number[] {
    // in-place
    for(let i=0; i < a.length; i++){
        a[i] = f(a[i]!);
    }
    return a;
}

function multiplyBy2(x: number): number {
    return x * 2;
}

console.log(map([5, 3, 4], multiplyBy2)); // [10, 6, 8]
console.log(map([-2, 3, 0], multiplyBy2)); // [-4, 6, 0]
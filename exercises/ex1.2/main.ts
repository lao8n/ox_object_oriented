function fibRec(n: bigint): bigint {
    if(n < 0n){
        throw new RangeError();
    }
    if(n == 0n){
        return 0n;
    } 
    if(n == 1n){
        return 1n;
    }
    return fibRec(n-1n) + fibRec(n-2n);
}

function fibRecMemoize(n: bigint, cache: bigint[]): bigint {
    let i = Number(n)
    if(cache[i] != undefined){
        return cache[i]!;
    } 
    cache[i] = fibRecMemoize(n - 1n, cache) + fibRecMemoize(n - 2n, cache)
    return cache[i]!; 
}

function fibRec2(n: bigint): bigint {
    if(n < 0n){
        throw new RangeError();
    }
    let cache = [0n, 1n];
    return fibRecMemoize(n, cache);
}

console.log(fibRec(0n)); // 0
console.log(fibRec(1n)); // 1
console.log(fibRec(4n)); // 3
console.log(fibRec(6n)); // 8 
console.log(fibRec(-3n)); // error

console.log(fibRec2(0n)); // 0
console.log(fibRec2(1n)); // 1
console.log(fibRec2(4n)); // 3
console.log(fibRec2(6n)); // 8 
console.log(fibRec2(10n)); 
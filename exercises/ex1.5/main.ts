function fibRecWithDepth(n: bigint, d: bigint): bigint {
    if(n < 0n){
        throw new RangeError();
    }
    if(d == 0n){
        console.log("/* Output:")
    }
    let indentation = "";
    for(let i = 0n; i < d; i++){
        indentation += "| ";
    }
    console.log(`${indentation}fib(${n})`); // before recursion
    if(n == 0n){
        console.log(`${indentation}= 0`);
        return 0n;
    } 
    if(n == 1n){
        console.log(`${indentation}= 1`);
        return 1n;
    }
    let sum = fibRecWithDepth(n-1n, d+1n) + fibRecWithDepth(n-2n, d+1n);
    console.log(`${indentation}= ${sum}`); // after recursion
    if(d == 0n){
        console.log("*/");
    }
    return sum;
}

function fibRec(n: bigint): bigint {
    return fibRecWithDepth(n, 0n);
}

console.log(fibRec(3n)); // 0
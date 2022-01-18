function findX(tooBig: (y: bigint) => boolean): bigint {
    let a = 1n;
    while(true){
        let k = 0n;
        while(!tooBig(a + 2n**k)){
            k++;
        }        
        if(k == 0n){
            return a;
        }
        a = a + 2n ** (k-1n);
    }
}

console.log(findX(y => y > 9)) // 9
console.log(findX(y => y > 15)) // 15
console.log(findX(y => y > 37)) // 37
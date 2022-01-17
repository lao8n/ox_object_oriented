function fibRec(n: bigint): bigint {
    if(n == 0n){
        return 0n;
    } 
    if(n == 1n){
        return 1n;
    }
    return fibRec(n-1n) + fibRec(n-2n);
}
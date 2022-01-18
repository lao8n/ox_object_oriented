function hits(a: number[]): bigint {
    // brute force = for every value loop through all values before it to see if less than current value O(n^2)
    // use memory = can use O(1) memory to store current max for values up to j-1, 
    // then to hit we need a[j] > max -> which if true we update . this is O(1)
    
    // can't do max = NaN as cannot do max == NaN
    // can't do max uninitialized as get Variable 'max' is used before being assigned
    let max : number | undefined
    let count = 0n
    for(const num of a){
        if(max == undefined){
            max = num;
            count = 1n; // first case
        } else if (num > max){ 
            max = num;
            count++;
        }
    }
    return count;
}

console.log(hits([5, 3, 4])) // 1
console.log(hits([-2, 3, 1])) // 2
console.log(hits([-2, 3, 1, 4])) // 3
function sum(a: number[]): number {
    let sum = 0;
    for(const num of a){
        sum += num;
    }
    return sum;
}

console.log(sum([5, 3, 4])); // 12
console.log(sum([-2, 3, 0])); // 1
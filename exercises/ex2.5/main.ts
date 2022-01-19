function max(...nums: number[]): number {
    if(nums.length == 0) {
        throw new Error("Expected at least 1 arguments, but got 0");
    }
    let max = nums[0]!;
    for(const num of nums){
        if(num > max){
            max = num;
        }
    }
    return max;
}

console.log(max(5, 3, 4)); // 5
console.log(max(-2, -3, -1)); // -1 
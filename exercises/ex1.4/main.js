"use strict";
function isPalindrome(str) {
    // use two pointer approach
    // len 6 then 6 / 2 = 3 and just want 0, 1, 2 index
    // len 5 then 5 / 2 = 2 and just want 0, 1 index
    for (let i = 0; i < str.length / 2; i++) {
        // console.log(str.charAt(i) + " " + str.charAt(str.length - i - 1));
        if (str.charAt(i) != str.charAt(str.length - i - 1)) {
            return false;
        }
    }
    return true;
}
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("abcba")); // true
console.log(isPalindrome("abccba")); // true

"use strict";
// unclear on how getters & setters interact with this.den code
// _den error that it is not definitively set which is still there even without the RangeError
class Frac {
    constructor(num, den) {
        this._den = 0n; // have to initialize here
        this.num = num;
        this.den = den;
    }
    get den() {
        return this._den;
    }
    set den(den) {
        if (den == undefined) {
            den = 1n;
        }
        if (den == 0n) {
            throw RangeError("cannot set denominator to zero");
        }
        if (den < 0n) {
            den = -1n * den;
            this.num = -1n * this.num;
        }
        this._den = den;
    }
    add(other) {
        return new Frac(this.num * other.den + this.den * other.num, this.den * other.den);
    }
    toString() {
        if (this.den == 1n) {
            return this.num.toString();
        }
        return `${this.num.toString()}/${this.den.toString()}`;
    }
    valueOf() {
        return Number(this.num) / Number(this.den);
    }
}
const frac1 = new Frac(3n, 2n);
const frac2 = new Frac(2n);
console.log(`${frac1} + ${frac2} = ${frac1.add(frac2)}`);
console.log(`${frac1} <= ${frac2} ? ${frac1 <= frac2}`);

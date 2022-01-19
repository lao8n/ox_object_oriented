export {};

class Frac{
    num: bigint;
    private _den!: bigint; // have to initialize private _den: bigint = 0n; or use !
   
    constructor(num: bigint, den?: bigint){
        this.num = num;
        this.den = den;
    }

    get den(): bigint {
        return this._den;
    }

    set den(den : bigint | undefined) { // allow undefined in the setter
        if(den == undefined){
            den = 1n;
        }
        if(den == 0n){
            throw RangeError("cannot set denominator to zero");
        }
        if(den < 0n){
            den = -1n * den;
            this.num = -1n * this.num;
        }
        this._den = den;
    }

    add(other : Frac): Frac {
        return new Frac(this.num * other.den + this.den * other.num, this.den * other.den);
    }

    toString(): string {
        if(this.den == 1n){
            return this.num.toString();
        }
        return `${this.num.toString()}/${this.den.toString()}`
    }

    valueOf(): number {
        return Number(this.num) / Number(this.den);
    }
}

const frac1 = new Frac(3n,2n);
const frac2 = new Frac(2n);
console.log(`${frac1} + ${frac2} = ${frac1.add(frac2)}`);
console.log(`${frac1} <= ${frac2} ? ${frac1 <= frac2}`);
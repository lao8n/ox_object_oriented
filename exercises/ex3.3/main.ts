// Questions
// 1. should private things always be initialized with setters?

/**
* Class for a bag of strings.
*/
class Bag {
    /**
    * Dictionary (type with index signature)
    * mapping each unique string in the bag to
    * the number of copies that appear (a bigint).
    */
    private _strings: {
        [str: string]: bigint
    } = {};

    constructor(...strings: string[]) {
        /* Add all strings to this bag.*/
        for(const str of strings){
            this.add(str);
        }
    }

    /**
    * The total number of strings in this bag,
    * each counted with its multiplicity.
    */
    get size(): bigint { 
        // could store this as a private property that is updated everytime we insert
        // cannot use functional methods or for ...of this._strings so use key index
        let sum = 0n;
        for (const str in this._strings){
            sum = sum + this.count(str);
        }
        return sum;
    }

    /**
    * Adds a new string to the bag.
    */
    public add(str: string): void { 
        if(this._strings[str] == undefined){
            this._strings[str] = 1n;
        }
        else {
            this._strings[str]++;
        }
     }

    /**
    * deletes a string from the bag.
    */
    public delete(str: string): void { 
        if(this._strings[str] == 1n){
            delete this._strings[str];
        }
        else if(this._strings[str] != undefined){
            this._strings[str]--;
        }
        // if undefined do nothing
     }

    /**
    * Counts how many copies of a given string
    * exist in the bag.
    *
    * Hint: use the nullish coalescing operator ??
    */
    public count(str: string): bigint {
        return this._strings[str] ?? 0n;
    }

    /**
    * Returns a new array containing all unique
    * strings in this bag (each appearing once).
    */
    public values(): string[] {
        let v : string[] = [];
        for (const str in this._strings){ 
            v.push(str);
        }
        return v;
    }

    /**
    * Returns a new array containing all strings
    * in this bag, counted with their multiplicity.
    */
    public toArray(): string[] {
        let v : string[] = [];
        for(const str in this._strings){
            for(let count = this.count(str); count != 0n; count--){
                v.push(str);
            }
        }
        return v;
    }

    /**
    * Compares this bag with another bag for equality
    * (same strings, same multiplicities).
    *
    * Hint: use 'values' and 'count' for both bags,
    * but don't rely on the order of values.
    */
    public equals(other: Bag): boolean {
        if(this.values().length != other.values().length){
            return false;
        }
        for(const str of this.values()){
            if(this.count(str) != other.count(str)){
                return false;
            }
        }
        return true;
    }
}

const bag1 = new Bag("a", "c", "a", "b", "a", "b");
const bag2 = new Bag("c", "a", "b", "b");
console.log(bag1.size); // 6n
console.log(bag2.count("b")); // 2n
console.log(bag1.toArray()) // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag1.values()) // ['a', 'c', 'b']
console.log(bag2.values()) // ['c', 'a', 'b']
console.log(bag2.toArray()) // [ 'c', 'a', 'b', 'b' ]
console.log(bag1.equals(bag2)); // false
bag1.delete("a");
bag2.add("a");
console.log(bag1.equals(bag2)); // true
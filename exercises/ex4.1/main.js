"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractBag {
    get size() {
        let sum = 0n;
        for (const str of this.values()) {
            sum = sum + this.count(str);
        }
        return sum;
    }
    has(str) {
        if (this.count(str) != 0n) { // could be >
            return true;
        }
        return false;
    }
    equals(other) {
        if (this.values().length != other.values().length) {
            return false;
        }
        for (const str of this.values()) {
            console.log(str, this.count(str), other.count(str));
            if (this.count(str) != other.count(str)) {
                return false;
            }
        }
        return true;
    }
    toArray() {
        let v = [];
        for (const str of this.values()) {
            for (let count = this.count(str); count != 0n; count--) {
                v.push(str);
            }
        }
        return v;
    }
}
class ReadonlyBag extends AbstractBag {
    constructor(...strings) {
        super();
        this._strings = {};
        for (const str of strings) {
            this.add(str);
        }
    }
    count(str) {
        return this._strings[str] ?? 0n;
    }
    values() {
        let v = [];
        for (const str in this._strings) {
            v.push(str);
        }
        return v;
    }
    // + one protected method of your design
    add(str) {
        if (this._strings[str] == undefined) {
            this._strings[str] = 1n;
        }
        else {
            this._strings[str]++;
        }
    }
    // needed two protected methods not just one
    delete(str) {
        if (this.count(str) == 1n) {
            delete this._strings[str];
        }
        else if (this.count(str) != 0n) {
            this._strings[str]--;
        }
    }
}
class MutableBag extends ReadonlyBag {
    constructor(...strings) {
        super(...strings);
    }
    // exposes protected method
    add(str) {
        super.add(str);
    }
    delete(str) {
        super.delete(str);
    }
}
const bag1 = new ReadonlyBag("a", "c", "a", "b", "a", "b");
const bag2 = new ReadonlyBag("c", "a", "b", "b");
console.log(bag1.size); // 6n
console.log(bag2.count("b")); // 2n
console.log(bag1.toArray()); // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag1.values()); // ['a', 'c', 'b']
console.log(bag2.values()); // ['c', 'a', 'b']
console.log(bag2.toArray()); // [ 'c', 'a', 'b', 'b' ]
console.log(bag1.equals(bag2)); // false
const bag1Mutable = new MutableBag("a", "c", "a", "b", "a", "b");
const bag2Mutable = new MutableBag("c", "a", "b", "b");
console.log(bag1Mutable.size); // 6n
console.log(bag2Mutable.count("b")); // 2n
console.log(bag1Mutable.toArray()); // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag1Mutable.values()); // ['a', 'c', 'b']
console.log(bag2Mutable.values()); // ['c', 'a', 'b']
console.log(bag2Mutable.toArray()); // [ 'c', 'a', 'b', 'b' ]
console.log(bag1Mutable.equals(bag2)); // false
bag1Mutable.delete("a");
bag2Mutable.add("a");
console.log(bag1Mutable.equals(bag2Mutable)); // true

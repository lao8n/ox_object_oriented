export {};

abstract class AbstractBag {
    get size(): bigint {
        let sum = 0n;
        for(const str of this.values()){
            sum = sum + this.count(str);
        }
        return sum;
    }

    public has(str: string): boolean {
        if(this.count(str) != 0n){ // could be >
            return true;
        }
        return false;
    }

    public equals(other: AbstractBag): boolean {
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

    public toArray(): string[] {
        let v : string[] = [];
        for(const str of this.values()){
            for(let count = this.count(str); count != 0n; count--){
                v.push(str);
            }
        }
        return v;
    }
    public abstract count(str: string): bigint

    public abstract values(): string[]

}

class ReadonlyBag extends AbstractBag{
    private _strings: { [str: string]: bigint } = {};
    constructor(...strings: string[]) {
        super();
        for(const str of strings){
            this.add(str);
        }
    }

    public count(str: string): bigint {
        return this._strings[str] ?? 0n;
    }

    public values(): string[] {
        let v : string[] = [];
        for (const str in this._strings){ 
            v.push(str);
        }
        return v;
    }

    // + one protected method of your design
    protected add(str : string): void {
        if(this._strings[str] == undefined){
            this._strings[str] = 1n;
        }
        else {
            this._strings[str]++;
        }
    }

    // needed two protected methods not just one
    protected delete(str : string): void {
        if(this.count(str) == 1n){
            delete this._strings[str];
        }
        else if(this.count(str) != 0n){
            this._strings[str]--;
        }    
    }
}

class MutableBag extends ReadonlyBag{
    constructor(...strings: string[]) { 
        super(...strings);
    }
    // exposes protected method
    public add(str: string) {
        super.add(str);
    }
    public delete(str: string) {
        super.delete(str);
    }
}

const bag1 = new ReadonlyBag("a", "c", "a", "b", "a", "b");
const bag2 = new ReadonlyBag("c", "a", "b", "b");
console.log(bag1.size); // 6n
console.log(bag2.count("b")); // 2n
console.log(bag1.toArray()) // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag1.values()) // ['a', 'c', 'b']
console.log(bag2.values()) // ['c', 'a', 'b']
console.log(bag2.toArray()) // [ 'c', 'a', 'b', 'b' ]
console.log(bag1.equals(bag2)); // false
const bag1Mutable = new MutableBag("a", "c", "a", "b", "a", "b");
const bag2Mutable = new MutableBag("c", "a", "b", "b")
console.log(bag1Mutable.size); // 6n
console.log(bag2Mutable.count("b")); // 2n
console.log(bag1Mutable.toArray()) // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag1Mutable.values()) // ['a', 'c', 'b']
console.log(bag2Mutable.values()) // ['c', 'a', 'b']
console.log(bag2Mutable.toArray()) // [ 'c', 'a', 'b', 'b' ]
console.log(bag1Mutable.equals(bag2)); // false
bag1Mutable.delete("a");
bag2Mutable.add("a");
console.log(bag1Mutable.equals(bag2Mutable)); // true
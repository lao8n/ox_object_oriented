
// Exercise 1.1

export function largestSquare(x: number): number {
    if (!Number.isFinite(x) || x < 0) {
        throw new RangeError("Not a non-negative real number.");
    }
    let i = 0;
    while (i ** 2 <= x){
        i += 1;
    }
    return (i-1) ** 2;
}

console.log("1.1:", largestSquare(20)); // 16

// Exercise 1.2

export function fibRec(n: bigint): bigint {
    if (n < 0n) {
        throw new RangeError("Not a non-negative integer.");
    }
    switch (n) {
        case 0n:
            return 0n;
        case 1n:
            return 1n;
        default:
            return fibRec(n-1n)+fibRec(n-2n);
    }
}

console.log("1.2:", fibRec(6n)); // 8n

// Exercise 1.3

export function fib(n: bigint): bigint {
    if (n < 0n) {
        throw new RangeError("Not a non-negative integer.");
    }
    let a = 0n;
    let b = 1n;
    for (let i = 0n; i < n; i++) {
        const tmp = b;
        b = a+b;
        a = tmp;
        // or using destructuring: [a, b] = [b, a+b];
    }
    return a;
}

console.log("1.3:", fib(6n)); // 8n

// Exercise 1.4

export function isPalindrome(str: string): boolean {
    const len = str.length;
    for (let i = 0; i < Math.floor(len/2); i++) {
        if (str[i] !+ str[len-1-i]) {
            return false;
        }
    }
    return true;
}

console.log("1.4:", isPalindrome("racecar")); // true

// Exercise 1.5*

function _printFib(n: bigint, depth: number): bigint {
    const indent = "| ".repeat(depth);
    console.log(`${indent}fib(${n})`);
    let fibN: bigint;
    switch (n) {
        case 0n:
            fibN = 0n;
            break;
        case 1n:
            fibN = 1n;
            break
        default:
            fibN = _printFib(n-1n, depth+1)+_printFib(n-2n, depth+1);
    }
    console.log(`${indent}= ${fibN}`);
    return fibN;
}

export function printFib(n: bigint) {
    if (n < 0n) {
        throw new RangeError("Not a non-negative integer.");
    }
    _printFib(n, 0);
}

console.log("1.5:");
printFib(3n)
/*
fib(3)
| fib(2)
| | fib(1)
| | = 1
| | fib(0)
| | = 0
| = 1
| fib(1)
| = 1
= 2
*/

/* Exercise 1.6

1. number | never = number
2. number | unknown = unknown
3. string & never = never
4. string & unknown = string 
5. number & bigint = never
6. number & boolean = never
7. number & (number | undefined) = number
8. string | (boolean & bigint) = string
9. number | (number & number) = number
10. number|undefined is not a basic type
11. number&undefined = never

*/

// Exercise 2.1

export function sum(a: number[]): number {
    let s = 0;
    for (let item of a) {
        s += item;
    }
    return s;
}

console.log("2.1:", sum([1,2,3,4])); // 10

// Exercise 2.2

export function map(a: number[], f: (x: number) => number): number[] {
    const b: number[] = [];
    for (let x of a) {
        b.push(f(x));
    }
    return b;
}

console.log("2.2:", map([1, 2, 3, 4], x => 2*x)); // [2, 4, 6]

// Exercise 2.3

export function filter(a: number[], f: (x: number) => boolean): number[] {
    const b: number[] = [];
    for (let x of a) {
        if (f(x)) {
            b.push(x);
        }
    }
    return b;
}

console.log("2.3:", filter([1, 2, 3, 4], x => x%2==0)); // [2, 4]

// Exercise 2.4

function range(fst: number, snd?: number): number[] {
    let s: number, n: number;
    if (snd == undefined) { // range(n)
        [s, n] = [0, fst];
    } else {                // range(s, n)
        [s, n] = [fst, snd];
    }
    const a: number[] = [];
    for (let i = s; i < n; i++) {
        a.push(i);
    }
    return a;
    // // More elegant:
    // return Array(n-s).map((_, idx) => s+idx);
    // // num items ^^^    index ^^^     ^^^^^ s+0, s+1, ..., s+(n-s-1)      
}

console.log("2.4:", range(2, 7));

// Exercise 2.5

function max(fst: number, ...rest: number[]): number {
    let m = fst;
    for (const x of rest) {
        if (x > m) {
            m = x;
        }
    }
    return m;
}

console.log("2.5:", max(1, 5, 3)); // 5

// Exercise 2.6*

export function hits(a: number[]): bigint {
    let numHits = 0n;
    let maxEl: number|undefined = undefined;
    for (let el of a) {
        if (maxEl == undefined || el > maxEl) {
            numHits += 1n;
            maxEl = el;
        }
    }
    return numHits;
}

console.log("2.6:", hits([1,0,2,1,2,0,5,2,4,3,4,6,5,6,7,8])); // 6n
// hits:                  ^   ^       ^         ^     ^ ^

// Exercise 2.7**

export function findX(tooBig: (y: bigint) => boolean): bigint {
    let a = 1n;
    while (true) {
        let k = 0n;
        while (!tooBig(a+2n**k)) {
            k += 1n;
        }
        if (k == 0n) {
            return a;
        }
        a = a+2n**(k-1n);
    }
}

console.log("2.7:", findX(y => 17n < y)); // 17n

export function findXVerbose(tooBig: (y: bigint) => boolean): bigint {
    console.log(`findX(${tooBig}):`);
    let a = 1n;
    let i = 1n;
    while (true) {
        let k = 0n;
        while (!tooBig(a+2n**k)) {
            k += 1n;
        }
        console.log(`  a_${i} = ${a}\tk_${i} = ${k}`);
        if (k == 0n) {
            console.log(`  secret found: x = ${a}`);
            return a;
        }
        a = a+2n**(k-1n);
        i += 1n;
    }
}

findXVerbose(y => 23n < y);

// Exercise 3.1

export type AuthUser = {
    id: number
    name: string
    surname: string
}

export function sortUsers(users: AuthUser[], sortBy: "id"|"name"|"surname"){
    const compareFn = (a: AuthUser, b: AuthUser) => {
        if (a[sortBy] > b[sortBy]){ return +1; }
        if (a[sortBy] < b[sortBy]){ return -1; }
        return 0;
    }
    users.sort(compareFn);
}

/*
// Alternative implementation using arrow function:

function compareFn(sortBy: "id"|"name"|"surname", a: AuthUser, b: AuthUser) {
    if (a[sortBy] > b[sortBy]){ return +1; }
    if (a[sortBy] < b[sortBy]){ return -1; }
    return 0;
}
export function sortUsers(users: AuthUser[], sortBy: "id"|"name"|"surname"){
    users.sort((a, b) => compareFn(sortBy, a, b));
}
*/

const authUsers = [
    {id: 3, name: "Alice", surname: "Rossi"},
    {id: 2, name: "Bob", surname: "Adamson"},
    {id: 1, name: "Charlie", surname: "Smith"}
];

console.log("3.1:")
console.log(authUsers);
/* [
  { id: 3, name: 'Alice', surname: 'Rossi' },
  { id: 2, name: 'Bob', surname: 'Adamson' },
  { id: 1, name: 'Charlie', surname: 'Smith' }
] */
sortUsers(authUsers, "id");
console.log(authUsers);
/* [
  { id: 1, name: 'Charlie', surname: 'Smith' },
  { id: 2, name: 'Bob', surname: 'Adamson' },
  { id: 3, name: 'Alice', surname: 'Rossi' }
] */
sortUsers(authUsers, "name");
console.log(authUsers);
/* [
  { id: 3, name: 'Alice', surname: 'Rossi' },
  { id: 2, name: 'Bob', surname: 'Adamson' },
  { id: 1, name: 'Charlie', surname: 'Smith' }
] */
sortUsers(authUsers, "surname");
console.log(authUsers);
/* [
  { id: 2, name: 'Bob', surname: 'Adamson' },
  { id: 3, name: 'Alice', surname: 'Rossi' },
  { id: 1, name: 'Charlie', surname: 'Smith' }
] */

// Exercise 3.2

export class Frac {
    constructor(public num: bigint, private _den: bigint = 1n){
        this.den = _den;
    }
    get den(): bigint {return this._den; }
    set den(x: bigint) {
        if (x == 0n){
            throw Error("Denominator cannot be zero.");
        }
        if (x < 0n) {
            x *= -1n;
            this.num *= -1n;
        }
        this._den = x;
    }
    add(other: Frac): Frac {
        const num = this.num*other.den+this.den*other.num;
        const den = this.den*other.den;
        return new Frac(num, den);
    }
    toString(): string {
        if (this.den == 1n) {
            return `${this.num}`;
        }
        return `${this.num}/${this.den}`;
    }
    valueOf(): number {
        return Number(this.num)/Number(this.den);
    }
}

console.log("3.2:");
const frac1 = new Frac(3n,2n);
const frac2 = new Frac(2n); 
console.log(`  ${frac1} + ${frac2} = ${frac1.add(frac2)}`);
// "3/2 + 2 = 7/2"
console.log(`  ${frac1} <= ${frac2} ? ${frac1 <= frac2}`);
// "3/2 <= 2 ? true"


// Exercise 3.3

/**
 * Class for a bag of strings.
 */
export class Bag {
    /**
     * Dictionary (type with index signature
     * mapping each unique string in the bag to
     * the number of copies that appear (a bigint).
    */
    private _strings: {
        [str: string]: bigint
    } = {}
    
    constructor(...strings: string[]) {
        for (const str of strings){
            this.add(str);
        }
    }
    
    /**
     * The total number of strings in this bag,
     * each counted with its multiplicity.
     */
    get size(): bigint {
        let s = 0n;
        for (const str in this._strings){
            s += this.count(str);
        }
        return s;
    }

    /**
     * Adds a new string to the bag.
     * @param str - the string to be added
     */
    public add(str: string): void {
        const count = this.count(str);
        this._strings[str] = count+1n;
    }

    /**
     * Deletes a string from the bag.
     * @param str - the string to be deleted
     */
    public delete(str: string): void {
        const count = this.count(str);
        if (count > 0n){
            this._strings[str] = count-1n;
        }
    }

    /**
     * Counts how many copies of a given string
     * exist in the bag.
     * @param str - string to count the multiplicity of
     */
    public count(str: string): bigint {
        return this._strings[str]??0n;
    }

    /**
     * Returns a new array containing all unique
     * strings in this bag (each appearing once).
     */
    public values(): string[] {
        const a: string[] = [];
        for (const str in this._strings) {
            if (this.count(str) > 0n) {
                a.push(str);
            }
        }
        return a;
    }

    /**
     * Returns a new array containing all strings
     * in this bag, counted with their multiplicity.
     */
    public toArray(): string[] {
        const a: string[] = [];
        for (const str in this._strings) {
            const count = this.count(str);
            for (let i = 0; i < count; i++) {
                a.push(str);
            }
        }
        return a;
    }

    /**
     * Compares this bag with another bag for equality
     * (same strings, same multiplicities).
     * @param other - other bag to compare for equality
     */
    public equals(other: Bag): boolean {
        for (const strSet of [this._strings, other._strings]){
            for (const str in strSet){
                if (this.count(str) != other.count(str)) {
                    return false;
                }
            }
        }
        return true;
    }    
}

console.log("3.3:");
const bag1 = new Bag("a", "c", "a", "b", "a", "b");
const bag2 = new Bag("c", "a", "b", "b");
console.log(bag1.size); // 6n
console.log(bag2.count("b")); // 2n
console.log(bag1.toArray()) // [ 'a', 'a', 'a', 'c', 'b', 'b' ]
console.log(bag2.toArray()) // [ 'c', 'a', 'b', 'b' ]
console.log(bag1.values()) // ['a', 'c', 'b']
console.log(bag2.values()) // ['c', 'a', 'b']
console.log(bag1.equals(bag2)); // false
bag1.delete("a");
bag2.add("a");
console.log(bag1.equals(bag2)); // true


// Exercise 4.1 and 4.2

interface Sized {
    readonly size: number|bigint
}

interface Queryable {
    has(str: string): boolean
}

interface Mutable {
    add(str: string): void
    delete(str: string): void
}

interface Countable {
    count(str: string): bigint
}

interface ValueIterable {
    values(): Iterable<string>
}

interface IBag extends Sized, Queryable, Countable, ValueIterable {}
interface ISet extends Sized, Queryable, Mutable, ValueIterable {}
const testISet: (x: Set<string>) => ISet = x => x;

export abstract class AbstractBag implements IBag{
    get size(): bigint {
        // return this.values()
        //        .map(str=>this.count(str))
        //        .reduce((acc, count) => acc+count);
        let acc = 0n;
        for (const str of this.values()) {
            acc += this.count(str);
        }
        return acc;
    }
    public has(str: string): boolean {
        return this.count(str) > 0n;
    }
    public equals(other: AbstractBag): boolean {
        for (const str of this.values().concat(other.values())){
            if (this.count(str) != other.count(str)){
                return false;
            }
        }
        return true;
    }
    public toArray(): string[] {
        // return this.values()
        //        .map(str => Array(Number(this.count(str))).fill(str))
        //        .flat();
        const a: string[] = [];
        for (const str of this.values()) {
            for (let i = 0; i < this.count(str); i++) {
                a.push(str);
            }
        }
        return a;
    }
    public abstract count(str: string): bigint
    public abstract values(): string[]
}
export class ReadonlyBag extends AbstractBag{
    private _strings: { [str: string]: bigint } = {};
    constructor(...strings: string[]) {
        super();
        for (const str of strings) {
            this.setCount(str, this.count(str)+1n);
        }
    }
    public count(str: string): bigint {
        return this._strings[str] ?? 0n;
    }
    public values(): string[] {
        const a: string[] = [];
        for (const str in this._strings) {
            if (this.count(str) > 0n) {
                a.push(str);
            }
        }
        return a;
    }
    protected setCount(str: string, newCount: bigint): bigint {
        if (newCount < 0n){
            newCount = 0n; // this convention makes delete easier
        }
        const oldCount = this.count(str);
        this._strings[str] = newCount;
        return oldCount;
    }
}
export class MutableBag extends ReadonlyBag implements Mutable{
    constructor(...strings: string[]) {
        super(...strings);
    }
    public add(str: string) {
        this.setCount(str, this.count(str)+1n);
    }
    public delete(str: string) {
        this.setCount(str, this.count(str)-1n);
    }
}

// Exercise 4.3

export type Colour = 'Black' | 'White';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
type Pos = readonly [File, Rank];

function fileToNumber(file: File): number{
    return 1+['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].indexOf(file);
}

function file(pos: Pos): File { return pos[0]; }

function rank(pos: Pos): Rank { return pos[1]; }

function fileDifference(from: Pos, to: Pos): number {
    return Math.abs(fileToNumber(file(to))-fileToNumber(file(from)));
}

function rankDifference(from: Pos, to: Pos): number {
    return Math.abs(rank(to)-rank(from));
}

export class Piece {
    constructor(public readonly colour: Colour,
                private _pos: Pos,
                public readonly canMoveTo: (from: Pos, to: Pos) => boolean){}
    get position(): Pos{
        return this._pos;
    }
}

function queenCanMoveTo(from: Pos, to: Pos): boolean {
    const fileDiff = fileDifference(from, to);
    const rankDiff = rankDifference(from, to);
    return fileDiff == rankDiff || fileDiff == 0 || rankDiff == 0;
}

export function Queen(colour: Colour, position: Pos): Piece{
    return new Piece(colour, position, queenCanMoveTo);
}

function pawnCanMoveTo(from: Pos, to: Pos): boolean {
    const [currFile, currRank] = from;
    const [nextFile, nextRank] = to;
    return currFile == nextFile && nextRank == currRank+1;
}

export function Pawn(colour: Colour, position: Pos): Piece{
    return new Piece(colour, position, pawnCanMoveTo);
}


function bishopCanMoveTo(from: Pos, to: Pos): boolean {
    const fileDiff = fileDifference(from, to);
    const rankDiff = rankDifference(from, to);
    return fileDiff == rankDiff;
}

export function Bishop(colour: Colour, position: Pos): Piece{
    return new Piece(colour, position, bishopCanMoveTo);
}

// Exercise 4.4

type MessageID = bigint;
type EmailAddress = string;
interface EmailClient {
    createMessage(to: readonly EmailAddress[], subject: string): EmailMessage
    sendMessage(message: EmailMessage): void
    readonly contactBook: {
        [name: string]: EmailAddress
    }
    readonly inbox: EmailFolder
    readonly archive: EmailFolder
    readonly sent: SentFolder
}

interface ReadonlyEmailMessage {
    readonly to: readonly EmailAddress[]
    readonly subject: string
    readonly contents: string
};

interface EmailMessage extends ReadonlyEmailMessage {
    contents: string
};

interface EmailFolder {
    filter(subjectContains?: string, from?: EmailAddress): readonly ReadonlyEmailMessage[]
    store(message: EmailMessage): void
}

interface SentFolder extends EmailFolder{
    filter(subjectContains?: string): readonly ReadonlyEmailMessage[]
    contains(message: EmailMessage): boolean // necessary for isMessageSent
}

type Data = "HTML" | "JavaScript";
type Success = {
    tag: `${Data}Success`,
    payload: string
}
type Failure = {
    tag: `${Data}Failure`,
    message: string
}
export function handle(res: Success | Failure) {
    switch (res.tag) {
        case "HTMLSuccess": // res: Success inferred
            console.log("Fetched HTML body: ", res.payload);
            break;
        case "JavaScriptSuccess": // res: Success inferred
            console.log("Fetched JS code: ", res.payload);
            break;
        case "HTMLFailure": // res: Failure inferred
            console.log("Failed to fetch HTML body. Error: ", res.message);
            break;
        default: // tag: "JavaScriptFailure" inferred => res: Failure inferred
            console.log("Failed to fetch JS code. Error: ", res.message);
            break;
    }
}
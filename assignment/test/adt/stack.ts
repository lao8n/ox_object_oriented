import * as _chai from 'chai';
import { Stack } from '../../src/adt/stack';
import 'mocha';

describe('adt stack constructor', () => {
    it('can construct', () => {
        const s = new Stack(5);
        _chai.assert.instanceOf(s, Stack);
    });
});

describe('adt stack push', () => {
    it('can push number', () => {
        const s = new Stack(5);
        s.push(3);
        _chai.assert.equal(s.size(), 1);
    });
    it('can push different types', () => {
        const s = new Stack(5);
        s.push(3);
        s.push("hello");
        _chai.assert.equal(s.size(), 2);
    });
    it('errors if stack is full', () => {
        const s = new Stack<number>(2);
        s.push(3);
        s.push(1);
        _chai.expect(() => s.push(2)).to.throw(
            "Cannot push, stack is already full"
        );
    });
});

describe('adt stack pop', () => {
    it('can pop number', () => {
        const s = new Stack(5);
        const v = 3;
        s.push(v);
        const r = s.pop();
        _chai.assert.equal(v, r);
    });
    it('stack is LIFO', () => {
        const s = new Stack(5);
        s.push(4);
        s.push(2);
        s.push(3);
        // reverse order
        _chai.assert.equal(s.pop(), 3);
        _chai.assert.equal(s.pop(), 2);
        _chai.assert.equal(s.pop(), 4);
    });
    it('stack returns undefined if empty', () => {
        const s = new Stack(5);
        s.push(4);
        s.push(2);
        s.push(3);
        // reverse order
        s.pop();
        s.pop();
        s.pop();
        _chai.assert.isUndefined(s.pop());
    });
});

describe('adt stack peek', () => {
    it('can peek number', () => {
        const s = new Stack(5);
        s.push(3);
        _chai.assert.equal(s.peek(), 3);
        s.push(1);
        _chai.assert.equal(s.peek(), 1);
        s.pop();
        _chai.assert.equal(s.peek(), 3);
        s.pop();
        _chai.assert.isUndefined(s.peek());
    });
});

describe('adt stack size', () => {
    it('can get size', () => {
        const s = new Stack(5);
        _chai.assert.equal(s.size(), 0);
        s.push(3);
        _chai.assert.equal(s.size(), 1);
        s.push(1);
        _chai.assert.equal(s.size(), 2);
        s.pop();
        _chai.assert.equal(s.size(), 1);
        s.pop();
        _chai.assert.equal(s.size(), 0);
    });
});
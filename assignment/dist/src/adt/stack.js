"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
/**
 * Assignment notes
 * - Although we also use a stack, unlike Stefano's mini-project we implement
 *   with an array rather than a linked list
 */
class Stack {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.stack = [];
    }
    push(item) {
        if (this.size() === this.maxSize) {
            throw new Error("Cannot push, stack is already full");
        }
        this.stack.push(item);
    }
    pop() {
        return this.stack.pop();
    }
    peek() {
        return this.stack[this.size() - 1];
    }
    size() {
        return this.stack.length;
    }
}
exports.Stack = Stack;

/**
 * Assignment notes
 * - Use companion object with type and implementation with the same name
 */
export interface Stack<T> {
    push(item : T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    size(): number;
}

/**
 * Assignment notes
 * - Although we also use a stack, unlike Stefano's mini-project we implement
 *   with an array rather than a linked list
 */
export class Stack<T> implements Stack<T> {
    private stack: T[] = [];

    constructor(private maxSize: number){}

    push(item: T): void {
        if(this.size() === this.maxSize){
            throw new Error("Cannot push, stack is already full");
        }
        this.stack.push(item);
    }

    pop(): T | undefined {
        return this.stack.pop();
    }

    peek(): T | undefined {
        return this.stack[this.size() - 1];
    }

    size(): number {
        return this.stack.length;
    }
}
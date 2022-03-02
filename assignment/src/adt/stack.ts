/**
 * Interface for generic stack implementation based upon the type that is
 * pushed to the stack
 * 
 * Assignment notes
 * - Use companion object with type and implementation with the same name
 */
export interface Stack<T> {
    /**
     * @param item Push an item to a stack 
     */
    push(item : T): void;
    /**
     * Pop an item from the stack, or if the stack is empty return undefined
     */
    pop(): T | undefined;
    /**
     * Peek to see what is at the top of the stack, without popping it
     */
    peek(): T | undefined;
    /**
     * Get the size of the stack i.e. the number of elements in it
     */
    size(): number;
}

/**
 * Stack implementation where an array is used (a slice) under the hood, 
 * although this is abstracted via the interface
 * 
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
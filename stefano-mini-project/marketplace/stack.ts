
/**
 * Type of nodes used internally by a stack to store its items.
 */
type StackNode<T> = {
    readonly item: T
    next: StackNode<T>|undefined
}

/**
 * Type for a non-empty stack, used by the custom type guard {@link Stack.notEmpty}.
 */
interface NonEmptyStack<T> extends Stack<T> {
    get top(): T
    pop(): T
}

/**
 * A generic stack data structure.
 */
export class Stack<T> {

    /** The {@link StackNode} containing the top item of the stack. */
    private head: StackNode<T>|undefined = undefined;

    /**
     * Constructs an empty stack and then pushes the given items in order.
     */
    constructor(...items: readonly T[]){
        for (const item of items){
            this.push(item); // delegate insertion to push method
        }
    }

    /**
     * Whether the stack is not empty.
     * 
     * This is a custom type guard: if it returns true,
     * the stack type is refined to {@link NonEmptyStack},
     * where {@link Stack.top} and {@link Stack.pop} are never `undefined`.
     * 
     * @example
     * const stack = new Stack<number>(0, 1, 2, 3);
     * if (stack.notEmpty()){
     *     const x: number = stack.top;
     *     const y: number = stack.pop();
     * }
     *
     */
    notEmpty(): this is NonEmptyStack<T> {
        return this.head != undefined;
    }

    /**
     * The top item in the stack, or `undefined` if the stack is empty.
     */
    get top(): T|undefined {
        return this.head?.item;
    }

    /**
     * Removes and returns the top item in the stack, or `undefined` if the stack is empty.
     */
    pop(): T|undefined {
        const top = this.head?.item;
        this.head = this.head?.next;
        return top;
    }

    /**
     * Pushes the given item on top of the stack.
     */
    push(item: T): void {
        this.head = {
            item: item,
            next: this.head
        };
    }
}

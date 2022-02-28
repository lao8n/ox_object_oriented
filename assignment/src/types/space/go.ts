import { Money } from "../money";

export type Go<M extends Money> = {
    readonly kind: "Go",
    readonly name: string,
    readonly amount: M,
}
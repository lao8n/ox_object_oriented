import { Money } from "../money";

export type Card<M extends Money> = {
    readonly kind: "Card",
    readonly name: string,
    readonly amount: M,
}
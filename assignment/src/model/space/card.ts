import { Money } from "../money"

export type Card<M extends Money> = {
    readonly kind: "card",
    readonly name: string,
    readonly amount: M,
}
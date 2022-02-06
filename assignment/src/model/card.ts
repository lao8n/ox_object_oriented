import { Money } from "./money"

export type Card<M extends Money> = {
    readonly name: string,
    readonly amount: M,
}
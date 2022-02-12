import { Money } from "./money"

export type Train<M extends Money> = {
    readonly kind: "train",
    readonly name: string,
    readonly amount: M,
}
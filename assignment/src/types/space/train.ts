import { Money } from "../money"

export type Train<M extends Money> = {
    readonly kind: "Train",
    readonly name: string,
    readonly amount: M,
}
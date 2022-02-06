import { Money } from "./money"

export type Train<M extends Money> = {
    readonly name: string,
    readonly amount: M,
}
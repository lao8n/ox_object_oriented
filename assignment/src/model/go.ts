import { Money } from "./money"

export type Go<M extends Money> = {
    readonly name: string,
    readonly amount: M,
}
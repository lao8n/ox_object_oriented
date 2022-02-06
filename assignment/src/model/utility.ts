import { Money } from "./money"

export type Utility<M extends Money> = {
    readonly name: string,
    readonly amount: M,
}
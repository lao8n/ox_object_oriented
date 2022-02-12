import { Money } from "./money"

export type Utility<M extends Money> = {
    readonly kind: "utility",
    readonly name: string,
    readonly amount: M,
}
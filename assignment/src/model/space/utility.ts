import { Money } from "../money"

export type Utility<M extends Money> = {
    readonly kind: "Utility",
    readonly name: string,
    readonly amount: M,
}
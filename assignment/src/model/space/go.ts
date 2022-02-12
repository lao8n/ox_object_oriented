import { Money } from "../money"

export type Go<M extends Money> = {
    readonly kind: "go",
    readonly name: string,
    readonly amount: M,
}
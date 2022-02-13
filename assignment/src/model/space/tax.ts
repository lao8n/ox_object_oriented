import { Money } from "../money"

export type Tax<M extends Money> = {
    readonly kind: "Tax",
    readonly name: string,
    readonly amount: M,
}
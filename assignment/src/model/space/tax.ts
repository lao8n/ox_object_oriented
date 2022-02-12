import { Money } from "./money"

export type Tax<M extends Money> = {
    readonly kind: "tax",
    readonly name: string,
    readonly amount: M,
}
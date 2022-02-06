import { Money } from "./money"

export type Tax<M extends Money> = {
    readonly name: string,
    readonly amount: M,
}
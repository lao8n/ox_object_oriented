import { Money } from "./money"

/**
 * Lightweight, immutable type to carry around deed data
 */
export type Deed<T extends Money> = {
    readonly name: string // TODO enforce uniqueness
    readonly deedPrice: T
    readonly rentNoHouse: T
    readonly rentOneHouse: T
    readonly rentTwoHouse: T
    readonly rentThreeHouse: T
    readonly rentFourHouse: T
    readonly rentHotel: T     
}
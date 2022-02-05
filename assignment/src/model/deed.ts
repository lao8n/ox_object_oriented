import { Money } from "./money"

/**
 * Lightweight, immutable type for Deed data
 * 
 * Assignment notes:
 * - Generic type bounds = constrain generic type parameter to a subtype forcing 
 *   all prices to the same currency
 * - Type = model underlying data with lightweight immutable type not a class 
 *   which can be exposed much like  */
export type Deed<T extends Money> = {
    readonly name: string, // TODO enforce uniqueness
    readonly deedPrice: T,
    readonly rentNoHouse: T,
    readonly rentOneHouse: T,
    readonly rentTwoHouse: T,
    readonly rentThreeHouse: T,
    readonly rentFourHouse: T,
    readonly rentHotel: T
}
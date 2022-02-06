import { Money } from "./money"

/**
 * Lightweight, immutable type for Deed data
 * 
 * Assignment notes:
 * - Generic type bounds = constrain generic type parameter to a subtype forcing 
 *   all prices to the same currency
 * - Type = model underlying data with lightweight immutable type not a class 
 *   which can be exposed much like  */
export type Deed<M extends Money> = {
    readonly name: string, // TODO enforce uniqueness
    readonly deedPrice: M,
    readonly rentNoHouse: M,
    readonly rentOneHouse: M,
    readonly rentTwoHouse: M,
    readonly rentThreeHouse: M,
    readonly rentFourHouse: M,
    readonly rentHotel: M
}
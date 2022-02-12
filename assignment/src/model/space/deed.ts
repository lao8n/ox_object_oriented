import { Money } from "../money"

export type Colour = "Brown" | "Light Blue" | "Pink" | "Orange" | "Red" | 
    "Yellow" | "Green" | "Dark Blue"
/**
 * Lightweight, immutable type for Deed data
 * 
 * Assignment notes:
 * - Generic type bounds = constrain generic type parameter to a subtype forcing 
 *   all prices to the same currency
 * - Type = model underlying data with lightweight immutable type not a class 
 *   which can be exposed much like  */
export type Deed<M extends Money> = {
    readonly kind: "deed",
    readonly name: string, // TODO enforce uniqueness
    readonly colourSet: Colour,
    readonly deedPrice: M,
    readonly rentNoHouse: M,
    readonly rentOneHouse: M,
    readonly rentTwoHouse: M,
    readonly rentThreeHouse: M,
    readonly rentFourHouse: M,
    readonly rentHotel: M
}
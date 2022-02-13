/** 
 * Money type for all prices, rents, costs etc. in a monopoly game
 * 
 * Assignment notes:
 * - Bigint is preferred over flyweight string pattern as former is 8 bytes vs
 *   2+ bytes per character. Also preferred over number as offers equality
 *   comparison and restriction to integers
 * - Use type branding for nominal typing to add type safety to currencies.
 */
export type GBP = bigint & {readonly currency: "GBP"}
export type USD = bigint & {readonly currency: "USD"}
export type EUR = bigint & {readonly currency: "EUR"}
export type Money = GBP | USD | EUR 
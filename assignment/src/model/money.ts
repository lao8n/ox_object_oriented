/** Supported money types using type branding for nominal typing */
export type GBP = bigint & {readonly currency: "GBP"}
export type USD = bigint & {readonly currency: "USD"}
export type EUR = bigint & {readonly currency: "EUR"}
export type Money = GBP | USD | EUR 
let x1 : number | never // number
let x2 : number | unknown // unknown
let x3 : string & never // never
let x4 : string & unknown // string
let x5 : number & bigint // never
let x6 : number & boolean // never
let x7 : number & (number | undefined) // number
let x8 : string | (boolean & bigint) // string
let x9 : number | (number & number) // number
let x10 : number | undefined // not a basic type
let x11 : number & undefined // never
export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6
export type PairDiceValue = DiceValue | 7 | 8 | 9 | 10 | 11 | 12

/**
 * Generator function for rolling a pair of dice for one turn. It keeps history 
 * of number of doubles rolled
 * 
 * Assignment notes: 
 * - Use * for generator function for consumer-driven lazy generation of numbers
 * - We explicitly declare Generator yield type to be a tuple
 * - Each user creates a new rollPairDice per turn which is cleaner than
 *   using yield to pass values to the generator but first yield then being 
 *   ignored
 */
export function* rollPair(){
    let numberDoubles = 0
    let doubles : [DiceValue, DiceValue, DiceValue] = [1, 1, 1]
    while(numberDoubles < 3) {
        let roll1 = roll()
        let roll2 = roll()
        if(roll1 == roll2){
            doubles[numberDoubles] = roll1
            numberDoubles++
        } else {
            numberDoubles = 0
        }
        yield roll1 + roll2 as PairDiceValue
    }
    return doubles
}

/**
 * Private function for rolling a single dice between 1 and 6
 */
function roll(): DiceValue{
    return Math.floor(Math.random() * 6) + 1 as DiceValue
}

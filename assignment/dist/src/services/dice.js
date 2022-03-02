"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diceGenerator = void 0;
/**
 * Generator function for rolling a pair of dice for one turn. Yield value is
 * the PairDiceValue thrown and a flag for whether a double was thrown
 *
 * It allows resetting if new player rolls by passing in true, and automatically
 * resets if non-double is thrown. It keeps a history of the number of doubles
 * rolled finishing the generator if 3 are thrown
 *
 * Assignment notes:
 * - Use * for generator function for consumer-driven lazy generation of
 *   dice rolls
 * - We explicitly declare Generator return type to be a tuple of DiceValue
 * - Use a tuple to for the yield types
 * - Yield can both take inputs assigned to {@link newTurn} or give outputs
 */
function* diceGenerator() {
    let numberDoubles = 0;
    const doubles = [1, 1, 1];
    let newTurn = false;
    while (numberDoubles < 3) {
        if (newTurn) {
            numberDoubles = 0;
            newTurn = false;
        }
        const roll1 = roll();
        const roll2 = roll();
        if (roll1 == roll2) {
            doubles[numberDoubles] = roll1;
            numberDoubles++;
        }
        else {
            numberDoubles = 0;
        }
        // either assign to newTurn if argument given or yield dice rolls
        // with a boolean flag for whether the dice roll was not a double or
        // not
        newTurn = yield [roll1 + roll2, roll1 != roll2];
    }
    // thrown 3 doubles - return to caller
    return doubles;
}
exports.diceGenerator = diceGenerator;
/**
 * @returns Unexported function that returns a {@link DiceValue} between 1 and 6
 */
function roll() {
    return Math.floor(Math.random() * 6) + 1;
}

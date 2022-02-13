import * as _chai from 'chai';
import * as dice from '../../src/components/dice';

describe('services dice', () => {
    /**
    * Assignment notes: 
    * - IteratorResult is the discriminated union of IteratorYieldResult and 
    *   IteratorReturnResult based upon done therefore inside if statement
    *   diceRoll.value is guaranteed to be of type TYield not TReturn i.e. 
    *   dice.PairDiceValue
    * - Cannot do !diceRoll.done but need == false comparison
    * - Outside of while loop Intellisense is happy it is IteratorReturnResult
    *   but Typescript is not so need an additional if
    */
    it('can get a dice roll between 1 and 12', () => {
        let diceOneTurn = dice.rollPair();
        let diceRoll = diceOneTurn.next()
        if(diceRoll.done == false){
            _chai.assert.isAbove(diceRoll.value, 0)
            _chai.assert.isBelow(diceRoll.value, 13)
        }
    })
    it('can get dice rolls until throw 3 doubles in a row', () => {
        let diceOneTurn = dice.rollPair();
        let diceRoll = diceOneTurn.next()
        while(diceRoll.done == false){
            _chai.assert.isAbove(diceRoll.value, 0)
            _chai.assert.isBelow(diceRoll.value, 13)
            diceRoll = diceOneTurn.next()
        }
        if(diceRoll.done){
            const doubles: [dice.DiceValue, dice.DiceValue, dice.DiceValue] = 
                diceRoll.value
            for (let i = 0; i < 3; i++){
                let dv = doubles[i]!
                _chai.assert.isAbove(dv, 0)
                _chai.assert.isBelow(dv, 7)
            }
        }
    })
})
import * as _chai from 'chai';
import * as dice from '../../src/services/dice';
import { DiceValue } from '../../src/types/dice';
import 'mocha';

describe('service dice', () => {
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
        const diceOneTurn = dice.diceGenerator();
        const diceRoll = diceOneTurn.next();
        if(diceRoll.done == false && diceRoll.value){
            _chai.assert.isAbove(diceRoll.value[0], 0);
            _chai.assert.isBelow(diceRoll.value[0], 13);
            _chai.assert.isBoolean(diceRoll.value[1]);
        }
    });
    it('can get dice rolls until throw 3 doubles in a row', () => {
        const diceOneTurn = dice.diceGenerator();     
        let diceRoll = diceOneTurn.next();
        while(diceRoll.done == false && diceRoll.value){
            _chai.assert.isAbove(diceRoll.value[0], 0);
            _chai.assert.isBelow(diceRoll.value[0], 13);
            _chai.assert.isBoolean(diceRoll.value[1]);
            diceRoll = diceOneTurn.next();
        }
        if(diceRoll.done){
            const doubles: [DiceValue, DiceValue, DiceValue] = 
                diceRoll.value;
            for (let i = 0; i < 3; i++){
                const dv = doubles[i];
                if(dv){
                    _chai.assert.isAbove(dv, 0);
                    _chai.assert.isBelow(dv, 7);
                }
            }
        }
    });
});

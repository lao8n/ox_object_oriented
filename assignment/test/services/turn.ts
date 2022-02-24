import * as _chai from 'chai';
import { DataFactory } from '../../data/uk';
import { Board } from '../../src/components/board';
import { Owner, Ownership } from '../../src/components/ownership';
import { Players } from "../../src/components/players";
import { Transfer } from '../../src/services/transfer';
import { ConcreteTurn, TurnRoll } from '../../src/services/turn';
import { MonopolyBoard } from '../../src/types/board';
import * as money from "../../src/types/money";

describe('service turn constructor', () => {
    it('can construct turn with GBP currency', 
    () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, MonopolyBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, MonopolyBoard<money.GBP>>(
            b, p, o, t)
        _chai.assert.instanceOf(c, ConcreteTurn);
    });
});

describe('service turn start', () => {
    it('returns interface with correct type', 
    () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, MonopolyBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, MonopolyBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        _chai.assert.typeOf(r.roll, "function")
    });
});

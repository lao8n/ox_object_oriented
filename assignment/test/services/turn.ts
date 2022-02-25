import * as _chai from 'chai';
import { DataFactory } from '../../data/uk';
import { Board } from '../../src/components/board';
import { Owner, Ownership } from '../../src/components/ownership';
import { Players } from "../../src/components/players";
import { Transfer } from '../../src/services/transfer';
import { ConcreteTurn, TurnRoll } from '../../src/services/turn';
import { GenericBoard, MonopolyBoard } from '../../src/types/board';
import * as money from "../../src/types/money";
import { PlayerID } from '../../src/types/player';

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
        _chai.assert.equal(r.stage, "Roll")
        _chai.assert.equal(r.player, 1)
    });
});

describe('service turn roll', () => {
    it('roll returns either UnownedProperty or OwnedProperty', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll()
        _chai.assert.oneOf(result.stage, 
            ["UnownedProperty", "OwnedProperty"] )
        _chai.assert.equal(result.player, 1)
    });
});

describe('service turn buy property', () => {
    it('buy property returns TurnFinish', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll()
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn()
            result = r.roll()
        }
        _chai.assert.equal(result.stage, "UnownedProperty")
        let finish = result.buyProperty()
        _chai.assert.equal(finish.stage, "Finish")
    });
});

describe('service turn rent property', () => {
    it('pay rent returns TurnFinish', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll()
        while(result.stage != "UnownedProperty"){
            r = result.finishTurn()
            result = r.roll()
        }
        let finish = result.buyProperty()
        let newRoll = finish.finishTurn()
        result = newRoll.roll()
        while(result.stage != "OwnedProperty"){
            r = result.finishTurn()
            result = r.roll()
        }
        let rent = result.payRent()
        _chai.assert.equal(rent.stage, "Finish")
    });
});

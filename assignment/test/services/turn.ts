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
        let result = r.roll(r.player)
        _chai.assert.oneOf(result.stage, 
            ["UnownedProperty", "OwnedProperty"] )
        _chai.assert.equal(result.player, 1)
    });
    it('roll unchanged if different player calls', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll(2)
        _chai.assert.equal(result.stage, "Roll")
        _chai.assert.equal(result.player, 1)
    });
});

describe('service turn buyProperty', () => {
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
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        }
        _chai.assert.equal(result.stage, "UnownedProperty")
        let finish = result.buyProperty(result.player)
        _chai.assert.equal(finish.stage, "Finish")
    });
    it('buy property unchanged if different player calls it', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        } 
        _chai.assert.equal(result.stage, "UnownedProperty")
        let notTurnPlayer = p.getCurrentTurnNotPlayer()
        let finish = result.buyProperty(notTurnPlayer)
        _chai.assert.equal(finish.stage, "UnownedProperty")
        _chai.assert.notEqual(finish.player, notTurnPlayer)
        _chai.assert.equal(finish.player, result.player)
    });
});

describe('service turn payRent', () => {
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
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        }     
        let finish = result.buyProperty(result.player)
        let newRoll = finish.finishTurn(finish.player)
        result = newRoll.roll(newRoll.player)
        while(result.stage != "OwnedProperty"){
            if(result.stage == "UnownedProperty"){
                finish = result.buyProperty(result.player)
                r = finish.finishTurn(result.player)
            } else {
                r = result.finishTurn(result.player)
            }
            result = r.roll(r.player)
        }
        let rent = result.payRent(result.player)
        _chai.assert.equal(rent.stage, "Finish")
    });
    it('pay rent unchanged if different player calls it', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        }         
        let finish = result.buyProperty(result.player)
        let newRoll = finish.finishTurn(finish.player)
        result = newRoll.roll(newRoll.player)
        while(result.stage != "OwnedProperty"){
            if(result.stage == "UnownedProperty"){
                finish = result.buyProperty(result.player)
                r = finish.finishTurn(result.player)
            } else {
                r = result.finishTurn(result.player)
            }
            result = r.roll(r.player)
        }
        let notTurnPlayer = p.getCurrentTurnNotPlayer()
        let rent = result.payRent(notTurnPlayer)
        _chai.assert.equal(rent.stage, "OwnedProperty")
        _chai.assert.equal(rent.player, result.player)
    });
});

describe('service finishTurn', () => {
    it('finish returns roll', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        }         
        let finish = result.buyProperty(result.player)
        let newTurn = finish.finishTurn(finish.player)
        _chai.assert.equal(newTurn.stage, "Roll")
        _chai.assert.equal(newTurn.player, 2)
    });
    it('finish unchanged if different player calls it', 
    () => {
        let m = DataFactory.createTestBoard3<money.GBP>()
        let b = new Board<money.GBP, GenericBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m)
        let t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o)
        let c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, t)
        let r = c.start()
        let result = r.roll(r.player)
        while(result.stage != "UnownedProperty"){ // this is immediate 
            r = result.finishTurn(result.player)
            result = r.roll(r.player)
        }         
        let finish = result.buyProperty(result.player)
        let notTurnPlayer = p.getCurrentTurnNotPlayer()
        let notNewTurn = finish.finishTurn(notTurnPlayer)
        _chai.assert.equal(notNewTurn.stage, "Finish")
        _chai.assert.equal(notNewTurn.player, finish.player)
    });
});

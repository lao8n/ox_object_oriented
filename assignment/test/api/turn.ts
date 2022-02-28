import * as _chai from 'chai';
import 'mocha';
import { DataFactory } from '../../data/uk';
import { Board } from '../../src/services/board';
import { Ownership } from '../../src/services/ownership';
import { Players } from "../../src/services/players";
import { Transfer } from '../../src/services/transfer';
import { ConcreteTurn, TurnFinish, TurnRoll, TurnInJail } 
    from '../../src/api/turn';
import { GenericBoard, MonopolyBoard } from '../../src/types/board';
import * as money from "../../src/types/money";
import { Housing } from '../../src/services/housing';

describe('api turn constructor', () => {
    it('can construct turn with GBP currency', 
    () => {
        const m = DataFactory.createMonopolyBoard<money.GBP>();
        const b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, MonopolyBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, MonopolyBoard<money.GBP>>(
            b, p, o, h, t);
        _chai.assert.instanceOf(c, ConcreteTurn);
    });
});

describe('api turn start', () => {
    it('returns interface with correct type', 
    () => {
        const m = DataFactory.createMonopolyBoard<money.GBP>();
        const b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, MonopolyBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, MonopolyBoard<money.GBP>>(
            b, p, o, h, t);
        const tr = c.start();
        _chai.assert.typeOf(tr.roll, "function");
        _chai.assert.equal(tr.stage, "Roll");
        _chai.assert.equal(tr.player, 1);
    });
});

describe('api turn roll', () => {
    it('roll returns either UnownedProperty or OwnedProperty or TurnFinish', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        const tr = c.start();
        const trResult = tr.roll(tr.player);
        _chai.assert.oneOf(trResult.stage, 
            ["Roll", "UnownedProperty", "OwnedProperty", "Finish"] );
        _chai.assert.equal(trResult.player, 1);
    });
    it('roll unchanged if different player calls', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        const tr = c.start();       
        const trResult = tr.roll(2);
        _chai.assert.equal(trResult.stage, "Roll");
        _chai.assert.equal(trResult.player, 1);
    });
});

describe('api turn roll', () => {
    it('roll returns either UnownedProperty or OwnedProperty or TurnFinish', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        const tr = c.start();
        tr.roll(tr.player);
        const d = tr.getDiceRoll();
        _chai.assert.isDefined(d);
        if(d){
            _chai.assert.isAtLeast(d, 1);
            _chai.assert.isAtMost(d, 12);
        }
    });
});

describe('api turn buyProperty', () => {
    it('buy property returns TurnFinish', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        _chai.assert.equal(tu.stage, "UnownedProperty");
        let tuResult = tu.buyProperty(tu.player);
        while(tuResult.stage != "Finish"){
            tuResult = tu.buyProperty(tu.player);
        }
        _chai.assert.equal(tuResult.stage, "Finish");
    });
    it('buy property unchanged if different player calls it', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        const notTurnPlayer = p.getCurrentTurnNotPlayer();
        const tuResult = tu.buyProperty(notTurnPlayer);
        _chai.assert.equal(tuResult.stage, "UnownedProperty");
        _chai.assert.notEqual(tuResult.player, notTurnPlayer);
        _chai.assert.equal(tuResult.player, tu.player);
    });
});

describe('api turn payRent', () => {
    it('pay rent returns TurnFinish', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        let tuResult = tu.buyProperty(tu.player);
        while(tuResult.stage != "Finish"){
            tuResult = tu.buyProperty(tu.player);
        }
        tf = tuResult;
        let tfResult = tf.finishTurn(tf.player);
        while(tfResult.stage != "Roll"){
            tfResult = tf.finishTurn(tf.player);
        }
        tr = tfResult;
        trResult = tr.roll(tr.player);
        while(trResult.stage != "OwnedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const to = trResult;
        let toResult = to.payRent(to.player);
        while(toResult.stage != "Finish"){
            toResult = to.payRent(to.player);
        }
        _chai.assert.equal(toResult.stage, "Finish");
    });
    it('pay rent unchanged if different player calls it', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        let tuResult = tu.buyProperty(tu.player);
        while(tuResult.stage != "Finish"){
            tuResult = tu.buyProperty(tu.player);
        }
        tf = tuResult;
        let tfResult = tf.finishTurn(tf.player);
        while(tfResult.stage != "Roll"){
            tfResult = tf.finishTurn(tf.player);
        }
        tr = tfResult;
        trResult = tr.roll(tr.player);
        while(trResult.stage != "OwnedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const to = trResult;
        const notTurnPlayer = p.getCurrentTurnNotPlayer();
        const toResult = to.payRent(notTurnPlayer);
        _chai.assert.equal(toResult.stage, "OwnedProperty");
        _chai.assert.equal(toResult.player, to.player);
        _chai.assert.notEqual(toResult.player, notTurnPlayer);
    });
});

describe('api turn buyHousing', () => {
    it('buy housing returns same stage but with house bought', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(2);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        const tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
        }
        const acquired = o.acquire(tr.player, "Old Kent Road", 
            ["Old Kent Road", "Whitechapel Road"]);
        _chai.assert.isTrue(acquired);
        o.acquire(tr.player, "Whitechapel Road", 
            ["Old Kent Road", "Whitechapel Road"]);
        _chai.assert.isTrue(acquired);
        const tu = trResult;
        const tuResult = tu.buyHousing(tr.player, "Whitechapel Road");
        _chai.assert.equal(tuResult.player, tr.player);
        _chai.assert.equal(tuResult.stage, "UnownedProperty");
        _chai.assert.equal(h.getNumberHouses("Whitechapel Road"), 1);
    });
});

describe('api finishTurn', () => {
    it('finish returns roll', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        const previousTurnPlayer = tu.player;
        const tuResult = tu.finishTurn(tu.player);
        _chai.assert.equal(tuResult.stage, "Roll");
        _chai.assert.notEqual(tuResult.player, previousTurnPlayer);
    });
    it('finish unchanged if different player calls it', 
    () => {
        const m = DataFactory.createTestBoard3<money.GBP>();
        const b = new Board<money.GBP, GenericBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(4);
        const o = new Ownership<money.GBP, GenericBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, GenericBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, GenericBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, GenericBoard<money.GBP>>(
            b, p, o, h, t);
        let tr : TurnRoll;
        let tf : TurnFinish;
        tr = c.start();
        let trResult = tr.roll(tr.player);
        while(trResult.stage != "UnownedProperty"){
            trResult = tr.roll(tr.player);
            if(trResult.stage == "Finish"){
                tf = trResult;
                let tfResult = tf.finishTurn(tf.player);
                while(tfResult.stage != "Roll"){
                    tfResult = tf.finishTurn(tf.player);
                }
                tr = tfResult;
            }
        }
        const tu = trResult;
        const previousTurnPlayer = tu.player;
        const notTurnPlayer = p.getCurrentTurnNotPlayer();
        const tuResult = tu.finishTurn(notTurnPlayer);
        _chai.assert.equal(tuResult.stage, "UnownedProperty");
        _chai.assert.equal(tuResult.player, previousTurnPlayer);
    });
});

describe('api turn rollJail', () => {
    it('buy property returns TurnFinish', 
    () => {
        const m = DataFactory.createMonopolyBoard<money.GBP>();
        const b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m);
        const p = new Players<money.GBP>(2);
        const o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m);
        const h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o); 
        const t = new Transfer<money.GBP, MonopolyBoard<money.GBP>>(b, p, o, h);
        const c = new ConcreteTurn<money.GBP, MonopolyBoard<money.GBP>>(
            b, p, o, h, t);
        // set in jail
        const jail = b.getLocation("Jail");
        if(jail){
            p.setLocation(1, jail);
            p.setInJail(1, true);
        }
        c.stage = "Jail";
        const tj = c as TurnInJail;

        let tjResult = tj.rollJail(1);
        while(tjResult.stage == "Finish" || tjResult.stage == "Jail"){
            tjResult = tj.rollJail(1);
        }
        const tp = tjResult;
        _chai.assert.oneOf(tp.stage, 
            ["UnownedProperty", "OwnedProperty"]);        
        _chai.assert.equal(tp.player, 1);
    });
});
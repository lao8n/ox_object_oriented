import * as _chai from 'chai';
import { Players } from "../../src/components/players";
import * as money from "../../src/types/money";

describe('component player constructor', () => {
    it('can construct player with different currencies', 
    () => {
        let p = new Players<money.GBP>(4)
        _chai.assert.instanceOf(p, Players);
    });
    
});

describe('component player getLocation', () => {
    it('can get player location', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.deepEqual(p.getLocation(1), {street: 1, num: 1})
        _chai.assert.deepEqual(p.getLocation(2), {street: 1, num: 1})
    });
    it('errors if player doesnt exist', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.getLocation(3)).to.throw(
            `Id 3 is invalid as only 2 players`)
    });
});

describe('component player setLocation', () => {
    it('can set player location', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.deepEqual(p.getLocation(1), {street: 1, num: 1})
        let result = p.setLocation(1, {street: 3, num: 5})
        _chai.assert.isTrue(result)
        _chai.assert.deepEqual(p.getLocation(1), {street: 3, num: 5})
    });
    it('errors if player doesnt exist', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.setLocation(3, {street: 3, num: 5})).to.throw(
            `Id 3 is invalid as only 2 players`)
    });
});

describe('component player getInJail', () => {
    it('can get player not in jail', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.isFalse(p.getInJail(1))
    });
    it('errors if player doesnt exist', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.getInJail(3)).to.throw(
            `Id 3 is invalid as only 2 players`)
    });
});

describe('component player setInJail', () => {
    it('can set player inJail', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.isFalse(p.getInJail(1))
        p.setInJail(1, true)
        _chai.assert.isTrue(p.getInJail(1))
        p.setInJail(1, false)
        _chai.assert.isFalse(p.getInJail(1))
    });
    it('errors if player doesnt exist', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.setInJail(3, false)).to.throw(
            `Id 3 is invalid as only 2 players`)
    });
});

describe('component player getWealth', () => {
    it('can get player wealths', 
    () => {
        let p = new Players<money.GBP>(4)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        _chai.assert.equal(p.getWealth(2), 1500n as money.GBP)
        _chai.assert.equal(p.getWealth(3), 1500n as money.GBP)
        _chai.assert.equal(p.getWealth(4), 1500n as money.GBP)
    });
    it('errors if player doesnt exist', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.getWealth(3)).to.throw(
            `Id 3 is invalid as only 2 players`)
    });
});

describe('component player addMoney', () => {
    it('can add money to a player and have it update their wealth', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        let success = p.addMoney(1, 1000n as money.GBP)
        _chai.assert.isTrue(success)
        _chai.assert.equal(p.getWealth(1), 2500n as money.GBP)
        _chai.assert.equal(p.getWealth(2), 1500n as money.GBP)
    });
    it('errors if amount is less than zero', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        _chai.expect(() => p.addMoney(1, -1000n as money.GBP)).to.throw(
            'Expected positive amount of money not -1000'
        )
    });
});

describe('component player removeMoney', () => {
    it('can remove money from a player and have it update their wealth', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getWealth(2), 1500n as money.GBP)
        let result = p.removeMoney(2, 1000n as money.GBP)
        _chai.assert.isTrue(result)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        _chai.assert.equal(p.getWealth(2), 500n as money.GBP)
    });
    it('errors if amount is less than zero', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        _chai.expect(() => p.removeMoney(1, -1000n as money.GBP)).to.throw(
            'Expected positive amount of money not -1000'
        )
    });
    it('false if insufficient funds', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getWealth(2), 1500n as money.GBP)
        let result = p.removeMoney(2, 2000n as money.GBP)
        _chai.assert.isFalse(result)
        _chai.assert.equal(p.getWealth(1), 1500n as money.GBP)
        _chai.assert.equal(p.getWealth(2), 1500n as money.GBP)
    });
    it('errors if player id is invalid', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.expect(() => p.addMoney(5, 
            1000n as money.GBP)).to.throw(
            'Id 5 is invalid as only 2 players'
        )
    });
});

import * as _chai from 'chai';
import { Players } from "../../src/services/players";
import * as money from "../../src/types/money";

describe('service player constructor', () => {
    it('can construct player with different currencies', 
    () => {
        let p = new Players<money.GBP>(4)
        _chai.assert.instanceOf(p, Players);
    });
    
});

describe('service player getCurrentTurnPlayer', () => {
    it('can get players for 2 person game', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getCurrentTurnPlayer(), 1)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 2)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 1)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 2)
    });
    it('can get players for 5 person game', 
    () => {
        let p = new Players<money.GBP>(5)
        _chai.assert.equal(p.getCurrentTurnPlayer(), 1)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 2)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 3)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 4)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 5)
        p.getNextTurnPlayer()
        _chai.assert.equal(p.getCurrentTurnPlayer(), 1)
    });
});

describe('service player getNextTurnPlayer', () => {
    it('can get players for 2 person game', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
    });
    it('can get players for 5 person game', 
    () => {
        let p = new Players<money.GBP>(5)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 3)
        _chai.assert.equal(p.getNextTurnPlayer(), 4)
        _chai.assert.equal(p.getNextTurnPlayer(), 5)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 3)
    });
});

describe('service player getCurrentTurnNotPlayer', () => {
    it('can get players for 2 person game', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 1)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 2)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 3)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 4)
    });
    it('can get players for 5 person game', 
    () => {
        let p = new Players<money.GBP>(5)
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 1)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 2)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 3)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 4)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 5)
        p.getNextTurnPlayer()
        _chai.assert.notEqual(p.getCurrentTurnNotPlayer(), 1)
    });
});

describe('service player getOrder', () => {
    it('can get order for 2 person game', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.deepEqual(p.getOrder(), [1, 2])
        p.setOrder([2, 1])
        _chai.assert.deepEqual(p.getOrder(), [2, 1])
    });
});

describe('service player setOrder', () => {
    it('can set order for 2 person game', 
    () => {
        let p = new Players<money.GBP>(2)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        p.setOrder([2, 1])
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
    });
    it('can set order for 5 person game', 
    () => {
        let p = new Players<money.GBP>(5)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 3)
        _chai.assert.equal(p.getNextTurnPlayer(), 4)
        _chai.assert.equal(p.getNextTurnPlayer(), 5)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        p.setOrder([3, 1, 4, 5, 2])
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
        _chai.assert.equal(p.getNextTurnPlayer(), 4)
        _chai.assert.equal(p.getNextTurnPlayer(), 5)
        _chai.assert.equal(p.getNextTurnPlayer(), 2)
        _chai.assert.equal(p.getNextTurnPlayer(), 3)
        _chai.assert.equal(p.getNextTurnPlayer(), 1)
    });
    it('get error if order is too short', 
    () => {
        let p = new Players<money.GBP>(5)
        _chai.expect(() => p.setOrder([3, 1, 4])).to.throw(
            `Order has 3 players not 5 as required`
        )
    });
    it('get error if order is too long', 
    () => {
        let p = new Players<money.GBP>(3)
        _chai.expect(() => p.setOrder([3, 1, 4, 2, 5])).to.throw(
            `Order has 5 players not 3 as required`
        )
    });
    it('get error if player id is too large for size of game', 
    () => {
        let p = new Players<money.GBP>(3)
        _chai.expect(() => p.setOrder([2, 1, 4])).to.throw(
            `Id 4 is invalid as only 3 players`
        )
    });
    it('get error if repeated player id', 
    () => {
        let p = new Players<money.GBP>(3)
        _chai.expect(() => p.setOrder([2, 1, 2])).to.throw(
            `Repeated player 2 in order`
        )
    });
});

describe('service player getLocation', () => {
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

describe('service player setLocation', () => {
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

describe('service player getInJail', () => {
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

describe('service player setInJail', () => {
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

describe('service player getWealth', () => {
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

describe('service player addMoney', () => {
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

describe('service player removeMoney', () => {
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

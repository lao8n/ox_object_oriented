import * as _chai from 'chai';
import * as board from '../../src/model/board';
import * as money from '../../src/model/money';
import * as os from '../../src/services/ownership';
import { DataFactory } from '../../data/uk';
import { PlayerID } from '../../src/model/player';

describe('services ownership constructor', () => {
    it(`can construct ownership service for board with 1 space`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    })
    it(`can construct ownership service for board with 3 spaces`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard2<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    })
    it(`can construct ownership service for full board`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    })
})

describe('services ownership isOwned', () => {
    it(`space not on the board undefined`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.isOwned("Chelsea")
        _chai.assert.isUndefined(result)
    })
    it(`space on the board but not ownable is undefined`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.isOwned("Jail")
        _chai.assert.isUndefined(result)    
    })
    it(`space on the board but after max board size is undefined`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard2<money.GBP>()
        );
        let result = o.isOwned("Pentonville Road")
        _chai.assert.isUndefined(result)        
    })
    it(`space on the board after init is null`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.isOwned("King's Cross Station")
        _chai.assert.isNull(result)         
        result = o.isOwned("Water Works")
        _chai.assert.isNull(result)       
        result = o.isOwned("Bond Street")
        _chai.assert.isNull(result)   
    })
    it(`space on the board after acquire is Owner`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        let result = o.isOwned("Mayfair")
        let expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(result, expectedResult)  
    })
    it(`space on the board after acquire both properties is Owner with ` + 
       `sameOwner true`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        let result = o.isOwned("Park Lane")
        let expectedResult = {
            id: 1 as PlayerID,
            sameOwner: true
        }
        _chai.assert.deepEqual(result, expectedResult)  
        result = o.isOwned("Mayfair")
        _chai.assert.deepEqual(result, expectedResult)  
    })
    it(`space on the board after different properties with different owners ` + 
        `has isOwner with sameOwner false`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(2, "Mayfair", ["Park Lane", "Mayfair"])
        let result = o.isOwned("Park Lane")
        let expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(result, expectedResult)  
        result = o.isOwned("Mayfair")
        expectedResult = {
            id: 2 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(result, expectedResult)  
    })
    it(`space on the board after different utilities with different owners ` + 
        `has isOwner with sameOwner false`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(7, "Water Works", ["Water Works", "Electric Company"])
        o.acquire(5, "Electric Company", ["Water Works", "Electric Company"])
        let result = o.isOwned("Water Works")
        let expectedResult = {
            id: 7 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(result, expectedResult)  
        result = o.isOwned("Electric Company")
        expectedResult = {
            id: 5 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(result, expectedResult)  
    })
    it(`space on the board after different utilities with same owner ` + 
        `has isOwner with sameOwner true`, 
    () => {
        let o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(7, "Water Works", ["Water Works", "Electric Company"])
        o.acquire(7, "Electric Company", ["Water Works", "Electric Company"])
        let result = o.isOwned("Water Works")
        let expectedResult = {
            id: 7 as PlayerID,
            sameOwner: true
        }
        _chai.assert.deepEqual(result, expectedResult)  
        result = o.isOwned("Electric Company")
        expectedResult = {
            id: 7 as PlayerID,
            sameOwner: true
        }
        _chai.assert.deepEqual(result, expectedResult)  
    })
})

/**
 * Assignment notes
 * - chai.expect with wrapper arrow function to catch thrown errors
 */
describe('services ownership acquire', () => {
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", [])).to.throw(
            'Invalid setNames does not include Mayfair')
    })
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", 
            ["Old Kent Road", "Whitechapel Road"])).to.throw(
            'Invalid setNames does not include Mayfair')
    })
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", 
            ["Mayfair"])).to.throw(
            'Inputted set is invalid, it has length 1 but it must have at ' + 
            'least 2 and at most 4 entries')
    })
    it(`if name does exist and its unowned return true`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        _chai.assert.isTrue(result)
    })
    it(`if name does exist and its unowned return true for train`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"])
        _chai.assert.isTrue(result)
    })
    it(`if name does exist and its owned return false`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"])
        _chai.assert.isTrue(result)
        result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"])
        _chai.assert.isFalse(result)
    })
})

describe('services ownership release', () => {
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", [])).to.throw(
            'Invalid setNames does not include Mayfair')
    })
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", 
            ["Old Kent Road", "Whitechapel Road"])).to.throw(
            'Invalid setNames does not include Mayfair')
    })
    it(`if name not in given set return error`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", 
            ["Mayfair"])).to.throw(
            'Inputted set is invalid, it has length 1 but it must have at ' + 
            'least 2 and at most 4 entries')
    })
    it(`if name does exist and its unowned return false`, 
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.release(1, "Park Lane", ["Park Lane", "Mayfair"])
        _chai.assert.isFalse(result)
    })
    it(`if name does exist and its owned but by different id return false`,
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        let result = o.release(2, "Park Lane", ["Park Lane", "Mayfair"])
        _chai.assert.isFalse(result)
    })
    it(`if name does exist and its owned by same id return true`,
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        let result = o.release(1, "Park Lane", ["Park Lane", "Mayfair"])
        _chai.assert.isTrue(result)
    })
    it(`if name does exist and its owned by same id return true and isOwned ` + 
       `sameOwner false`,
    () => {
        let o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        let result = o.release(1, "Mayfair", ["Park Lane", "Mayfair"])
        _chai.assert.isTrue(result)
        let owner = o.isOwned("Mayfair")
        _chai.assert.isNull(owner)
        owner = o.isOwned("Park Lane")
        let expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        }
        _chai.assert.deepEqual(owner, expectedResult)
    })
})
import * as _chai from 'chai';
import * as board from '../../src/types/board';
import * as money from '../../src/types/money';
import * as os from '../../src/services/ownership';
import { DataFactory } from '../../data/uk';
import { PlayerID } from '../../src/types/player';
import 'mocha';

describe('service ownership constructor', () => {
    it(`can construct ownership service for board with 1 space`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    });
    it(`can construct ownership service for board with 3 spaces`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard2<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    });
    it(`can construct ownership service for full board`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.assert.instanceOf(o, os.Ownership);
    });
});

describe('service ownership getOwner', () => {
    it(`space not on the board undefined`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        const result = o.getOwner("Chelsea");
        _chai.assert.isUndefined(result);
    });
    it(`space on the board but not ownable is undefined`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        const result = o.getOwner("Jail");
        _chai.assert.isUndefined(result);    
    });
    it(`space on the board but after max board size is undefined`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard2<money.GBP>()
        );
        const result = o.getOwner("Pentonville Road");
        _chai.assert.isUndefined(result);        
    });
    it(`space on the board after init is null`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.getOwner("King's Cross Station");
        _chai.assert.isNull(result);         
        result = o.getOwner("Water Works");
        _chai.assert.isNull(result);       
        result = o.getOwner("Bond Street");
        _chai.assert.isNull(result);   
    });
    it(`space on the board after acquire is Owner`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"]);
        const result = o.getOwner("Mayfair");
        const expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(result, expectedResult);  
    });
    it(`space on the board after acquire both properties is Owner with ` + 
       `sameOwner true`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"]);
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        let result = o.getOwner("Park Lane");
        const expectedResult = {
            id: 1 as PlayerID,
            sameOwner: true
        };
        _chai.assert.deepEqual(result, expectedResult);  
        result = o.getOwner("Mayfair");
        _chai.assert.deepEqual(result, expectedResult);  
    });
    it(`space on the board after different properties with different owners ` + 
        `has getOwner with sameOwner false`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        o.acquire(2, "Mayfair", ["Park Lane", "Mayfair"]);
        let result = o.getOwner("Park Lane");
        let expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(result, expectedResult);  
        result = o.getOwner("Mayfair");
        expectedResult = {
            id: 2 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(result, expectedResult);  
    });
    it(`space on the board after different utilities with different owners ` + 
        `has getOwner with sameOwner false`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(7, "Water Works", ["Water Works", "Electric Company"]);
        o.acquire(5, "Electric Company", ["Water Works", "Electric Company"]);
        let result = o.getOwner("Water Works");
        let expectedResult = {
            id: 7 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(result, expectedResult);  
        result = o.getOwner("Electric Company");
        expectedResult = {
            id: 5 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(result, expectedResult);  
    });
    it(`space on the board after different utilities with same owner ` + 
        `has getOwner with sameOwner true`, 
    () => {
        const o = new os.Ownership<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(7, "Water Works", ["Water Works", "Electric Company"]);
        o.acquire(7, "Electric Company", ["Water Works", "Electric Company"]);
        let result = o.getOwner("Water Works");
        let expectedResult = {
            id: 7 as PlayerID,
            sameOwner: true
        };
        _chai.assert.deepEqual(result, expectedResult);  
        result = o.getOwner("Electric Company");
        expectedResult = {
            id: 7 as PlayerID,
            sameOwner: true
        };
        _chai.assert.deepEqual(result, expectedResult);  
    });
});

/**
 * Assignment notes
 * - chai.expect with wrapper arrow function to catch thrown errors
 */
describe('service ownership acquire', () => {
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", [])).to.throw(
            'Invalid setNames does not include Mayfair');
    });
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", 
            ["Old Kent Road", "Whitechapel Road"])).to.throw(
            'Invalid setNames does not include Mayfair');
    });
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.acquire(1, "Mayfair", 
            ["Mayfair"])).to.throw(
            'Inputted set is invalid, it has length 1 but it must have at ' + 
            'least 2 and at most 4 entries');
    });
    it(`if name does exist and its unowned return true`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        const result = o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        _chai.assert.isTrue(result);
    });
    it(`if name does exist and its unowned return true for train`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        const result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"]);
        _chai.assert.isTrue(result);
    });
    it(`if name does exist and its owned return false`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        let result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"]);
        _chai.assert.isTrue(result);
        result = o.acquire(1, "King's Cross Station", 
            ["King's Cross Station", "Marylebone Station", 
             "Fenchurch St Station", "Liverpool St Station"]);
        _chai.assert.isFalse(result);
    });
});

describe('service ownership release', () => {
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", [])).to.throw(
            'Invalid setNames does not include Mayfair');
    });
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", 
            ["Old Kent Road", "Whitechapel Road"])).to.throw(
            'Invalid setNames does not include Mayfair');
    });
    it(`if name not in given set return error`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.expect(() => o.release(1, "Mayfair", 
            ["Mayfair"])).to.throw(
            'Inputted set is invalid, it has length 1 but it must have at ' + 
            'least 2 and at most 4 entries');
    });
    it(`if name does exist and its unowned return false`, 
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        const result = o.release(1, "Park Lane", ["Park Lane", "Mayfair"]);
        _chai.assert.isFalse(result);
    });
    it(`if name does exist and its owned but by different id return false`,
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        const result = o.release(2, "Park Lane", ["Park Lane", "Mayfair"]);
        _chai.assert.isFalse(result);
    });
    it(`if name does exist and its owned by same id return true`,
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        const result = o.release(1, "Park Lane", ["Park Lane", "Mayfair"]);
        _chai.assert.isTrue(result);
    });
    it(`if name does exist and its owned by same id return true and getOwner` + 
       ` sameOwner false`,
    () => {
        const o = new os.Ownership<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"]);
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"]);
        const result = o.release(1, "Mayfair", ["Park Lane", "Mayfair"]);
        _chai.assert.isTrue(result);
        let owner = o.getOwner("Mayfair");
        _chai.assert.isNull(owner);
        owner = o.getOwner("Park Lane");
        const expectedResult = {
            id: 1 as PlayerID,
            sameOwner: false
        };
        _chai.assert.deepEqual(owner, expectedResult);
    });
});
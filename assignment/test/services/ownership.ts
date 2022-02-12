import * as _chai from 'chai';
import * as board from '../../src/model/board';
import * as money from '../../src/model/money';
import * as os from '../../src/services/ownership';
import { DataFactory } from '../../data/uk';

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
})
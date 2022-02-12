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
import * as _chai from 'chai';
import * as board from '../../src/types/board';
import * as money from '../../src/types/money';
import { DataFactory } from '../../data/uk';
import 'mocha';

describe('model minimal board', () => {
    it('can initialize generic board', () => {
        const testBoard : board.GenericBoard<money.GBP> = 
            DataFactory.createTestBoard1<money.GBP>();
        _chai.assert.isUndefined(testBoard?.[1]?.[2]);
    });
});

describe('model monopoly board', () => {
    it('can initialize monopoly board', () => {
        const monopolyBoard : board.MonopolyBoard<money.GBP> = 
            DataFactory.createMonopolyBoard<money.GBP>();
        _chai.assert.isDefined(
            monopolyBoard[1 as board.BoardStreet][4 as board.BoardNumber]);
    });
});
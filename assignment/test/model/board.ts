import * as _chai from 'chai';
import * as board from '../../src/model/board'
import * as money from '../../src/model/money';
import { DataFactory } from '../../data/uk'

describe('model minimal board', () => {
    it('can initialize generic board', () => {
        let testBoard : board.GenericBoard<money.GBP> = 
            DataFactory.createTestBoard1<money.GBP>()
        _chai.assert.isUndefined(testBoard![1]![2])
    })
})

describe('model monopoly board', () => {
    it('can initialize monopoly board', () => {
        let monopolyBoard : board.MonopolyBoard<money.GBP> = 
            DataFactory.createMonopolyBoard<money.GBP>()
        _chai.assert.isDefined(monopolyBoard[1 as board.BoardStreet][4 as board.BoardNumber])
    })
})
import * as _chai from 'chai';
import { GenericBoard, MonopolyBoard } from '../../src/model/board';
import * as money from '../../src/model/money';
import * as board from '../../src/services/board'
import { TestDataFactory } from '../../test_data/data';

describe('services board', () => {
    it('can construct monopoly board with different currencies and boards', 
    () => {
        let b = new board.Board<money.GBP, GenericBoard<money.GBP>>(
            TestDataFactory.createTestBoard<money.GBP>()
        )
        _chai.assert.instanceOf(b, board.Board)
    })
    it('can construct monopoly board with different currencies and boards', 
    () => {
        let b = new board.Board<money.GBP, MonopolyBoard<money.USD>>(
            TestDataFactory.createMonopolyBoard<money.USD>()
        )
        _chai.assert.instanceOf(b, board.Board)
    })
})
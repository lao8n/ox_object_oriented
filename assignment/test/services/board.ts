import * as _chai from 'chai';
import { GenericBoard, MonopolyBoard } from '../../src/model/board';
import * as money from '../../src/model/money';
import * as board from '../../src/services/board'
import { TestDataFactory } from '../../test_data/data';

describe('services board constructor', () => {
    it('can construct monopoly board with different currencies and boards', 
    () => {
        let b = new board.Board<money.GBP, GenericBoard<money.GBP>>(
            TestDataFactory.createTestBoard1<money.GBP>()
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


describe('services board size', () => {
    it('can construct monopoly board and get correct size with single space', 
    () => {
        let b = new board.Board<money.GBP, GenericBoard<money.GBP>>(
            TestDataFactory.createTestBoard1<money.GBP>()
        )
        _chai.assert.equal(b.size, 1)
    })
    it('can construct monopoly board and get correct size with full board', 
    () => {
        let b = new board.Board<money.GBP, MonopolyBoard<money.USD>>(
            TestDataFactory.createMonopolyBoard<money.USD>()
        )
        _chai.assert.equal(b.size, 40)
    })
    it('can construct monopoly board and get correct size with full board', 
    () => {
        let b = new board.Board<money.GBP, GenericBoard<money.USD>>(
            TestDataFactory.createTestBoard2<money.USD>()
        )
        _chai.assert.equal(b.size, 3)
    })
})
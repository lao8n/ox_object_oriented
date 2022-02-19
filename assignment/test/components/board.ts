import * as _chai from 'chai';
import * as board from '../../src/types/board';
import * as money from '../../src/types/money';
import * as bs from '../../src/components/board';
import { PairDiceValue } from '../../src/components/dice';
import { DataFactory } from '../../data/uk';

describe('component board constructor', () => {
    it('can construct monopoly board with different currencies and boards', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        );
        _chai.assert.instanceOf(b, bs.Board);
    });
    it('can construct monopoly board with different currencies and boards', 
    () => {
        let b = new bs.Board<money.GBP, board.MonopolyBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        );
        _chai.assert.instanceOf(b, bs.Board);
    });
});

describe('component board size', () => {
    it('can construct monopoly board and get correct size with single space', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        );
        _chai.assert.equal(b.size, 1);
    });
    it('can construct monopoly board and get correct size with full board', 
    () => {
        let b = new bs.Board<money.USD, board.GenericBoard<money.USD>>(
            DataFactory.createTestBoard2<money.USD>()
        );
        _chai.assert.equal(b.size, 3);
    });
    it('can construct monopoly board and get correct size with full board', 
    () => {
        let b = new bs.Board<money.USD, board.MonopolyBoard<money.USD>>(
            DataFactory.createMonopolyBoard<money.USD>()
        );
        _chai.assert.equal(b.size, 40);
    });
});

describe('component board move piece', () => {
    it('can calculate correct location with 1 space board and 1 dice roll', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        )
        let currentLocation = {street: 1, num: 1} as board.Location
        let newLocation = b.movePiece(currentLocation, 1 as PairDiceValue)
        let expectedLocation = {street: 1, num: 1} as board.Location
        _chai.assert.deepEqual(newLocation, expectedLocation)
    });
    it('can calculate correct location with 3 space board and 1 dice roll', 
    () => {
        let b = new bs.Board<money.USD, board.GenericBoard<money.USD>>(
            DataFactory.createTestBoard2<money.USD>()
        )
        let currentLocation = {street: 1, num: 1} as board.Location
        let newLocation = b.movePiece(currentLocation, 1 as PairDiceValue)
        let expectedLocation = {street: 1, num: 2} as board.Location
        _chai.assert.deepEqual(newLocation, expectedLocation)
    });
    it(`can calculate correct location with full space board and 1 dice roll`, 
    () => {
        let b = new bs.Board<money.USD, board.MonopolyBoard<money.USD>>(
            DataFactory.createMonopolyBoard<money.USD>()
        )
        let currentLocation = {street: 1, num: 1} as board.Location
        let newLocation = b.movePiece(currentLocation, 1 as PairDiceValue)
        let expectedLocation = {street: 1, num: 2} as board.Location
        _chai.assert.deepEqual(newLocation, expectedLocation)    
    });
    it(`can calculate correct location with 1 space board and 5 dice roll`, 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        )
        let currentLocation = {street: 1, num: 1} as board.Location
        let newLocation = b.movePiece(currentLocation, 5 as PairDiceValue)
        let expectedLocation = {street: 1, num: 1} as board.Location
        _chai.assert.deepEqual(newLocation, expectedLocation)
    });
    it(`can calculate correct location with 3 space board and 5 dice roll`, 
    () => {
        let b = new bs.Board<money.USD, board.GenericBoard<money.USD>>(
            DataFactory.createTestBoard2<money.USD>()
        )
        let currentLocation = {street: 1, num: 2} as board.Location
        let newLocation = b.movePiece(currentLocation, 5 as PairDiceValue)
        let expectedLocation = {street: 1, num: 1} as board.Location
        _chai.assert.deepEqual(newLocation, expectedLocation)
    });
    it(`can calculate correct location with full space board and 5 dice roll
        to new street`, 
    () => {
        let b = new bs.Board<money.USD, board.MonopolyBoard<money.USD>>(
            DataFactory.createMonopolyBoard<money.USD>()
        );
        let currentLocation = {street: 1, num: 9} as board.Location;
        let newLocation = b.movePiece(currentLocation, 5 as PairDiceValue);
        let expectedLocation = {street: 2, num: 4} as board.Location;
        _chai.assert.deepEqual(newLocation, expectedLocation);   
    });
    it(`can calculate correct location with full space board and 8 dice roll
        back to 1st street`, 
    () => {
        let b = new bs.Board<money.USD, board.MonopolyBoard<money.USD>>(
            DataFactory.createMonopolyBoard<money.USD>()
        );
        let currentLocation = {street: 4, num: 4} as board.Location;
        let newLocation = b.movePiece(currentLocation, 8 as PairDiceValue);
        let expectedLocation = {street: 1, num: 2} as board.Location;
        _chai.assert.deepEqual(newLocation, expectedLocation);    
    });
});

describe('component board get space', () => {
    it('can get correct space from location on size 1 board', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        )
        let currentLocation = {street: 1, num: 1} as board.Location
        let newSpace = b.getSpace(currentLocation)
        let expectedSpace = 
            DataFactory.createDeed<money.GBP>("Old Kent Road", "Brown")
        _chai.assert.deepEqual(newSpace, expectedSpace)
    })
    it('can get correct space from location on size 3 board', 
    () => {
        let b = new bs.Board<money.USD, board.GenericBoard<money.USD>>(
            DataFactory.createTestBoard2<money.USD>()
        )
        let currentLocation = {street: 1, num: 3} as board.Location
        let newSpace = b.getSpace(currentLocation)
        let expectedSpace = 
            DataFactory.createDeed<money.USD>("The Angel, Islington", 
                                              "LightBlue")
        _chai.assert.deepEqual(newSpace, expectedSpace)
    })
    it('can get correct space from location on full size board', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        )
        let currentLocation = {street: 1, num: 6} as board.Location
        let newSpace = b.getSpace(currentLocation)
        let expectedSpace = 
            DataFactory.createTrain<money.GBP>("King's Cross Station")
        _chai.assert.deepEqual(newSpace, expectedSpace)
    })
})

describe('component board get set', () => {
    it('can get correct space from location on size 1 board', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createTestBoard1<money.GBP>()
        )
        let set = b.getSet("Brown")
        let expectedSet = ["Old Kent Road"]
        _chai.assert.deepEqual(set, expectedSet)
    })
    it('can get correct space from location on size 3 board', 
    () => {
        let b = new bs.Board<money.USD, board.GenericBoard<money.USD>>(
            DataFactory.createTestBoard2<money.USD>()
        )
        let set = b.getSet("Brown")
        let expectedSet = ["Old Kent Road", "Whitechapel Road"]
        _chai.assert.deepEqual(set, expectedSet)
    })
    it('can get correct space from location on full size board', 
    () => {
        let b = new bs.Board<money.GBP, board.GenericBoard<money.GBP>>(
            DataFactory.createMonopolyBoard<money.GBP>()
        )
        let set = b.getSet("Train")
        let expectedSet = ["King's Cross Station", "Marylebone Station",
            "Fenchurch St Station", "Liverpool St Station"]
        _chai.assert.deepEqual(set, expectedSet)
    })
})
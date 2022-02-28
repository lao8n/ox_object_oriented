import * as _chai from 'chai';
import { Housing } from '../../src/services/housing'
import { MonopolyBoard } from '../../src/types/board'
import { DataFactory } from '../../data/uk';
import { Board } from '../../src/services/board';
import { Owner, Ownership } from '../../src/services/ownership';
import { Players } from "../../src/services/players";

import * as money from "../../src/types/money";

describe('service housing constructor', () => {
    it('can construct', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        _chai.assert.instanceOf(h, Housing)
    })
    it('init building', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        _chai.assert.equal(h.getNumberHouses("Old Kent Road"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)
        _chai.assert.isUndefined(h.getNumberHouses("Chelsea"))
        _chai.assert.isUndefined(h.getNumberHouses("King's Cross Station"))
        _chai.assert.isUndefined(h.getNumberHouses("Water Works"))
        _chai.assert.isUndefined(h.getNumberHouses("Go"))
    })
})

describe('service housing buyHouseOrHotel', () => {
    it('returns false if not owner', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        _chai.assert.isFalse(
            h.buyHouseOrHotel(
                1, 
                "Old Kent Road", 
                "Brown", 
                ["Old Kent Road", "Whitechapel Road"], 
                50n as money.GBP
            )
        )
    })
    it('returns true if owner of set', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)
        _chai.assert.isTrue(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 1)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)    
    })
    it('returns false if name not in set', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        o.acquire(1, "Old Kent Road", ["Old Kent Road", "Whitechapel Road"])
        o.acquire(1, "Whitechapel Road", ["Old Kent Road", "Whitechapel Road"])
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)
        _chai.assert.isFalse(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Old Kent Road", "Whitechapel Road"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)    
    })
    it('returns true if owner of set if have even building', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)
        _chai.assert.isTrue(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.isTrue(
            h.buyHouseOrHotel(
                1, 
                "Mayfair", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 1)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 1)  
        _chai.assert.equal(p.getWealth(1), 1100n as money.GBP)
    })
    it('returns false if have uneven house distribution', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 0)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)
        _chai.assert.isTrue(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.isFalse(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 1)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 0)    
    })
    it('returns false if run out of money', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Park Lane", ["Park Lane", "Mayfair"])
        o.acquire(1, "Mayfair", ["Park Lane", "Mayfair"])
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Park Lane", "DarkBlue", ["Park Lane", "Mayfair"], 
            200n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Mayfair", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Mayfair", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Park Lane", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Park Lane", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Mayfair", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.isTrue(                
            h.buyHouseOrHotel(1, "Mayfair", "DarkBlue", ["Park Lane", "Mayfair"], 
                200n as money.GBP))
        _chai.assert.equal(h.getNumberHouses("Park Lane"), 3)
        _chai.assert.equal(h.getNumberHouses("Mayfair"), 4)  
        _chai.assert.equal(p.getWealth(1), 100n as money.GBP)
        _chai.assert.isFalse(
            h.buyHouseOrHotel(
                1, 
                "Park Lane", 
                "DarkBlue", 
                ["Park Lane", "Mayfair"], 
                200n as money.GBP
            )
        ) 
    })
    it('returns false if already have hotel', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        o.acquire(1, "Bow Street", ["Bow Street", "Marlborough Street", "Vine Street"])
        o.acquire(1, "Vine Street", ["Bow Street", "Marlborough Street", "Vine Street"])
        o.acquire(1, "Marlborough Street", ["Bow Street", "Marlborough Street", "Vine Street"])
        p.addMoney(1, 1000n as money.GBP)
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
            100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
            100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isTrue(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.equal(h.getNumberHouses("Bow Street"), 5)
        _chai.assert.equal(h.getNumberHouses("Marlborough Street"), 5)  
        _chai.assert.equal(h.getNumberHouses("Vine Street"), 5)  
        _chai.assert.isFalse(
            h.buyHouseOrHotel(1, "Bow Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
            100n as money.GBP))
        _chai.assert.isFalse(
            h.buyHouseOrHotel(1, "Marlborough Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.isFalse(
            h.buyHouseOrHotel(1, "Vine Street", "Orange", ["Bow Street", "Marlborough Street", "Vine Street"], 
                100n as money.GBP))
        _chai.assert.equal(h.getNumberHouses("Bow Street"), 5)
        _chai.assert.equal(h.getNumberHouses("Marlborough Street"), 5)  
        _chai.assert.equal(h.getNumberHouses("Vine Street"), 5) 
        _chai.assert.equal(h.getBankRemainingHotels(), 9)
        _chai.assert.equal(h.getBankRemainingHouses(), 32)
    })
})
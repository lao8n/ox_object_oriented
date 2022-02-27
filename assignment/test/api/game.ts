import * as _chai from 'chai';
import 'mocha';
import * as money from '../../src/types/money';
import { GameServer } from '../../src/api/game';
import { DataFactory } from '../../data/uk';

describe('api gameserver constructor', () => {
    it('can construct', () => {
        let gs = new GameServer()
        _chai.assert.instanceOf(gs, GameServer)
    })
})

describe('api gameserver startgame', () => {
    it('returns game instance which can call turn', () => {
        let gs = new GameServer()
        let g = gs.startGame("British", 2)
        _chai.assert.equal(g.id, 0)
        _chai.assert.equal(g.turn.stage, "Roll")
        if(g.turn.stage == "Roll"){
            g.turn.roll(1)
        }
    })
})

describe('api gameserver getGame', () => {
    it('returns game isntance which can call if id valid', () => {
        let gs = new GameServer()
        gs.startGame("British", 2)
        let g = gs.getGame(0)
        _chai.assert.equal(g?.id, 0)
        _chai.assert.equal(g?.turn.stage, "Roll")
        if(g?.turn.stage == "Roll"){
            g?.turn.roll(1)
        }
    })
    it('returns undefined if game doesnt exist', () => {
        let gs = new GameServer()
        gs.startGame("British", 2)
        let g = gs.getGame(1)
        _chai.assert.isUndefined(g)
    })
})

describe('api game get information', () => {
    it('get game board info ', () => {
        let gs = new GameServer()
        gs.startGame("Test", 2)
        let g = gs.getGame(0)
        _chai.assert.isDefined(g)
        _chai.assert.deepEqual(g?.getSpace({street: 1, num: 1}), 
            DataFactory.createDeed<money.GBP>("Old Kent Road", "Brown"))
        _chai.assert.equal(g?.getBoardSize(), 5)
    })
    it('get game players info ', () => {
        let gs = new GameServer()
        gs.startGame("British", 2)
        let g = gs.getGame(0)
        _chai.assert.isDefined(g)
        _chai.assert.equal(g?.getNumberPlayers(), 2)
        _chai.assert.equal(g?.getCurrentTurnPlayer(), 1)
        _chai.assert.deepEqual(g?.getPlayersInOrder(), [1, 2])
        _chai.assert.deepEqual(g?.getPlayerLocation(1), {street: 1, num: 1})
        _chai.assert.equal(g?.getPlayerInJail(1), false)
        _chai.assert.equal(g?.getPlayerWealth(1), 1500n as money.GBP)
        _chai.assert.equal(g?.getPlayerInJail(1), false)
    })
    it('get game ownership info ', () => {
        let gs = new GameServer()
        gs.startGame("British", 2)
        let g = gs.getGame(0)
        _chai.assert.isDefined(g)
        _chai.assert.equal(g?.getOwner("Mayfair"), null)
        _chai.assert.equal(g?.getOwner("Chelsea"), undefined)
    })

})
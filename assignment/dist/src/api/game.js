"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = exports.Game = void 0;
// api imports
const turn_1 = require("./turn");
// data imports
const uk_1 = require("../../data/uk");
// services imports
const board_1 = require("../services/board");
const ownership_1 = require("../services/ownership");
const players_1 = require("../services/players");
const transfer_1 = require("../services/transfer");
const housing_1 = require("../../src/services/housing");
/**
 * Game class directly exposes the turn interfaces through which all turn
 * actions are managed
 * It indirectly exposes information from underlying components about game state
 * without exposing those components.
 *
 * Assignment notes
 * -
 */
class Game {
    constructor(id, board, players, ownership, housing, concreteTurn) {
        this.id = id;
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.housing = housing;
        this.concreteTurn = concreteTurn;
        this.turn = this.concreteTurn.start();
    }
    getSpace(location) {
        return this.board.getSpace(location);
    }
    getBoardSize() {
        return this.board.size;
    }
    getNumberPlayers() {
        return this.players.numPlayers;
    }
    getCurrentTurnPlayer() {
        return this.players.getCurrentTurnPlayer();
    }
    getPlayersInOrder() {
        return this.players.getOrder();
    }
    getPlayerLocation(id) {
        return this.players.getLocation(id);
    }
    getPlayerInJail(id) {
        return this.players.getInJail(id);
    }
    getPlayerWealth(id) {
        return this.players.getWealth(id);
    }
    getNumberHouses(name) {
        return this.housing.getNumberHouses(name);
    }
    getBankNumberRemainingHouses() {
        return this.housing.getBankRemainingHouses();
    }
    getBankNumberRemainingHotels() {
        return this.housing.getBankRemainingHotels();
    }
    getOwner(name) {
        return this.ownership.getOwner(name);
    }
}
exports.Game = Game;
/**
 * Assignment notes
 * - Facade pattern
 */
class GameServer {
    constructor() {
        this.games = [];
    }
    /**
     *
     * @param edition
     * @param money
     * @param numberPlayers
     * @returns
     *
     * Assignment notes
     * - Factory pattern
     */
    startGame(edition, numberPlayers) {
        const id = this.games.length;
        // housing
        let money;
        if (edition == "British" || edition == "Test") {
            money = 0n;
        }
        let m;
        switch (edition) {
            case "British": {
                m = uk_1.DataFactory.createMonopolyBoard();
                break;
            }
            case "Test": {
                m = uk_1.DataFactory.createTestBoard3();
                break;
            }
        }
        const b = new board_1.Board(m);
        const p = new players_1.Players(numberPlayers);
        const o = new ownership_1.Ownership(m);
        const h = new housing_1.Housing(m, p, o);
        const t = new transfer_1.Transfer(b, p, o, h);
        // api
        const c = new turn_1.ConcreteTurn(b, p, o, h, t);
        const g = new Game(id, b, p, o, h, c);
        this.games.push(g);
        return g;
    }
    getGame(id) {
        return this.games[id];
    }
}
exports.GameServer = GameServer;

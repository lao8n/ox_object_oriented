"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
const uk_1 = require("../../data/uk");
const board_1 = require("../components/board");
const ownership_1 = require("../components/ownership");
const players_1 = require("../components/players");
const transfer_1 = require("../services/transfer");
const turn_1 = require("../services/turn");
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
    constructor(id, board, players, ownership, concreteTurn) {
        this.id = id;
        this.board = board;
        this.players = players;
        this.ownership = ownership;
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
    getOwner(name) {
        return this.ownership.getOwner(name);
    }
}
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
        // components
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
        // services
        const t = new transfer_1.Transfer(b, p, o);
        const c = new turn_1.ConcreteTurn(b, p, o, t);
        const g = new Game(id, b, p, o, c);
        this.games.push(g);
        return g;
    }
    getGame(id) {
        return this.games[id];
    }
}
exports.GameServer = GameServer;

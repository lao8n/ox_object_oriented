"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
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
 * {@link ConcreteGame} implementing Game methods. We keep it private and do
 * not export to keep the constructor private and force game instances to be
 * created via the {@link GameServer}
 *
 * Assignment notes
 * - It uses structural typing to extend the {@link Game} interface where if a
 *   new method was created the method chaining would complain
 */
class ConcreteGame {
    constructor(id, board, players, ownership, housing, concreteTurn) {
        this.id = id;
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.housing = housing;
        this.concreteTurn = concreteTurn;
        this.turn = this.concreteTurn.start();
    }
    /**
     * @param location Location on Board
     * @returns Space at a given location
     */
    getSpace(location) {
        return this.board.getSpace(location);
    }
    /**
     * @returns Monopoly board size, not necessarily 40
     */
    getBoardSize() {
        return this.board.size;
    }
    /**
     * @returns Number of players in game
     */
    getNumberPlayers() {
        return this.players.numPlayers;
    }
    /**
     * @returns Which players turn it is
     */
    getCurrentTurnPlayer() {
        return this.players.getCurrentTurnPlayer();
    }
    /**
     * @returns The order players are playing in
     */
    getPlayersInOrder() {
        return this.players.getOrder();
    }
    /**
     * @param id Player's id
     * @returns Player's board location
     */
    getPlayerLocation(id) {
        return this.players.getLocation(id);
    }
    /**
     * @param id Player's id
     * @returns Boolean flag of whether they are in jail or not
     */
    getPlayerInJail(id) {
        return this.players.getInJail(id);
    }
    /**
     * @param id Player's id
     * @returns Get player's wealth in currency of the game
     */
    getPlayerWealth(id) {
        return this.players.getWealth(id);
    }
    /**
     * @param name Name of space on monopoly board
     * @returns Number of houses on that location. 5 houses means their is a
     * hotel there
     */
    getNumberHouses(name) {
        return this.housing.getNumberHouses(name);
    }
    /**
     * @returns The Bank only has 32 houses, this returns the number of houses
     * still left to buy
     */
    getBankNumberRemainingHouses() {
        return this.housing.getBankRemainingHouses();
    }
    /**
     * @returns The Bank only has 6 hotels, this returns the number of hotels
     * still left to buy
     */
    getBankNumberRemainingHotels() {
        return this.housing.getBankRemainingHotels();
    }
    /**
     * @param name Name of space on monopoly board
     * @returns PlayerID of the owner of that space if there is one, which
     * and a boolean flag as to whether all properties in that set have the
     * same owner
     */
    getOwner(name) {
        return this.ownership.getOwner(name);
    }
}
/**
 * GameServer is the primary access class which
 *
 * Assignment notes
 * - Facade pattern for entry-point to all {@link ConcreteGame} instances
 */
class GameServer {
    constructor() {
        /**
         * Private mutable array of games for the game server
         *
         * Game is directly exposed though only {@link ConcreteGame.turn} &
         * {@link ConcreteGame.id} are exposed fields.
         */
        this.games = [];
    }
    /**
     * @param edition Whether the user wants to play the 'British' or 'Test'
     * versions of the game. In future could add other editions such as US etc.
     * @param numberPlayers The number of players in the game. Should be
     * between 2 and 8
     * @returns A game instance with the required properties, which can be
     * played using the {@link ConcreteGame.turn} field and queried for game
     * state using the {@link ConcreteGame} methods. We allow multiple games to
     * occur at once
     *
     * Assignment notes
     * - Factory pattern to assign unique game id {@link ConcreteGame.id}
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
        const g = new ConcreteGame(id, b, p, o, h, c);
        this.games.push(g);
        return g;
    }
    /**
     * @param id Game id
     * @returns Game instance if available
     */
    getGame(id) {
        return this.games[id];
    }
}
exports.GameServer = GameServer;

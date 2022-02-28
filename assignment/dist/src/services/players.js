"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
const uk_1 = require("../../data/uk");
class Players {
    constructor(numPlayers) {
        this.numPlayers = numPlayers;
        this._players = new Map();
        this._order = new Array(numPlayers);
        for (let i = 1; i <= numPlayers; i++) {
            this._players.set(i, {
                id: i,
                wealth: uk_1.DataFactory.createStartingMoney(),
                location: { street: 1, num: 1 },
                inJail: false
            });
            // default order
            this._order[i - 1] = i;
        }
        this._orderIndex = 0;
    }
    getCurrentTurnPlayer() {
        const player = this._order[this._orderIndex];
        if (!player) {
            throw new Error("Unable to find current turn player");
        }
        return player;
    }
    getNextTurnPlayer() {
        this._orderIndex = (this._orderIndex + 1) % this.numPlayers;
        return this.getCurrentTurnPlayer();
    }
    getCurrentTurnNotPlayer() {
        const orderIndex = (this._orderIndex + 1) % this.numPlayers;
        const player = this._order[orderIndex];
        if (!player) {
            throw new Error("Unable to find current turn player");
        }
        return player;
    }
    getOrder() {
        return this._order;
    }
    setOrder(order) {
        if (order.length != this.numPlayers) {
            throw new Error(`Order has ${order.length} players not ` +
                `${this.numPlayers} as required`);
        }
        const orderSet = new Set();
        const newOrder = [];
        for (let i = 0; i < this.numPlayers; i++) {
            const p = order[i];
            if (p) {
                this.validatePlayerID(p);
                if (orderSet.has(p)) {
                    throw new Error(`Repeated player ${p} in order`);
                }
                newOrder[i] = p;
                orderSet.add(p);
            }
        }
        // only override order if it's valid
        this._order = newOrder;
        this._orderIndex = 0;
    }
    getLocation(id) {
        this.validatePlayerID(id);
        const player = this._players.get(id);
        if (player && player?.location) {
            return player.location;
        }
        throw new Error(`Player ${id} has null location`);
    }
    setLocation(id, location) {
        this.validatePlayerID(id);
        // typescript doesn't keep type information about values at specific
        // array indices
        const currentPlayer = this._players.get(id);
        if (currentPlayer) {
            currentPlayer.location = location;
            this._players.set(id, currentPlayer);
            return true;
        }
        return false;
    }
    getInJail(id) {
        this.validatePlayerID(id);
        const player = this._players.get(id);
        if (player) {
            return player.inJail;
        }
        throw new Error(`Player ${id} doesn't exist`);
    }
    setInJail(id, inJail) {
        this.validatePlayerID(id);
        // we check that its defined before asserting it is
        const currentPlayer = this._players.get(id);
        if (currentPlayer) {
            currentPlayer.inJail = inJail;
            this._players.set(id, currentPlayer);
            return true;
        }
        return false;
    }
    getWealth(id) {
        this.validatePlayerID(id);
        const currentPlayer = this._players.get(id);
        if (currentPlayer) {
            return currentPlayer.wealth;
        }
        return null;
    }
    addMoney(id, amount) {
        this.validatePlayerID(id);
        this.validateAmount(amount);
        const currentPlayer = this._players.get(id);
        if (currentPlayer) {
            currentPlayer.wealth = currentPlayer.wealth + amount;
            this._players.set(id, currentPlayer);
            return true;
        }
        return false;
    }
    removeMoney(id, amount) {
        this.validatePlayerID(id);
        this.validateAmount(amount);
        const currentPlayer = this._players.get(id);
        if (currentPlayer) {
            const r = BigInt(currentPlayer.wealth - amount);
            if (r < 0) {
                return false;
            }
            currentPlayer.wealth = r;
            this._players.set(id, currentPlayer);
            return true;
        }
        return false;
    }
    validatePlayerID(id) {
        if (id > this.numPlayers) {
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` +
                `players`);
        }
    }
    validateAmount(amount) {
        if (amount <= 0) {
            throw new Error(`Expected positive amount of money not ${amount}`);
        }
    }
}
exports.Players = Players;

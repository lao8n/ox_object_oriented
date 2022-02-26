"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteTurn = void 0;
const uk_1 = require("../../data/uk");
const dice_1 = require("../components/dice");
class ConcreteTurn {
    constructor(board, players, ownership, transfer) {
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.transfer = transfer;
        // these fields are not exposed through the interfaces so do not need to be
        // private
        this.player = 1;
        this.stage = "Roll"; // tag property
        this.dice = (0, dice_1.diceGenerator)();
        this.player = this.players.getCurrentTurnPlayer();
        this.stage = "Roll"; // tag property
        this.space = uk_1.DataFactory.createGo();
    }
    start() {
        return this;
    }
    roll(player) {
        if (player != this.player) {
            return this;
        }
        let roll = this.dice.next();
        if (roll.done == false) {
            if (roll.value) {
                const location = this.updateLocation(roll.value[0]);
                // didn't throw a double           
                if (roll.value[1]) {
                    return this.updateStage(location);
                    // threw a double
                }
                else {
                    return this;
                }
            }
            else {
                throw new Error(`Unable to get dice roll value for ${roll}`);
            }
            // threw 3 doubles
        }
        else {
            const jail = this.board.getJailLocation();
            if (jail) {
                this.players.setLocation(this.player, jail);
                this.players.setInJail(this.player, true);
                // if jail doesn't exist go to first location on board
            }
            else {
                this.players.setLocation(this.player, { street: 1, num: 1 });
            }
            this.dice = (0, dice_1.diceGenerator)();
            this.stage = "Finish";
            return this;
        }
    }
    rollJail(player) {
        if (player != this.player) {
            return this;
        }
        let roll = this.dice.next();
        if (roll.done == false) {
            if (roll.value) {
                // didn't throw a double
                if (roll.value[1]) {
                    this.stage = "Finish";
                    return this;
                    // threw a double
                }
                else {
                    this.players.setInJail(this.player, false);
                    const location = this.updateLocation(roll.value[0]);
                    return this.updateStage(location);
                }
            }
        }
        this.stage = "Finish";
        return this;
    }
    buyProperty(player) {
        if (player != this.player) {
            return this;
        }
        // cannot make a separate method isProperty as typescript cannot do type 
        // inference
        if (this.space.kind == "Deed" || this.space.kind == "Utility" ||
            this.space.kind == "Train") {
            this.transfer.buyProperty(this.player, this.space);
        }
        this.stage = "Finish";
        return this;
    }
    payRent(player) {
        if (player != this.player) {
            return this;
        }
        if (this.space.kind == "Deed" || this.space.kind == "Utility" ||
            this.space.kind == "Train") {
            this.transfer.payRent(this.player, this.space);
        }
        this.stage = "Finish";
        return this;
    }
    finishTurn(player) {
        if (player != this.player) {
            return this;
        }
        this.dice.next(true);
        this.player = this.players.getNextTurnPlayer();
        if (this.players.getInJail(this.player)) {
            this.stage = "Jail";
            return this;
        }
        this.stage = "Roll";
        return this;
    }
    updateLocation(rollResult) {
        let location = this.players.getLocation(this.player);
        if (location) {
            location = this.board.movePiece(location, rollResult);
            this.players.setLocation(this.player, location);
        }
        return location;
    }
    updateStage(location) {
        this.space = this.board.getSpace(location);
        const owner = this.ownership.isOwned(this.space.name);
        // unowned
        if (owner == null) {
            this.stage = "UnownedProperty";
            return this;
        }
        // owned
        else if (owner) {
            this.stage = "OwnedProperty";
            return this;
        }
        // undefined i.e. not an ownable property  
        else {
            this.stage = "Finish";
            return this;
        }
    }
}
exports.ConcreteTurn = ConcreteTurn;

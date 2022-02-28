"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteTurn = void 0;
const uk_1 = require("../../data/uk");
const dice_1 = require("../services/dice");
class ConcreteTurn {
    constructor(board, players, ownership, housing, transfer) {
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.housing = housing;
        this.transfer = transfer;
        // these fields are not exposed through the interfaces so do not need to be
        // private
        this.player = 1;
        this.stage = "Roll"; // tag property
        this.dice = (0, dice_1.diceGenerator)();
        this.lastDiceRoll = undefined;
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
        const roll = this.dice.next();
        if (roll.done == false) {
            if (roll.value) {
                this.lastDiceRoll = roll.value[0];
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
            this.goToJail();
            this.dice = (0, dice_1.diceGenerator)();
            this.stage = "Finish";
            return this;
        }
    }
    rollJail(player) {
        if (player != this.player) {
            return this;
        }
        const roll = this.dice.next();
        if (roll.done == false) {
            if (roll.value) {
                this.lastDiceRoll = roll.value[0];
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
    getDiceRoll() {
        return this.lastDiceRoll;
    }
    buyHousing(player, name) {
        let currentStage;
        if (this.stage == "OwnedProperty") {
            currentStage = this;
        }
        else {
            currentStage = this;
        }
        if (player != this.player) {
            return currentStage;
        }
        const houseLocation = this.board.getLocation(name);
        if (!houseLocation) {
            return currentStage;
        }
        const houseSpace = this.board.getSpace(houseLocation);
        if (houseSpace?.kind == "Deed") {
            const setNames = this.board.getSet(houseSpace.colourSet);
            if (setNames) {
                this.housing.buyHouseOrHotel(player, houseSpace.name, houseSpace.colourSet, setNames, houseSpace.houseCost);
            }
        }
        return currentStage;
    }
    buyProperty(player) {
        if (player != this.player) {
            return this;
        }
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
        if (this.space.kind == "Deed" || this.space.kind == "Train") {
            this.transfer.payRent(this.player, this.space);
        }
        else if (this.space.kind == "Utility") {
            if (this.lastDiceRoll) {
                this.transfer.payUtilityRent(this.player, this.space, this.lastDiceRoll);
            }
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
    /**
     * This method not only updates the user's position but also adds 200
     * if the user passes Go
     *
     * @param rollResult
     * @returns
     */
    updateLocation(rollResult) {
        let location = this.players.getLocation(this.player);
        if (location) {
            const newLocation = this.board.movePiece(location, rollResult);
            if (newLocation.street < location.street) {
                this.players.addMoney(this.player, 200n);
            }
            this.players.setLocation(this.player, newLocation);
            location = newLocation;
        }
        if (this.board.getSpace(location)?.kind == "Go To Jail") {
            const jail = this.goToJail();
            if (jail) {
                return jail;
            }
        }
        return location;
    }
    updateStage(location) {
        const space = this.board.getSpace(location);
        if (space) {
            this.space = space;
        }
        const owner = this.ownership.getOwner(this.space.name);
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
        else {
            if (this.space.kind == "Card" || this.space.kind == "Tax") {
                this.players.removeMoney(this.player, 100n);
            }
            this.stage = "Finish";
            return this;
        }
    }
    goToJail() {
        const jail = this.board.getLocation("Jail");
        if (jail) {
            this.players.setLocation(this.player, jail);
            this.players.setInJail(this.player, true);
            // if jail doesn't exist go to first location on board
        }
        else {
            this.players.setLocation(this.player, { street: 1, num: 1 });
        }
        return jail;
    }
}
exports.ConcreteTurn = ConcreteTurn;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteTurn = void 0;
// data imports
const uk_1 = require("../../data/uk");
const dice_1 = require("../services/dice");
/**
 * Primary implementation logic for Monopoly game. This is never directly
 * exposed, where instead players access via the {@link Turn} interfaces
 */
class ConcreteTurn {
    /**
     * @param board {@link Board} service to {@link movePiece}s and
     * {@link getSpace}
     * @param players {@link Players} service to manage player state such as
     * {@link BoardLocation} and wealth
     * @param ownership {@link Ownership} service to manage who owns which
     * properties
     * @param housing {@link Housing} service to manage which properties have
     * houses
     * @param transfer {@link Transfer} service to transfer money and
     * properties between players and the bank.
     *
     * Assignment notes
     * - We cannot have the constructor be static as we want to have generics
     *   in the class with {@link Money} and {@link GenericBoard}
     * - Although this constructor is public it isn't exposed in the api, and
     *   instead is instantiated inside {@link GameServer} and the first
     *   {@link TurnRoll} interface exposed through {@link start}
     * - We use composition over inheritance for the services
     */
    constructor(board, players, ownership, housing, transfer) {
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.housing = housing;
        this.transfer = transfer;
        /**
         * Assignment notes
         * - These fields are either note exposed at all through the {@link Turn}
         *   interfaces, or if they are exposed as with {@link player} &
         *   {@link stage} they are readonly
         * - {@link stage} is used as a tagged union type to discriminate between
         *   which interface is being used.
         */
        this.player = 1;
        this.stage = "Roll";
        this.dice = (0, dice_1.diceGenerator)();
        this.lastDiceRoll = undefined;
        this.player = this.players.getCurrentTurnPlayer();
        this.stage = "Roll";
        this.space = uk_1.DataFactory.createGo();
    }
    /**
     * @returns First stage of {@link Turn} FSM interfaces
     */
    start() {
        return this;
    }
    /**
     * @param player The player who wishes to roll. If it's not that player's
     * turn the FSM is not updated staying in {@link TurnRoll} stage
     * @returns The result of rolling the dice, either landing on a property
     * which is owned exposing {@link TurnUnownedProperty} interface or
     * which is not owned exposing {@link TurnOwnedProperty} interface or
     * for locations which are not properties like FreeParking simply finish
     * If multiple doubles are thrown the {@link players} state is updated to
     * {@link inJail} flag is updated so next turn the player will be in
     * {@link TurnInJail}
     * @throws an {@link Error} if the IteratorYieldResult.value is undefined
     *
     * Assignment notes
     * - We use {@link dice} generator to create random dice throws where the
     *   generator ends if 3 doubles are thrown. If this is the case we need
     *   to create a new {@link diceGenerator}
     * - We have multiple checks for whether values are undefined e.g.
     *   {@link roll.value} so that TypeScript knows that they are defined.
     * - Uses the fluent interface pattern to return this for method chaining
     * - Use destructuring to access {@link roll.value} elements
     * - Generator returns an {@link IteratorResult} which is then determined
     *   to be either an {@link IteratorYieldResult} or an
     *   {@link IteratorReturnResult}
     */
    roll(player) {
        if (player != this.player) {
            return this;
        }
        const roll = this.dice.next();
        if (roll.done == false) {
            if (roll.value) {
                // destructuring
                const [diceValue, threwDouble] = roll.value;
                this.lastDiceRoll = diceValue;
                const location = this.updateLocation(diceValue);
                // didn't throw a double           
                if (threwDouble) {
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
    /**
     * @param player The player who wishes to roll
     * @returns Either rolls a double and escapes jail landing on a property
     * that could be unowned or owned. Or fail to roll a double and stay in
     * jail as {@link players.setInJail} is not updated to false
     * @throws an {@link Error} if the IteratorYieldResult.value is undefined
     *
     * Assignment notes
     * - Uses the fluent interface pattern to return this for method chaining
     */
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
            else {
                throw new Error(`Unable to get dice roll value for ${roll}`);
            }
        }
        this.stage = "Finish";
        return this;
    }
    /**
     * @returns Last dice roll for UI to expose game information
     */
    getDiceRoll() {
        return this.lastDiceRoll;
    }
    /**
     * @param player Player wishing to buy housing
     * @param name Name of deed which the player wants to buy housing for. It
     * does not need to be the location they are currently at
     * @returns Returns either {@link TurnOwnedProperty} or
     * {@link TurnUnownedProperty} depending upon what state they were in
     * originally. Doesn't update it.
     *
     * Assignment notes
     * - Uses the fluent interface pattern to return this for method chaining
     * - Use optional chaining in case houseSpace is undefined
     */
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
    /**
     * @param player Player wishing to buy property
     * @returns Either {@link TurnFinish} if purchase was successful or the
     * same state {@link TurnUnownedProperty} if unsuccessful
     */
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
    /**
     * @param player Player who wishes to pay the rent they owe
     * @returns Either {@link TurnFinish} if rent payment was successful or
     * otherwise return the same state. Utility rent payments require dice roll
     * information unlike train and deed rent
     */
    payRent(player) {
        if (player != this.player) {
            return this;
        }
        let success = false;
        if (this.space.kind == "Deed" || this.space.kind == "Train") {
            success = this.transfer.payRent(this.player, this.space);
        }
        else if (this.space.kind == "Utility") {
            if (this.lastDiceRoll) {
                success = this.transfer.payUtilityRent(this.player, this.space, this.lastDiceRoll);
            }
        }
        if (!success) {
            return this;
        }
        this.stage = "Finish";
        return this;
    }
    /**
     * @param player Player who wishes to finish their turn
     * @returns Next player's {@link TurnRoll} or {@link TurnInJail}. The next
     * player's state information is not preserved in the FSM between players
     * turns so is loaded from {@link this.player}. This includes whether the
     * player is in jail affecting which FSM state is loaded.
     */
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
     * @param rollResult Pair of dice value
     * @returns Updated {@link BoardLocation} based upon the dice roll
     *
     * Assignment notes
     * - We use optional chaining in case {@link .getSpace} is undefined on
     *   board
     * - Delegate player location information to {@link this.players} and
     *   moving pieces across board to {@link this.board}
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
    /**
     * @param location Location that has been landed on
     * @returns Which turn interface we should transition to based upon
     * the {@link stage} tag literal
     *
     * Assignment notes
     * - Delegate who owns which properties to {@link this.ownership}
     */
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
    /**
     * @returns Location of jail, setting the player there. As board may not
     * have a jail for example with the "Test" {@link BoardEditions} default to
     * first location on the board instead.
     */
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
/**
 * Class to manage the transfer of money to pay for rent and buying of property
 * As this involves multiple services including {@link Ownership} and
 * {@link Players}.
 *
 * Assignment notes
 * - We use composition over inheritance to manage the services and coordinate
 *   them
 */
class Transfer {
    /**
     * @param board Input board
     * @param players Players service
     * @param ownership Ownership service
     * @param housing Housing service
     *
     * Assignment notes
     * - Typescript objects are passed by reference, and only primitives are
     *   passed by value, therefore updates to ownership and players update the
     *   originally passed in object
     */
    constructor(board, players, ownership, housing) {
        this.board = board;
        this.players = players;
        this.ownership = ownership;
        this.housing = housing;
    }
    /**
     * @param player PlayerID of person who needs to pay rent
     * @param property Property which is either a {@link Deed}, {@link Utility}
     * or a {@link Train}
     * @throws Error if a new property kind is defined and not handled
     *
     * Assignment notes
     * - .kind tag is used to discriminate union
     */
    payRent(player, property) {
        const owner = this.ownership.getOwner(property.name);
        if (!owner) {
            return false;
        }
        let rent;
        switch (property.kind) {
            case "Deed":
                rent = this.calculateDeedRent(property, owner.sameOwner);
                break;
            case "Train":
                rent = this.calculateTrainRent(property, owner.sameOwner);
                break;
            case "Utility":
                throw new Error(`Should be handled by payUtilityRent`);
                break;
            default:
                // type never so can't get here
                throw new Error(`Invalid property with unknown kind`);
        }
        return this.transferMoney(player, owner.id, rent);
    }
    /**
     * @param player Player to pay utility rent
     * @param utility Utility card
     * @param diceRoll Diceroll to get to utility which affects the rent due
     * @returns Boolean for whether function was as a success or failure
     */
    payUtilityRent(player, utility, diceRoll) {
        const owner = this.ownership.getOwner(utility.name);
        if (!owner) {
            return false;
        }
        const rent = this.calculateUtilityRent(utility, owner.sameOwner, diceRoll);
        return this.transferMoney(player, owner.id, rent);
    }
    /**
     * @param player Player who wants to buy a property
     * @param property Property to be purchased
     * @returns Boolean flag indicating whether the function was a success.
     * Includes a check of whether the player has enough wealth to purchase
     * the property
     *
     * Assignment notes
     * - {@link Property} offers type safety that only certain Monopoly board
     *   spaces can be purchased
     * - Do not add @throws because should never throw these errors
     */
    buyProperty(player, property) {
        const wealth = this.players.getWealth(player);
        if (wealth && wealth > property.price) {
            let set;
            switch (property.kind) {
                case "Deed":
                    set = property.colourSet;
                    break;
                case "Train":
                    set = "Train";
                    break;
                case "Utility":
                    set = "Utility";
                    break;
                default:
                    // type never so can't get here
                    throw new Error(`Invalid property with unknown kind`);
            }
            const setNames = this.board.getSet(set);
            if (setNames && this.ownership.acquire(player, property.name, setNames)) {
                const result = this.players.removeMoney(player, property.price);
                // we check that player has enough money so this should
                // never fail
                if (!result) {
                    throw new Error(`Despite having enough money still ` +
                        `failed to remove money`);
                }
                return result;
            }
        }
        return false;
    }
    /**
     * @param from Player to transfer money from
     * @param to Player to transfer money to
     * @param amount Amount to transfer
     * @returns Boolean indicating whether the function was a success or not
     *
     * Assignment notes
     * - With a real database we'd want to make these a transaction so that
     *   if the transfer fails we do not fail half-way. For the purposes of a
     *   game this is okay.
     */
    transferMoney(from, to, amount) {
        const result = this.players.removeMoney(from, amount);
        if (!result) {
            return false;
        }
        return this.players.addMoney(to, amount);
    }
    /**
     * @param deed Property deed to calculate rent for
     * @param sameOwner Flag whether all properties in a set have the same
     * owner
     * @returns The amount of money due, this is based upon the number of
     * houses or hotels on the site
     */
    calculateDeedRent(deed, sameOwner) {
        let rent = deed.rentNoHouse;
        switch (this.housing.getNumberHouses(deed.name)) {
            case 0:
                if (sameOwner) {
                    rent = rent * 2n;
                }
                break;
            case 1:
                rent = deed.rentOneHouse;
                break;
            case 2:
                rent = deed.rentTwoHouse;
                break;
            case 3:
                rent = deed.rentThreeHouse;
                break;
            case 4:
                rent = deed.rentFourHouse;
                break;
            case 5:
                rent = deed.rentHotel;
                break;
            default:
                throw new Error(`Undefined number of houses for ${deed.name}`);
        }
        return rent;
    }
    /**
     * @param train Train property to calculate rent for
     * @param sameOwner Flag whether all properties have the same owner
     * @returns Amount of money due, note this does not properly implement
     * the Monopoly train requirement for different amounts based upon
     * number of train stations owned. Instead it borrows the Deed logic of
     * doubling if all have {@link sameOwner}
     */
    calculateTrainRent(train, sameOwner) {
        let rent = train.amount;
        if (sameOwner) {
            rent = rent * 2n;
        }
        return rent;
    }
    /**
     * @param utility Utiilty to calculate rent for
     * @param sameOwner Flag whether all have the same owner
     * @param diceRoll Dice roll amount from which rent due is calculated
     * @returns Rent due
     */
    calculateUtilityRent(utility, sameOwner, diceRoll) {
        if (sameOwner) {
            return BigInt(diceRoll) * 10n;
        }
        else {
            return BigInt(diceRoll) * 4n;
        }
    }
}
exports.Transfer = Transfer;

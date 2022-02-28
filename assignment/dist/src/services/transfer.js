"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transfer = void 0;
class Transfer {
    /**
     *
     * @param ownership
     * @param players
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
     *
     * @param player
     * @param owner
     * @param property
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
    payUtilityRent(player, utility, diceRoll) {
        const owner = this.ownership.getOwner(utility.name);
        if (!owner) {
            return false;
        }
        const rent = this.calculateUtilityRent(utility, owner.sameOwner, diceRoll);
        return this.transferMoney(player, owner.id, rent);
    }
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
    transferMoney(from, to, amount) {
        const result = this.players.removeMoney(from, amount);
        if (!result) {
            return false;
        }
        return this.players.addMoney(to, amount);
    }
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
    calculateTrainRent(train, sameOwner) {
        let rent = train.amount;
        if (sameOwner) {
            rent = rent * 2n;
        }
        return rent;
    }
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

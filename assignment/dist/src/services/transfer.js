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
    constructor(board, players, ownership) {
        this.board = board;
        this.players = players;
        this.ownership = ownership;
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
        let owner = this.ownership.isOwned(property.name);
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
                rent = this.calculateUtilityRent(property, owner.sameOwner);
                break;
            default:
                // type never so can't get here
                throw new Error(`Invalid property with unknown kind`);
        }
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
            let setNames = this.board.getSet(set);
            if (setNames && this.ownership.acquire(player, property.name, setNames)) {
                let result = this.players.removeMoney(player, property.price);
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
        let result = this.players.removeMoney(from, amount);
        if (!result) {
            return false;
        }
        return this.players.addMoney(to, amount);
    }
    calculateDeedRent(deed, sameOwner) {
        let rent = deed.rentNoHouse;
        // TODO add call to housing component
        if (sameOwner) {
            rent = rent * 2n;
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
    calculateUtilityRent(utility, sameOwner) {
        let rent = utility.amount;
        if (sameOwner) {
            rent = rent * 2n;
        }
        return rent;
    }
}
exports.Transfer = Transfer;

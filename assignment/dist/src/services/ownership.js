"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ownership = void 0;
const board = __importStar(require("../types/board"));
class Ownership {
    constructor(monopolyboard) {
        this.monopolyboard = monopolyboard;
        this.ownership = {};
        this.initOwnership(this.monopolyboard);
    }
    /**
     * Assignment notes
     * - Optional chaining ?. to get nested access when reference might be
     *   undefined
     * - Strict check === to differentiate between undefined which means not
     *   yet defined for new spaces and null which means an absence of a value
     *   which is what we initialize to
     * - Partial discrimination to distinguish ownable spaces from non-ownable
     */
    initOwnership(b) {
        for (const bs of board.boardstreets) {
            for (const bn of board.boardnumbers) {
                // reached end of board
                let space = b?.[bs]?.[bn];
                if (!space) {
                    return;
                }
                // safe as already checked that these are defined and kind and 
                // name must exist
                let kind = space.kind;
                let name = space.name;
                const isDeed = kind == "Deed";
                const isTrain = kind == "Train";
                const isUtility = kind == "Utility";
                const canBeOwned = isDeed || isTrain || isUtility;
                if (canBeOwned && !this.ownership[name]) {
                    if (this.ownership[name] === null) {
                        throw new Error(`Inputted board has non-unique space ` +
                            `names where ${name} already exists`);
                    }
                    else {
                        this.ownership[name] = null;
                    }
                }
            }
        }
    }
    getOwner(name) {
        return this.ownership[name];
    }
    /**
     *
     * @param player
     * @param name
     * @param setNames
     *
     * Assignment notes
     * -
     */
    acquire(player, name, setNames) {
        // validate
        if (!setNames.includes(name)) {
            throw new Error(`Invalid setNames does not include ${name}`);
        }
        if (this.getOwner(name) === null) {
            this.ownership[name] = { id: player, sameOwner: false };
            let sameOwner = this.sameOwner(player, setNames);
            if (sameOwner) {
                for (const sn of setNames) {
                    this.ownership[sn] = { id: player, sameOwner: true };
                }
            }
            return true;
        }
        // if name doesn't exist or is already owned
        return false;
    }
    release(player, name, setNames) {
        // validate
        if (!setNames.includes(name)) {
            throw new Error(`Invalid setNames does not include ${name}`);
        }
        if (setNames.length < 2 || setNames.length > 4) {
            throw new Error(`Inputted set is invalid, it has length ` +
                `${setNames.length} but it must have at least 2 ` +
                `and at most 4 entries`);
        }
        if (this.getOwner(name)?.id == player) {
            if (this.ownership[name]?.sameOwner) {
                for (const sn of setNames) {
                    if (!this.ownership?.[sn]) { // undefined or null
                        throw new Error(`${sn} does not exist`);
                    }
                    else {
                        // check that sameOwner == true (and not undefined or 
                        // null) though still need to assert that .sameOwner
                        // exists
                        if (this.ownership[sn]?.sameOwner) {
                            this.ownership[sn].sameOwner = false;
                        }
                    }
                }
            }
            this.ownership[name] = null;
            return true;
        }
        // if property doesn't exist, not owned, or owned by another player
        return false;
    }
    /**
     *
     * @param player
     * @param setNames
     * @returns
     *
     * Assignment notes
     * - use functional methods map and reduce to replicate fold logic
     */
    sameOwner(player, setNames) {
        // validate
        if (setNames.length < 2 || setNames.length > 4) {
            throw new Error(`Inputted set is invalid, it has length ` +
                `${setNames.length} but it must have at least 2 ` +
                `and at most 4 entries`);
        }
        return setNames.map(name => this.ownership[name]?.id == player)
            .reduce((acc, cv) => acc && cv, true);
    }
}
exports.Ownership = Ownership;

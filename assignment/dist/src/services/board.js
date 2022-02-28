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
exports.Board = void 0;
const board = __importStar(require("../types/board"));
/**
 * Full monopoly board with 40 spaces
 *
 * Assignment notes
 * -
 */
class Board {
    /**
     * Assignment notes
     * - Optional chaining ?. to get nested access when reference might be
     *   undefined
     */
    constructor(monopolyboard) {
        this.monopolyboard = monopolyboard;
        /**
         * Assignment notes
         * - As discussed in class, typescript doesn't know that this is definitely
         *   assigned so need a default
         */
        this._boardSize = 0;
        /**
         * Assignment notes
         * - Union of ownable property sets with optional mapped type
         */
        this._sets = {};
        this._jail = null;
        let numberSpaces = 0;
        for (const bs of board.boardstreets) {
            for (const bn of board.boardnumbers) {
                // if space is undefined then that is the max board size
                let space = monopolyboard?.[bs]?.[bn];
                if (!space) {
                    if (numberSpaces == 0) {
                        throw new Error(`Inputted board has no spaces. Note
                            spaces must be filled from the first street, 
                            and first number onwards`);
                    }
                    this._boardSize = numberSpaces;
                    return;
                }
                numberSpaces++;
                if (space?.kind) {
                    let kind = space.kind;
                    if (kind == "Train" || kind == "Utility") {
                        if (this._sets?.[kind]) {
                            this._sets[kind]?.push(space.name);
                        }
                        else {
                            this._sets[kind] = [space.name];
                        }
                    }
                    else if (space.kind == "Deed") {
                        if (this._sets?.[space.colourSet]) {
                            this._sets[space.colourSet]?.push(space.name);
                        }
                        else {
                            this._sets[space.colourSet] = [space.name];
                        }
                    }
                    else if (space.kind == "Jail") {
                        this._jail = { street: bs, num: bn };
                    }
                }
            }
        }
        this._boardSize = numberSpaces;
    }
    /**
     * Assignment notes
     * - getter give access to private value set in constructor
     */
    get size() {
        return this._boardSize;
    }
    /**
     * In order to use modulus we convert to current location index which is
     * between 0 and boardSize (inclusive)
     * Assignment notes
     * - getter give access to private value set in constructor
     */
    movePiece(currentLocation, diceRoll) {
        // validate
        let currentLocationIndex = (currentLocation.street - 1) * 10 + currentLocation.num - 1;
        if (currentLocationIndex >= this._boardSize) {
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this._boardSize} on board`);
        }
        // get new location
        currentLocationIndex = (currentLocationIndex + diceRoll)
            % this._boardSize;
        // convert to type Location
        let streetIndex = 1;
        while (currentLocationIndex >= 10) {
            streetIndex++;
            currentLocationIndex = currentLocationIndex - 10;
        }
        let numberIndex = 1;
        while (currentLocationIndex >= 1) {
            numberIndex++;
            currentLocationIndex--;
        }
        return {
            street: streetIndex,
            num: numberIndex
        };
    }
    /**
     *
     * @param currentLocation
     * @returns
     *
     * Assignment notes
     * - Returning board.Space we have the kind field to discriminate which of
     *   the Space union we have.
     */
    getSpace(currentLocation) {
        // validate
        let currentLocationIndex = (currentLocation.street - 1) * 10 + currentLocation.num - 1;
        if (currentLocationIndex > this._boardSize) {
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this._boardSize} on board`);
        }
        // we know that index is not undefined as we validated above
        return this.monopolyboard[currentLocation.street][currentLocation.num];
    }
    getSet(set) {
        return this._sets[set];
    }
    getJailLocation() {
        return this._jail;
    }
}
exports.Board = Board;

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
 * Monopoly board service which stores instance of {@link GenericBoard}
 * mapping from a {@link BoardLocation} to a {@link Space}. It also manages
 * other board specific services like mapping names of a space to their
 * location, and moving pieces across the board with {@link movePiece}.
 * It supports theoretically any board size up to 40 spaces of a full
 * monopoly board
 */
class Board {
    /**
     * When we process a monopoly board we loop through each
     * {@link BoardStreet} and {@link BoardNumber}. As we support
     * {@link GenericBoard} which can have less than 40 locations we
     * determine the size of the board dynamically by checking for the first
     * {@link Space} that is undefined
     *
     * @throws Error if number of spaces on inputted {@link GenericBoard}
     * is 0.
     *
     * Assignment notes
     * - Optional chaining ?. to get nested access when reference might be
     *   undefined
     * - for...of loops
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
         * Mapping from {@link Colour} or "Train" or "Utility" to list of names
         * of properties in that type. E.g. for Brown return Old Kent Road, and
         * Whitechapel Road.
         *
         * Assignment notes
         * - Union of ownable property sets with optional mapped type to allow
         *   for absence of sets types on {@link GenericBoard}
         */
        this._sets = {};
        /**
         * Map of space name to {@link BoardLocation}.
         *
         * Assignment notes
         * - We use a map here rather than a mapped type as with {@link _sets} as
         *   Typescript does not support type guards on array access, so even if
         *   we type-guard on a const defined for the value at that array this only
         *   works for getting values, not for assigning to values
         *   See {@link https://github.com/Microsoft/TypeScript/issues/11483}
         */
        this._nameLocations = new Map();
        let numberSpaces = 0;
        for (const bs of board.boardstreets) {
            for (const bn of board.boardnumbers) {
                // if space is undefined then that is the max board size
                const space = monopolyboard?.[bs]?.[bn];
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
                    const kind = space.kind;
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
                    if (space?.name) {
                        this._nameLocations.set(space.name, { street: bs, num: bn });
                    }
                }
            }
        }
        this._boardSize = numberSpaces;
    }
    /**
     * Get size of monopoly board, which is dynamically determined in the
     * constructor
     *
     * Assignment notes
     * - getter give access to private value set in constructor
     */
    get size() {
        return this._boardSize;
    }
    /**
     * In order to use modulus we convert to current location index which is
     * between 0 and boardSize (inclusive). This means that {@link movePiece}
     * works with any board size
     *
     * @throw Error if {@link BoardLocation} is invalid because it is larger
     * than the board size.
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
     * Primary {@link Board} service method, returning the {@link Space} at a
     * given {@link BoardLocation}
     *
     * @param currentLocation {@link BoardLocation} requested
     * @returns Space at that {@link BoardLocation} or otherwise
     * undefined
     *
     * @throws Error if the current location is invalid because the location
     * is not on the board
     *
     * Assignment notes
     * - Returning board.Space we have the kind field to discriminate which of
     *   the Space union we have.
     */
    getSpace(currentLocation) {
        // validate
        const currentLocationIndex = (currentLocation.street - 1) * 10 + currentLocation.num - 1;
        if (currentLocationIndex > this._boardSize ||
            currentLocationIndex < 0) {
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this._boardSize} on board`);
        }
        // we know that index is not undefined as we validated above
        const result = this.monopolyboard[currentLocation.street]?.[currentLocation.num];
        return result;
    }
    /**
     * @param set Requested {@link Colour}, "Train" or "Utility" set
     * @returns Slice of names of properties e.g. for 'Brown' return
     * Old Kent Road and Whitechapel Road
     */
    getSet(set) {
        return this._sets[set];
    }
    /**
     * @param name Name of property or space
     * @returns The {@link BoardLocation} with that name.
     */
    getLocation(name) {
        return this._nameLocations.get(name);
    }
}
exports.Board = Board;

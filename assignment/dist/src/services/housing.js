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
exports.Housing = void 0;
const board = __importStar(require("../types/board"));
const deed_1 = require("../types/space/deed");
const stack_1 = require("../adt/stack");
class Housing {
    constructor(monopolyboard, players, ownership) {
        this.monopolyboard = monopolyboard;
        this.players = players;
        this.ownership = ownership;
        this.building = {};
        this.buildingOrder = {};
        // as defined by monopoly rules
        this.remainingHouses = 32;
        this.remainingHotels = 12;
        this.initBuilding(this.monopolyboard);
        this.initBuildingOrder();
    }
    initBuilding(b) {
        for (const bs of board.boardstreets) {
            for (const bn of board.boardnumbers) {
                // reached end of board
                const space = b?.[bs]?.[bn];
                if (!space) {
                    return;
                }
                // safe as already checked that these are defined and kind and 
                // name must exist
                const kind = space.kind;
                const name = space.name;
                if (kind == "Deed" && !this.building[name]) {
                    if (this.building[name] == 0) {
                        throw new Error(`Inputted board has non-unique space` +
                            ` names where ${name} already exists`);
                    }
                    else {
                        this.building[name] = 0;
                    }
                }
            }
        }
    }
    initBuildingOrder() {
        for (const c of deed_1.colours) {
            this.buildingOrder[c] = new stack_1.Stack(5);
        }
    }
    getNumberHouses(name) {
        return this.building[name];
    }
    getBankRemainingHouses() {
        return this.remainingHouses;
    }
    getBankRemainingHotels() {
        return this.remainingHotels;
    }
    buyHouseOrHotel(player, name, colourSet, setNames, housePrice) {
        // check that player is owner of all in set
        const owner = this.ownership.getOwner(name);
        console.log(owner);
        if (!owner || !owner?.sameOwner || owner?.id != player) {
            return false;
        }
        if (!setNames.includes(name)) {
            return false;
        }
        // check that hotels don't already exist on all 3 properties
        const buildingStack = this.buildingOrder?.[colourSet];
        console.log(buildingStack);
        if (!buildingStack) {
            return false;
        }
        const numHouses = buildingStack.size();
        if (numHouses == 5) {
            if (buildingStack.peek()?.size == setNames.length) {
                return false;
            }
            if (this.remainingHotels == 0) {
                return false;
            }
        }
        else {
            if (this.remainingHouses == 0) {
                return false;
            }
        }
        // check that not building unevenly
        let housesBuilt = buildingStack.peek();
        if (!housesBuilt) {
            housesBuilt = new Set();
        }
        console.log(housesBuilt);
        // all houses built at this level e.g. all properties have 3 houses
        if (housesBuilt?.size == setNames.length) {
            const wealth = this.players.getWealth(player);
            if (wealth && wealth > housePrice) {
                this.players.removeMoney(player, housePrice);
                buildingStack.push(new Set().add(name));
                this.building[name]++;
                if (buildingStack.size() == 5) {
                    this.remainingHotels--;
                    this.remainingHouses = this.remainingHouses + 4;
                }
                else {
                    this.remainingHouses--;
                }
                return true;
            }
            // we have already built a house on this property
        }
        else if (housesBuilt?.has(name)) {
            return false;
            // haven't yet built a house 
        }
        else {
            const wealth = this.players.getWealth(player);
            console.log(wealth);
            if (wealth && wealth >= housePrice) {
                const houseAdded = housesBuilt?.add(name);
                console.log(houseAdded);
                if (!houseAdded) {
                    return false;
                }
                this.players.removeMoney(player, housePrice);
                buildingStack.pop();
                buildingStack.push(houseAdded);
                this.buildingOrder[colourSet] = buildingStack;
                this.building[name]++;
                if (buildingStack.size() == 5) {
                    this.remainingHotels--;
                    this.remainingHouses = this.remainingHouses + 4;
                }
                else {
                    this.remainingHouses--;
                }
                return true;
            }
        }
        return false;
    }
}
exports.Housing = Housing;

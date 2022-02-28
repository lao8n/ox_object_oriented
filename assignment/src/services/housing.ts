// adt imports
import { Stack } from '../adt/stack';
// services imports
import { Players } from "./players";
import { Ownership } from "./ownership";
// types imports
import { Money } from '../types/money';
import * as board from '../types/board';
import { Colour, colours } from "../types/space/deed";
import { PlayerID } from '../types/player';

export type NumHouses = 0 | 1 | 2 | 3 | 4 | 5 // 5 represents hotel

export class Housing<M extends Money, B extends board.GenericBoard<M>>{
    private building: {
        [name: string]: NumHouses
    } = {};

    private buildingOrder: {
        [C in Colour]?: Stack<Set<string>>;
    } = {};

    // as defined by monopoly rules
    private remainingHouses = 32;
    private remainingHotels = 12;

    constructor(
        private readonly monopolyboard: B,
        private readonly players: Players<M>,
        private readonly ownership : Ownership<M, B>){
        this.initBuilding(this.monopolyboard);
        this.initBuildingOrder();
    }

    private initBuilding(b: B){
        for(const bs of board.boardstreets){
            for(const bn of board.boardnumbers){
                // reached end of board
                const space = b?.[bs]?.[bn];
                if(!space){ 
                    return;
                }
                // safe as already checked that these are defined and kind and 
                // name must exist
                const kind = space.kind;
                const name = space.name;
                if(kind == "Deed" && !this.building[name]){
                    if(this.building[name] == 0){
                        throw new Error(`Inputted board has non-unique space` + 
                        ` names where ${name} already exists`);
                    } else {
                        this.building[name] = 0;
                    }
                }
            }
        }
    }

    private initBuildingOrder(){
        for(const c of colours){
            this.buildingOrder[c] = new Stack<Set<string>>(5);
        }
    }

    public getNumberHouses(name : string){
        return this.building[name];
    }

    public getBankRemainingHouses(){
        return this.remainingHouses;
    }

    public getBankRemainingHotels(){
        return this.remainingHotels;
    }

    public buyHouseOrHotel(player: PlayerID, name: string, colourSet: Colour, 
        setNames: string[], housePrice: M){
        // check that player is owner of all in set
        const owner = this.ownership.getOwner(name);
        if(!owner || !owner?.sameOwner || owner?.id != player){
            return false;
        }
        if(!setNames.includes(name)){
            return false;
        }
        // check that hotels don't already exist on all 3 properties
        const buildingStack = this.buildingOrder?.[colourSet];
        if(!buildingStack){
            return false;
        }
        const numHouses = buildingStack.size();
        if(numHouses == 5){
            if(buildingStack.peek()?.size == setNames.length){
                return false;
            }
            if(this.remainingHotels == 0){
                return false;
            }
        } else {
            if(this.remainingHouses == 0){
                return false;
            }
        }
        // check that not building unevenly
        let housesBuilt = buildingStack.peek();
        if(!housesBuilt){
            housesBuilt = new Set<string>();
        }
        // all houses built at this level e.g. all properties have 3 houses
        if(housesBuilt?.size == setNames.length){ 
            const wealth = this.players.getWealth(player);
            if(wealth && wealth > housePrice){
                this.players.removeMoney(player, housePrice);
                buildingStack.push(new Set<string>().add(name));
                this.building[name]++;
                if(buildingStack.size() == 5){
                    this.remainingHotels--;
                    this.remainingHouses = this.remainingHouses + 4;
                } else {
                    this.remainingHouses--;
                }
                return true;
            }
        // we have already built a house on this property
        } else if(housesBuilt?.has(name)){
            return false;
        // haven't yet built a house 
        } else {
            const wealth = this.players.getWealth(player);
            if(wealth && wealth >= housePrice){
                const houseAdded = housesBuilt?.add(name);
                if(!houseAdded){
                    return false;
                }
                this.players.removeMoney(player, housePrice);
                buildingStack.pop();
                buildingStack.push(houseAdded);    
                this.buildingOrder[colourSet] = buildingStack;
                this.building[name]++;
                if(buildingStack.size() == 5){
                    this.remainingHotels--;
                    this.remainingHouses = this.remainingHouses + 4;
                } else {
                    this.remainingHouses--;
                }         
                return true;
            }
        }
        return false;
    }
}
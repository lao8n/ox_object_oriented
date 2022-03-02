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

/**
 * Housing service to manage buying of houses and hotels
 */
export class Housing<M extends Money, B extends board.GenericBoard<M>>{
    /**
     * Store number of houses at each space name where {@link NumHouses}
     * is between 0 and 5 with 5 representing a hotel
     */
    private building: {
        [name: string]: NumHouses
    } = {};

    /**
     * {@link buildingOrder} stores for each {@link Colour} a stack of set of 
     * property names. For example, if the {@link Colour} is Brown then the
     * properties would be Old Kent Road, and Whitechapel Road. If the former
     * has 3 houses and the latter has 2 houses then the stack would like this 
     * ["Old Kent Road"] <- top of stack
     * ["Whitechapel Road", "Old Kent Road"]
     * ["Old Kent Road", "Whitechapel Road"]
     * The stack enforces that only the housing is built evenly - although 
     * it does not enforce a specific order e.g. Old Kent Road first for first
     * house but second for second house
     * 
     * Assignment notes 
     * - Use ? for an optional map type, this is important as 
     *   {@link GenericBoard} may not have all possible {@link Colour} on 
     *   the board
     */
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

    /**
     * @param b Input monopoly board
     * @returns void
     * @throws Error if same space name is duplicated on the provided
     * {@link GenericBoard}
     */
    private initBuilding(b: B): void{
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

    /**
     * Initialise stack for each {@link Colour}
     */
    private initBuildingOrder(){
        for(const c of colours){
            this.buildingOrder[c] = new Stack<Set<string>>(5);
        }
    }

    /**
     * @param name Given name of space
     * @returns Get the number of houses on that space, between 0 and 5, with
     * 5 representing a hotel
     */
    public getNumberHouses(name : string){
        return this.building[name];
    }

    /**
     * @returns The number of remaining houses that the bank has to build 
     */
    public getBankRemainingHouses(){
        return this.remainingHouses;
    }

    /**
     * @returns The number of remaining hotels that the bank has to build 
     */
    public getBankRemainingHotels(){
        return this.remainingHotels;
    }

    /**
     * Primary function to buy a house or hotel on a property. Using a stack
     * it enforces even building of houses with enforcing a specific order that
     * the houses are built in. {@see _nameLocations} for more details.
     * 
     * @param player {@link PlayerID} of person wishing to build
     * @param name Name of {@link Space} they want to build on
     * @param colourSet The {@link Colour} of the set that the deed belongs to.
     * @param setNames A list of names of properties of that {@link Colour}
     * @param housePrice The price of a house determined on the {@link Deed}
     * @returns True or false depending upon whether the house was built
     * 
     * Assignment notes
     * - Use generic stack {@link Stack} to ensure evenly distributed building 
     *   order
     * - Use {@link Set} to ensure no replicas
     */
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
        // already have a hotel built, cannot build anymore
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
            // check have enough money
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
                // update the bank's number of houses and hotels
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
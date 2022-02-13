import { Money } from '../types/money';
import { PlayerID } from '../types/player';
import * as board from '../types/board'

export type Owner = {
    id: PlayerID, 
    sameOwner: boolean
}

export class Ownership<M extends Money, B extends board.GenericBoard<M>>{
    private ownership: {
        [name: string]: Owner | null
    } = {}

    constructor(private readonly monopolyboard: B){
        this.initOwnership(monopolyboard)
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
    private initOwnership(b: B){
        for(const bs of board.boardstreets){
            for(const bn of board.boardnumbers){
                // reached end of board
                let space = b?.[bs]?.[bn]
                if(!space){ 
                    return
                }
                // safe as already checked that these are defined and kind and 
                // name must exist
                let kind = space.kind
                let name = space.name
                const isDeed = kind == "Deed";
                const isTrain = kind == "Train";
                const isUtility = kind == "Utility";
                const canBeOwned = isDeed || isTrain || isUtility
                if(canBeOwned && !this.ownership[name]){
                    if(this.ownership[name] === null){
                        throw new Error(`Inputted board has non-unique space ` + 
                            `names where ${name} already exists`)
                    } else {
                        this.ownership[name] = null   
                    }
                } 
            }
        }
    }

    public isOwned(name : string): Owner | undefined | null {
        return this.ownership[name]
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
    public acquire(player: PlayerID, name: string, setNames : string[]){
        // validate
        if(!setNames.includes(name)){
            throw new Error(`Invalid setNames does not include ${name}`)
        }

        if(this.isOwned(name) === null){
            this.ownership[name] = { id: player, sameOwner: false }
            let sameOwner = this.sameOwner(player, setNames)
            if(sameOwner){
                for(const sn of setNames){
                    this.ownership[sn] = { id : player, sameOwner: true}
                }
            }
            return true
        }
        // if name doesn't exist or is already owned
        return false
    }

    public release(player: PlayerID, name: string, setNames : string[]){
        // validate
        if(!setNames.includes(name)){
            throw new Error(`Invalid setNames does not include ${name}`)
        }
        if(setNames.length < 2 || setNames.length > 4){
            throw new Error(`Inputted set is invalid, it has length ` + 
                            `${setNames.length} but it must have at least 2 ` +
                            `and at most 4 entries`)
        }

        if(this.isOwned(name)?.id == player){
            if(this.ownership[name]?.sameOwner){
                for(const sn of setNames){
                    if(!this.ownership?.[sn]){ // undefined or null
                        throw new Error(`${sn} does not exist`)
                    } else {
                        // check that sameOwner == true (and not undefined or 
                        // null) though still need to assert that .sameOwner
                        // exists
                        if(this.ownership[sn]?.sameOwner){
                            this.ownership[sn]!.sameOwner = false
                        }
                    }
                }
            }
            this.ownership[name] = null
            return true
        }
        // if property doesn't exist, not owned, or owned by another player
        return false
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
    private sameOwner(player: PlayerID, setNames : string[]){
        // validate
        if(setNames.length < 2 || setNames.length > 4){
            throw new Error(`Inputted set is invalid, it has length ` + 
                            `${setNames.length} but it must have at least 2 ` +
                            `and at most 4 entries`)
        }
        return setNames.map(name => this.ownership[name]?.id == player)
                       .reduce((acc, cv) => acc && cv, true)
    }
}
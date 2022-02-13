import { Money } from '../model/money';
import { PlayerID } from '../model/player';
import * as board from '../model/board'

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
                if(!b?.[bs]?.[bn]){ 
                    return
                }
                // safe as already checked that these are defined and kind and 
                // name must exist
                let kind = b![bs]![bn]!.kind
                let name = b![bs]![bn]!.name
                const isDeed = kind == "Deed";
                const isTrain = kind == "Train";
                const isUtility = kind == "Utility";
                const canBeOwned = isDeed || isTrain || isUtility
                if(canBeOwned && !this.ownership[name]){
                    if(this.ownership[name] === null){
                        throw new Error(`Inputted board has non-unique space 
                            names where ${name} already exists`)
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

    // public acquire(player: PlayerID, name: string){

    // }

}
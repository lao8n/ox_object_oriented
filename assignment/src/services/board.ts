import { Money } from '../model/money';
import * as board from '../model/board';
import { Colour } from '../model/space/deed';
import { PairDiceValue } from './dice';
import { PlayerID } from '../model/player';

/**
 * Full monopoly board with 40 spaces
 * 
 * Assignment notes
 * - 
 */

export class Board<M extends Money, B extends board.GenericBoard<M>>{

    /**
     * Assignment notes
     * - As discussed in class, typescript doesn't know that this is definitely
     *   assigned so need a default
     */
    // TODO check it is okay that constructor argument is private readonly
    private _boardSize: number = 0 
    /**
     * Assignment notes
     * - Union of ownable property sets with optional mapped type
     */
    private _sets : {
        [S in Colour | "Train" | "Utility"]?: string[]
    } = {}

    /**
     * Assignment notes
     * - Optional chaining ?. to get nested access when reference might be 
     *   undefined
     */
    constructor(private readonly monopolyboard: B){
        let numberSpaces = 0
        for(const bs of board.boardstreets){
            for(const bn of board.boardnumbers){
                // if space is undefined then that is the max board size
                if(!monopolyboard?.[bs]?.[bn]){ 
                    if(numberSpaces == 0){
                        throw new Error(`Inputted board has no spaces. Note
                            spaces must be filled from the first street, 
                            and first number onwards`)
                    }
                    this._boardSize = numberSpaces
                    return
                }
                numberSpaces++
                let space = monopolyboard![bs]![bn]
                if(space?.kind){
                    let kind = space.kind
                    if(kind == "Train" || kind == "Utility"){
                        if(this._sets?.[kind]){
                            this._sets![kind]!.push(space.name)
                        } else {
                            this._sets[kind] = [space.name]
                        }
                    } else if(space.kind == "Deed"){
                        if(this._sets?.[space.colourSet]){
                            this._sets![space.colourSet]!.push(space.name)
                        } else {
                            this._sets[space.colourSet] = [space.name]
                        }
                    }
                }
            }
        }
        this._boardSize = numberSpaces  
    }

    /**
     * Assignment notes
     * - getter give access to private value set in constructor
     */
    get size(): number{
        return this._boardSize
    }

    /**
     * In order to use modulus we convert to current location index which is 
     * between 0 and boardSize (inclusive)
     * Assignment notes
     * - getter give access to private value set in constructor
     */
    movePiece(currentLocation: board.Location, diceRoll: PairDiceValue): 
        board.Location {
        // validate
        let currentLocationIndex = 
            (currentLocation.street - 1) * 10 + currentLocation.num - 1
        if(currentLocationIndex >= this._boardSize){
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this._boardSize} on board`)
        }

        // get new location
        currentLocationIndex = (currentLocationIndex + diceRoll) 
            % this._boardSize 

        // convert to type Location
        let streetIndex = 1
        while(currentLocationIndex >= 10){
            streetIndex++
            currentLocationIndex = currentLocationIndex - 10
        }
        let numberIndex = 1
        while(currentLocationIndex >= 1){
            numberIndex++
            currentLocationIndex--
        }
        return {
            street: streetIndex as board.BoardStreet,
            num: numberIndex as board.BoardNumber
        }
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
    getSpace(currentLocation: board.Location): board.Space<M> {
        // validate
        let currentLocationIndex = 
            (currentLocation.street - 1) * 10 + currentLocation.num - 1
        if(currentLocationIndex > this._boardSize){
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this._boardSize} on board`)
        }
        
        // we know that index is not undefined as we validated above
        return this.monopolyboard!
            [currentLocation.street]!
                [currentLocation.num]!
    }

    getSet(set : Colour | "Train" | "Utility" ){ 
        return this._sets[set]
    }
}
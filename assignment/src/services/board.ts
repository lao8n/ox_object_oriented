import { Money } from '../model/money';
import * as board from '../model/board'
import { PairDiceValue } from './dice';

/**
 * Full monopoly board with 40 spaces
 * 
 * Assignment notes
 * - 
 */

export class Board<M extends Money, T extends board.GenericBoard<M>>{

    /**
     * Assignment notes
     * - As discussed in class, typescript doesn't know that this is definitely
     *   assigned so need a default
     */
    private boardSize: number = 0 
    constructor(public readonly monopolyboard: T){
        this.monopolyboard = monopolyboard
        this.numberSpaces(monopolyboard)    
    }

    /**
     * Assignment notes
     * - Optional chaining ?. to get nested access when reference might be 
     *   undefined
     */
    private numberSpaces(b: T){
        let numberSpaces = 0
        for(const bs of board.boardstreets){
            for(const bn of board.boardnumbers){
                // if space is undefined then that is max board size
                if(!b?.[bs]?.[bn]){ 
                    if(numberSpaces == 0){
                        throw new Error(`Inputted board has no spaces. Note
                            spaces must be filled from the first street, 
                            and first number onwards`)
                    }
                    this.boardSize = numberSpaces
                    return
                }
                numberSpaces++
            }
        }
        this.boardSize = numberSpaces
    }

    /**
     * Assignment notes
     * - 
     */
    get size(): number{
        return this.boardSize
    }

    movePiece(currentLocation: board.Location, diceRoll: PairDiceValue): 
        board.Location {
        // validate
        let currentLocationIndex = 
            (currentLocation.street - 1) * 10 + currentLocation.num
        if(currentLocationIndex > this.boardSize){
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this.boardSize} on board`)
        }

        // get new location
        currentLocationIndex = (currentLocationIndex + diceRoll) 
            % this.boardSize 
        
        // convert to type Location
        let streetIndex = 1
        while(currentLocationIndex >= 10){
            streetIndex++
            currentLocationIndex = currentLocationIndex - 10
        }
        let numberIndex = 1
        while(currentLocationIndex >= 0){
            numberIndex++
            currentLocationIndex--
        }
        return {
            street: streetIndex as board.BoardStreet,
            num: numberIndex as board.BoardNumber
        }
    }

    // getSpace(currentLocation: board.Location): board.Space<M> {
    //     // validate
    //     let currentLocationIndex = 
    //         (currentLocation.street - 1) * 10 + currentLocation.num
    //     if(currentLocationIndex > this.boardSize){
    //         throw new Error(`Current location is invalid ${currentLocation} 
    //             only ${this.boardSize} on board`)
    //     }
        
    //     return this.monopolyboard[currentLocation.street][currentLocation.num]
    // }
}
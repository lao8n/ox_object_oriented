import { Money } from '../model/money';
import * as monopolyboard from '../model/board'
import { PairDiceValue } from './dice';

/**
 * Full monopoly board with 40 spaces
 * 
 * Assignment notes
 * - 
 */

export class Board<M extends Money, T extends monopolyboard.MinimalBoard<M>>{

    private boardSize: number

    constructor(public readonly board: T){
        this.board = board
        this.numberSpaces(board)    
    }

    /**
     * Assignment notes
     * - 
     */
    private numberSpaces(board: T){
        let numberSpaces = 0;
        for(let s = 1; s <= 4; s++){
            for(let n = 1; n <= 10; n++){
                if(board[s][n] == undefined){
                    this.boardSize == numberSpaces
                    if(numberSpaces == 0){
                        throw new Error(`Inputted board has no spaces. Note
                            spaces must be filled from the first street, 
                            and first number onwards`)
                    }
                    return
                }
                numberSpaces++
            }
        }
    }

    movePiece(currentLocation: monopolyboard.Location, diceRoll: PairDiceValue): 
        monopolyboard.Location {
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
            street: streetIndex as monopolyboard.BoardStreet,
            num: numberIndex as monopolyboard.BoardNumber
        }
    }

    getSpace(currentLocation: monopolyboard.Location): monopolyboard.Space<M> {
        // validate
        let currentLocationIndex = 
            (currentLocation.street - 1) * 10 + currentLocation.num
        if(currentLocationIndex > this.boardSize){
            throw new Error(`Current location is invalid ${currentLocation} 
                only ${this.boardSize} on board`)
        }
        
        return this.board[currentLocation.street][currentLocation.num]
    }
}
import { Money } from '../model/money';
import { MinimalBoard, Space } from '../model/board'
import { PairDiceValue } from './dice';

/**
 * Full monopoly board with 40 spaces
 * 
 * Assignment notes
 * - 
 */

export class Board<M extends Money, T extends MinimalBoard<M>>{

    constructor(public readonly board: T, 
                public readonly numberSpaces: number){
        if(!Number.isInteger(numberSpaces)){
            throw new Error(`Number of spaces is invalid ${numberSpaces}. 
                It should be an integer`)
        }
        if(numberSpaces > 40){
            throw new Error(`Exceeds the maximum number of spaces for a
                valid monopoly board of 40 ${numberSpaces}`)
        }
        this.numberSpaces = numberSpaces
        this.board = board
    }

    movePiece(currentLocation: number, diceRoll: PairDiceValue): number {
        if (currentLocation >= this.numberSpaces || currentLocation < 0){
            throw new Error(`Current location is invalid ${currentLocation} 
                only {this.numberSpaces} on board`)
        }
        if (!Number.isInteger(currentLocation)){
            throw new Error(`Current location is not an integer 
                ${currentLocation}`)
        }
        let newLocation = (currentLocation + diceRoll) % this.numberSpaces
        return newLocation
    }

    getSpace(currentLocation: number): Space<M> {
        if (currentLocation >= this.numberSpaces || currentLocation < 0){
            throw new Error(`Current location is invalid ${currentLocation} 
                only {this.numberSpaces} on board`)
        }
        if (!Number.isInteger(currentLocation)){
            throw new Error(`Current location is not an integer 
                ${currentLocation}`)
        }
        let streetIndex = 1
        while(currentLocation >= 10){
            streetIndex++
            currentLocation = currentLocation - 10
        }
        let numberIndex = 1
        while(currentLocation >= 0){
            numberIndex++
            currentLocation--
        }
        return this.board[streetIndex][numberIndex]
    }

}
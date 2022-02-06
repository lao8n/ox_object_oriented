import { Go } from '../model/go';
import { Money } from '../model/money';
import { MonopolyBoard } from '../model/board'


/**
 * Full monopoly board with 40 spaces
 * 
 * Assignment notes
 * - Use special type operator Required to make all four 'streets'
 *   i.e. the four sides of the board required
 */

export class Board<M extends Money, T extends MinimalBoard<M>>{
    private readonly board: T

    private constructor(board: T){
        this.board = board
    }
}
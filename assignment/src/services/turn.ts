import { Board } from "../components/board"
import { diceGenerator, PairDiceValue } from "../components/dice"
import { Players } from "../components/players"
import { GenericBoard, MonopolyBoard } from "../types/board"
import { Money } from "../types/money"
import { PlayerID } from "../types/player"

export type Turn = {
    player : PlayerID
    stage : Stage
}

export type Stage = "Roll" | "UnownedProperty" | "OwnedProperty"

class ConcreteTurn<M extends Money, B extends MonopolyBoard<M>>{
    // Turn is the tag property 
    turn : Turn = {player: 1, stage: "Roll"} 
    dice = diceGenerator()

    private constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
    ){
        this.dice.next(true) // initialize generator
    }

    roll(){
        let roll = this.dice.next()
        if(roll.done == false){
            // didn't throw a double
            const location = this.updateLocation(roll.value[0])  
            // didn't throw a double           
            if(roll.value[1]){
                const space = this.board.getSpace(location)
            }
        } 
        // threw 3 doubles
        else {
            const jail = this.board.getJailLocation()
            if(jail){
                this.players.setLocation(this.turn.player, jail)
            }
        }
    }

    private updateLocation(rollResult: PairDiceValue){
        let location = this.players.getLocation(this.turn.player)
        location = this.board.movePiece(location, rollResult)
        this.players.setLocation(this.turn.player, {street: 2, num: 1})
        return location
    }
}
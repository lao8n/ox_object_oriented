import { Board } from "../components/board"
import { diceGenerator } from "../components/dice"
import { Players } from "../components/players"
import { GenericBoard } from "../types/board"
import { Money } from "../types/money"
import { PlayerID } from "../types/player"

export type Turn = {
    player : PlayerID
    stage : Stage
}

export type Stage = "Roll" | "UnownedProperty" | "OwnedProperty"

class ConcreteTurn<M extends Money, B extends GenericBoard<M>>{
    // Turn is the tag property 
    turn : Turn = {player: 1, stage: "Roll"} 
    dice = diceGenerator()

    private constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
    ){}

    roll(){
        let roll = this.dice.next()
        if(roll.done == false){
            const location = this.players.getLocation(this.turn.player)
            this.board.movePiece(location, roll.value)
        }
    }
}
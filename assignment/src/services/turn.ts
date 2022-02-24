import { DataFactory } from "../../data/uk"
import { Board } from "../components/board"
import { diceGenerator, PairDiceValue } from "../components/dice"
import { Ownership } from "../components/ownership"
import { Players } from "../components/players"
import { GenericBoard, MonopolyBoard, Space } from "../types/board"
import { Money } from "../types/money"
import { PlayerID } from "../types/player"
import { Transfer } from "./transfer"

export type Turn = TurnRoll | TurnUnownedProperty | TurnOwnedProperty 

export interface TurnRoll {
    roll
}
export interface TurnUnownedProperty{
    buyProperty
    finishTurn
}
export interface TurnOwnedProperty{
    payRent
    finishTurn
}

export interface TurnFinish {
    finishTurn
}

export type TurnTag = {
    player : PlayerID
    stage : Stage
}
export type Stage = "Roll" | "UnownedProperty" | "OwnedProperty" | "Finish"

class ConcreteTurn<M extends Money, B extends MonopolyBoard<M>>{
    turn : TurnTag // Turn is the tag property 
    space : Space<M>
    dice = diceGenerator()

    constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
        private readonly ownership: Ownership<M, B>,
        private readonly transfer: Transfer<M, B>,
    ){
        this.turn = {player: this.players.getCurrentTurnPlayer(), stage: "Roll"} 
        this.space = DataFactory.createGo<M>()
        this.dice.next(true) // initialize generator
    }

    start(): TurnRoll{
        return this as TurnRoll
    }

    roll(): TurnUnownedProperty | TurnOwnedProperty {
        let roll = this.dice.next()
        if(roll.done == false){
            const location = this.updateLocation(roll.value[0])  
            // didn't throw a double           
            if(roll.value[1]){
                this.space = this.board.getSpace(location)
                const owner = this.ownership.isOwned(this.space.name)
                // unowned
                if(owner == null){
                    this.turn.stage = "UnownedProperty"
                    return this as TurnUnownedProperty
                } 
                // owned
                else if (owner){
                    this.turn.stage = "OwnedProperty"
                    return this as TurnOwnedProperty
                }
                // undefined i.e. not an ownable property  
                else {

                }
            }
        } 
        // threw 3 doubles
        else {
            const jail = this.board.getJailLocation()
            if(jail){
                this.players.setLocation(this.turn.player, jail)
                this.players.setInJail(this.turn.player, true)
            }

        }
    }

    buyProperty(): TurnFinish{
        // cannot make a separate method isProperty as typescript cannot do type 
        // inference
        if(this.space.kind == "Deed" || this.space.kind == "Utility" || 
           this.space.kind == "Train") {
            this.transfer.buyProperty(this.turn.player, this.space)
        }
        this.turn.stage = "Finish"
        return this as TurnFinish
    }

    payRent(): TurnFinish{
        if(this.space.kind == "Deed" || this.space.kind == "Utility" || 
           this.space.kind == "Train") {
            this.transfer.payRent(this.turn.player, this.space)
        }
        this.turn.stage = "Finish"
        return this as TurnFinish
    }

    finishTurn(): TurnRoll{
        this.turn = { player : this.players.getCurrentTurnPlayer(), stage: "Roll"} 
        return this as TurnRoll
    }

    private updateLocation(rollResult: PairDiceValue){
        let location = this.players.getLocation(this.turn.player)
        location = this.board.movePiece(location, rollResult)
        this.players.setLocation(this.turn.player, {street: 2, num: 1})
        return location
    }
}
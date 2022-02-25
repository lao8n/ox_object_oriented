import { DataFactory } from "../../data/uk"
import { Board } from "../components/board"
import { diceGenerator, PairDiceValue } from "../components/dice"
import { Ownership } from "../components/ownership"
import { Players } from "../components/players"
import { GenericBoard, MonopolyBoard, Space } from "../types/board"
import { Money } from "../types/money"
import { Player, PlayerID } from "../types/player"
import { Transfer } from "./transfer"

export type Turn = TurnRoll | TurnUnownedProperty | TurnOwnedProperty 

export interface TurnBase {
    readonly player: PlayerID
    readonly stage: Stage
}

export type NotTurn = TurnBase 

export interface TurnRoll extends TurnBase {
    readonly stage: "Roll"
    roll(player : PlayerID): TurnUnownedProperty | TurnOwnedProperty
}
export interface TurnUnownedProperty extends TurnBase {
    readonly stage: "UnownedProperty"
    buyProperty(player : PlayerID): TurnFinish
    finishTurn(player : PlayerID): TurnRoll
}
export interface TurnOwnedProperty extends TurnBase{
    readonly stage: "OwnedProperty"
    payRent(player : PlayerID): TurnFinish
    finishTurn(player : PlayerID): TurnRoll
}

export interface TurnFinish extends TurnBase {
    readonly stage: "Finish"
    finishTurn(player : PlayerID): TurnRoll
}


export type Stage = "Roll" | "UnownedProperty" | "OwnedProperty" | "Finish"

export class ConcreteTurn<M extends Money, B extends GenericBoard<M>>{
    // these fields are not exposed through the interfaces so do not need to be
    // private
    player : PlayerID = 1
    stage: Stage = "Roll" // tag property
    private space : Space<M>
    private dice = diceGenerator()

    constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
        private readonly ownership: Ownership<M, B>,
        private readonly transfer: Transfer<M, B>,
    ){
        this.player = this.players.getNextTurnPlayer()
        this.stage = "Roll" // tag property
        this.space = DataFactory.createGo<M>()
        // let roll1 = this.dice.next()
        // console.log("class1 " + roll1.value)
        // let roll = this.dice.next()
        // console.log("class2 " + roll.value)
    }

    start(): TurnRoll{
        return this as TurnRoll
    }

    roll(player : PlayerID): TurnUnownedProperty | TurnOwnedProperty | NotTurn {
        if(player != this.player){
            return this as NotTurn
        }
        let roll1 = this.dice.next()
        console.log("roll1 " + roll1.value)
        let roll = this.dice.next()
        console.log("roll2 " + roll.value)
        if(roll.done == false){
            if(roll.value){
                const location = this.updateLocation(roll.value[0])  
                // didn't throw a double           
                if(roll.value[1]){
                    this.space = this.board.getSpace(location)
                    const owner = this.ownership.isOwned(this.space.name)
                    // unowned
                    if(owner == null){
                        this.stage = "UnownedProperty"
                        return this as TurnUnownedProperty
                    } 
                    // owned
                    else if (owner){
                        this.stage = "OwnedProperty"
                        return this as TurnOwnedProperty
                    }
                    // undefined i.e. not an ownable property  
                    // else {
                    // }
                } else {
                    console.log("threw a double")
                }
            } else {
                throw new Error(`Unable to get dice roll value for ${roll}`)
            }
        } 
        // threw 3 doubles
        // else {
        //     const jail = this.board.getJailLocation()
        //     if(jail){
        //         this.players.setLocation(this.player, jail)
        //         this.players.setInJail(this.player, true)
        //     }

        // }
        this.stage = "UnownedProperty"
        return this as TurnUnownedProperty // TODO remove me
    }

    buyProperty(player : PlayerID): TurnFinish | NotTurn {
        if(player != this.player){
            return this as NotTurn
        }
        // cannot make a separate method isProperty as typescript cannot do type 
        // inference
        if(this.space.kind == "Deed" || this.space.kind == "Utility" || 
           this.space.kind == "Train") {
            this.transfer.buyProperty(this.player, this.space)
        }
        this.stage = "Finish"
        return this as TurnFinish
    }

    payRent(player : PlayerID): TurnFinish | NotTurn{
        if(player != this.player){
            return this as NotTurn
        }
        if(this.space.kind == "Deed" || this.space.kind == "Utility" || 
           this.space.kind == "Train") {
            this.transfer.payRent(this.player, this.space)
        }
        this.stage = "Finish"
        return this as TurnFinish
    }

    finishTurn(player : PlayerID): TurnRoll | NotTurn {
        if(player != this.player){
            return this as NotTurn
        }
        this.stage = "Roll"
        this.player =  this.players.getNextTurnPlayer()
        let roll2 = this.dice.next()
        console.log("finish " + roll2.value)
        let roll1 = this.dice.next(true)
        console.log("finish true " + roll1.value)
        return this as TurnRoll
    }

    private updateLocation(rollResult: PairDiceValue){
        let location = this.players.getLocation(this.player)
        if(location){
            location = this.board.movePiece(location, rollResult)
            this.players.setLocation(this.player, location)
        }
        return location
    }
}
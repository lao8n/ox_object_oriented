import { DataFactory } from "../../data/uk";
import { Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from "../types/player";
import { BoardLocation } from "../types/board";

export class Players<M extends Money> {
    private _players : {
        [P in PlayerID]?: Player<M>
    } = {}

    constructor(private readonly numPlayers: NumPlayers){
        for(let i = 1; i <= numPlayers; i++){
            this._players[i as PlayerID] = {
                id: i as PlayerID,
                wealth: DataFactory.createStartingMoney<M>(),
                location: {street: 1 , num: 1} as BoardLocation
            }
        }
    }

    getWealth(id: PlayerID){
        // validate
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` + 
                            `players`)
        }

        const player = this._players?.[id]
        if(player && player?.wealth){
            return player.wealth
        }
        return null
    }
    
    addMoney(id: PlayerID, amount: M){
        // validate
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` +
            `players`)
        }
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`)
        }
        // we check that wealth is not undefined, still need ! as typescript
        // cannot handle multiple layers of nesting
        if(this._players?.[id]?.wealth){
            this._players[id]!.wealth = this._players[id]!.wealth + amount as M
            return true
        }
        return false
    }

    removeMoney(id: PlayerID, amount: M){
        // validate
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` +
                            `players`)
        }
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`)
        }

        // we check that wealth is not undefined, still need ! as typescript
        // can handle multiple layers of nesting
        if(this._players?.[id]?.wealth){
            const r = BigInt(this._players[id]!.wealth - amount)
            if(r < 0){
                return false
            } 
            this._players[id]!.wealth = r as M
            return true
        }
        return false
    }
}
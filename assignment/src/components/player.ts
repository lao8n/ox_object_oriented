import { DataFactory } from "../../data/uk";
import { Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from "../types/player";

export class Players<M extends Money> {
    private _players : {
        [P in PlayerID]?: Player<M>
    } = {}

    constructor(private readonly numPlayers: NumPlayers){
        for(let i = 1; i <= numPlayers; i++){
            this._players[i as PlayerID] = {
                id: i as PlayerID,
                wealth: DataFactory.createStartingMoney<M>()
            }
        }
    }

    getWealth(id: PlayerID){
        // validate
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers}`)
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
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers}`)
        }
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`)
        }

        const player = this._players?.[id]
        if(player && player?.wealth){
            this._players[id] = {
                id: id,
                wealth: player.wealth + amount as M
            }
            return true
        }
        return false
    }

    removeMoney(id: PlayerID, amount: M){
        // validate
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers}`)
        }
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`)
        }

        const player = this._players?.[id]
        if(player && player?.wealth){
            const r = BigInt(player.wealth - amount)
            if(r < 0){
                return false
            } 
            this._players[id] = {
                id: id,
                wealth: r as M
            }
            return true
        }
        return false
    }
}
import { DataFactory } from "../../data/uk";
import { Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from "../types/player";
import { BoardLocation } from "../types/board";

export class Players<M extends Money> {
    private _players : {
        [P in PlayerID]?: Player<M>
    } = {}

    private _order : PlayerID[]
    private _orderIndex : number

    constructor(private readonly numPlayers: NumPlayers){
        this._order = new Array<PlayerID>(numPlayers)
        for(let i = 1; i <= numPlayers; i++){
            this._players[i as PlayerID] = {
                id: i as PlayerID,
                wealth: DataFactory.createStartingMoney<M>(),
                location: {street: 1 , num: 1} as BoardLocation,
                inJail: false
            }
            // default order
            this._order[i - 1] = i as PlayerID
        }
        this._orderIndex = 0
    }

    getNextTurnPlayer(): PlayerID{
        const player = this._order[this._orderIndex]
        if(!player){
            throw new Error("Unable to find current turn player")
        }
        this._orderIndex = (this._orderIndex + 1) % this.numPlayers
        return player
    }

    getCurrentTurnNotPlayer(): PlayerID {
        let orderIndex =  (this._orderIndex + 1) % this.numPlayers
        const player = this._order[orderIndex]
        if(!player){
            throw new Error("Unable to find current turn player")
        }
        return player
    }

    setOrder(order : PlayerID[]){
        if(order.length != this.numPlayers){
            throw new Error(`Order has ${order.length} players not ` +
                            `${this.numPlayers} as required`)
        }
        let orderSet = new Set<PlayerID>();
        let newOrder : PlayerID[] = []
        for(let i = 0; i < this.numPlayers; i++){
            let p = order[i]
            if(p){
                this.validatePlayerID(p)
                if(orderSet.has(p)){
                    throw new Error(`Repeated player ${p} in order`)
                }
                newOrder[i] = p
                orderSet.add(p)
            }
        }
        // only override order if it's valid
        this._order = newOrder
        this._orderIndex = 0
    }

    getLocation(id: PlayerID){
        this.validatePlayerID(id)
        const player = this._players?.[id]
        if(player && player?.location){
            return player.location
        }
        throw new Error(`Player ${id} has null location`)
    }

    setLocation(id: PlayerID, location: BoardLocation){
        this.validatePlayerID(id)
        if(this._players?.[id]?.location){
            this._players[id]!.location = location
            return true
        }
        return false
    }

    getInJail(id: PlayerID){
        this.validatePlayerID(id)
        const player = this._players?.[id]
        if(player){
            return player.inJail
        }
        return null
    }

    setInJail(id: PlayerID, inJail: boolean){
        this.validatePlayerID(id)
        if(this._players?.[id]){
            this._players[id]!.inJail = inJail
            return true
        }
        return false
    }

    getWealth(id: PlayerID){
        this.validatePlayerID(id)
        const player = this._players?.[id]
        if(player && player?.wealth){
            return player.wealth
        }
        return null
    }
    
    addMoney(id: PlayerID, amount: M){
        this.validatePlayerID(id)
        this.validateAmount(amount)

        // we check that wealth is not undefined, still need ! as typescript
        // cannot handle multiple layers of nesting
        if(this._players?.[id]?.wealth){
            this._players[id]!.wealth = this._players[id]!.wealth + amount as M
            return true
        }
        return false
    }

    removeMoney(id: PlayerID, amount: M){
        this.validatePlayerID(id)
        this.validateAmount(amount)

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

    private validatePlayerID(id: PlayerID){
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` +
                            `players`)
        }
    }

    private validateAmount(amount: M){
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`)
        }
    }
}
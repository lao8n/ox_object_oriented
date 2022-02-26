import { Board } from "../components/board";
import { Owner, Ownership } from "../components/ownership";
import { Players } from "../components/players";
import { boardnumbers, GenericBoard, MonopolyBoard, Property } from "../types/board";
import { Money } from "../types/money";
import { PlayerID } from "../types/player";
import { Colour, Deed } from "../types/space/deed";
import { Train } from "../types/space/train";
import { Utility } from "../types/space/utility";

export class Transfer<M extends Money, B extends GenericBoard<M>>{

    /**
     * 
     * @param ownership 
     * @param players 
     * 
     * Assignment notes
     * - Typescript objects are passed by reference, and only primitives are 
     *   passed by value, therefore updates to ownership and players update the 
     *   originally passed in object
     */
    constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
        private readonly ownership : Ownership<M, B>,
    ){}

    /**
     * 
     * @param player 
     * @param owner 
     * @param property 
     * 
     * Assignment notes
     * - .kind tag is used to discriminate union
     */
    payRent(player: PlayerID, property : Property<M>){
        let owner = this.ownership.getOwner(property.name)
        if(!owner){
            return false
        }
        let rent : M
        switch(property.kind){
            case "Deed": 
                rent = this.calculateDeedRent(property, owner.sameOwner)
                break
            case "Train":
                rent = this.calculateTrainRent(property, owner.sameOwner) 
                break
            case "Utility":
                rent = this.calculateUtilityRent(property, owner.sameOwner) 
                break
            default:
                // type never so can't get here
                throw new Error(`Invalid property with unknown kind`)
        }
        return this.transferMoney(player, owner.id, rent)
    }

    buyProperty(player: PlayerID, property: Property<M>){
        const wealth = this.players.getWealth(player)
        if(wealth && wealth > property.price){
            let set : "Utility" | "Train" | Colour
            switch(property.kind){
                case "Deed":
                    set = property.colourSet
                    break
                case "Train":
                    set = "Train"
                    break
                case "Utility":
                    set = "Utility"
                    break
                default: 
                    // type never so can't get here
                    throw new Error(`Invalid property with unknown kind`)
            }
            let setNames = this.board.getSet(set)
            if(setNames && this.ownership.acquire(player, property.name, setNames)){
                let result = this.players.removeMoney(player, property.price)
                // we check that player has enough money so this should
                // never fail
                if(!result){
                    throw new Error(`Despite having enough money still ` +
                                    `failed to remove money`)
                }
                return result
            }
        }
        return false
    }

    private transferMoney(from: PlayerID, to: PlayerID, amount: M){
        let result = this.players.removeMoney(from, amount)
        if(!result){
            return false
        }
        return this.players.addMoney(to, amount)
    }

    private calculateDeedRent(deed: Deed<M>, sameOwner: boolean){
        let rent = deed.rentNoHouse
        // TODO add call to housing component
        if(sameOwner){
            rent = rent * 2n as M
        }
        return rent
    }

    private calculateTrainRent(train: Train<M>, sameOwner: boolean){
        let rent = train.amount
        if(sameOwner){
            rent = rent * 2n as M
        }
        return rent
    }

    private calculateUtilityRent(utility: Utility<M>, sameOwner: boolean){
        let rent = utility.amount
        if(sameOwner){
            rent = rent * 2n as M
        }
        return rent
    }
}
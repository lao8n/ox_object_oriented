import { Board } from "./board";
import { PairDiceValue } from "./dice";
import { Owner, Ownership } from "./ownership";
import { Players } from "./players";
import { boardnumbers, GenericBoard, MonopolyBoard, Property } from "../types/board";
import { Money } from "../types/money";
import { Player, PlayerID } from "../types/player";
import { Colour, Deed } from "../types/space/deed";
import { Train } from "../types/space/train";
import { Utility } from "../types/space/utility";
import { Housing } from './housing'

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
        private readonly housing: Housing<M, B>
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
                throw new Error(`Should be handled by payUtilityRent`)
                break
            default:
                // type never so can't get here
                throw new Error(`Invalid property with unknown kind`)
        }
        return this.transferMoney(player, owner.id, rent)
    }

    payUtilityRent(player: PlayerID, utility: Utility<M>, 
        diceRoll: PairDiceValue){
        let owner = this.ownership.getOwner(utility.name)
        if(!owner){
            return false
        }
        let rent = this.calculateUtilityRent(utility, owner.sameOwner, diceRoll)
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
        switch(this.housing.getNumberHouses(deed.name)){
            case 0:
                if(sameOwner){
                    rent = rent * 2n as M
                }
                break;
            case 1: 
                rent = deed.rentOneHouse
                break;
            case 2:
                rent = deed.rentTwoHouse
                break;
            case 3: 
                rent = deed.rentThreeHouse
                break;
            case 4: 
                rent = deed.rentFourHouse
                break;
            case 5:
                rent = deed.rentHotel
                break;
            default:
                throw new Error(`Undefined number of houses for ${deed.name}`)
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

    private calculateUtilityRent(utility: Utility<M>, sameOwner: boolean, 
        diceRoll: PairDiceValue){
        if(sameOwner){
            return BigInt(diceRoll) * 10n as M
        } else {
            return BigInt(diceRoll) * 4n as M
        }
    }
}
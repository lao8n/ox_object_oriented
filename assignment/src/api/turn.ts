// data imports
import { DataFactory } from "../../data/uk";
// services imports
import { Board } from "../services/board";
import { diceGenerator } from "../services/dice";
import { Transfer } from "../services/transfer";
import { Housing } from "../services/housing";
import { Ownership } from "../services/ownership";
import { Players } from "../services/players";
// types imports
import { BoardLocation, GenericBoard, Space } from "../types/board";
import { Money } from "../types/money";
import { PlayerID } from "../types/player";
import { PairDiceValue } from "../types/dice";

/**
 * Underlying interface that all turns extend. 
 * {@link TurnBase.stage} is used to discriminate between the union of types
 * {@link Stage}. {@link TurnBase.player} is used to determine whose turn it is
 * and whether a function call should be ignored or not. This ensures that 
 * players cannot call functions when it isn't their turn yet.
 * 
 * Assignment notes
 * - Typescript uses the literal type tag {@link TurnBase.stage} to infer the 
 *   type of turn for the finite state machine state pattern
 * - Readonly objects do not expose objects that themselves can be illegally 
 *   modified
 */
export interface TurnBase {
    readonly player: PlayerID
    readonly stage: Stage
}
/**
 * The start of every turn begins with a {@link roll} of the dice. The result 
 * will then depend upon the value thrown, where most notably either the player 
 * lands on an unowned property leading to the {@link TurnUnownedProperty} 
 * state in which they can {@link buyProperty} or they land on an owned 
 * property in which they must {@link payRent}. Other cases such as landing on 
 * other types of spaces and special cases like rolling doubles and landing in 
 * jail are also handled.
 * {@link getDiceRoll} exposes the dice rolled so that a UI could show the
 * values
 * 
 * Assignment notes 
 * - {@link PlayerID} provides type safety to prevent the method being called 
 *   with an illegal parameter
 */
export interface TurnRoll extends TurnBase {
    readonly stage: "Roll"
    roll(player : PlayerID): TurnUnownedProperty | TurnOwnedProperty | 
        TurnFinish | TurnRoll
    getDiceRoll(): PairDiceValue | undefined
}
/**
 * A player can get into jail either by throwing a double or landing on the 
 * GoToJail space. This interface manages {@link rollJail} roll of the dice
 * which can either result in escaping jail and one of the alternative 
 * {@link TurnOwnedProperty}, {@link TurnUnownedProperty} {@link TurnFinish} 
 * states or staying in jail 
 */
export interface TurnInJail extends TurnBase {
    readonly stage: "Jail"
    rollJail(player: PlayerID): TurnUnownedProperty | TurnOwnedProperty | 
        TurnInJail | TurnFinish
    getDiceRoll(): PairDiceValue | undefined
}
/**
 * After rolling the dice with {@link Turn.roll} and landing on an unowned
 * property the user has the choice to {@link buyProperty}. Before they do this
 * they can also try to buy houses on one of their existing sets with 
 * {@link buyHousing}. Or they can choose to not buy anything and 
 * {@link finishTurn}.
 * 
 * Assignment notes 
 * - We enforce strict ordering of the FSM states as for example 
 *   {@link buyHousing} cannot lead to {@link TurnFinish}. The player has to 
 *   choose whether they {@link buyProperty} or {@link finishTurn} directly. 
 *   They also cannot incorrectly {@link payRent} because that method is 
 *   not exposed by this interface as for an unowned property there is no
 *   rent to pay
 */
export interface TurnUnownedProperty extends TurnBase {
    readonly stage: "UnownedProperty"
    buyProperty(player : PlayerID): TurnFinish | TurnUnownedProperty
    buyHousing(player: PlayerID, name: string): TurnUnownedProperty
    finishTurn(player : PlayerID): TurnRoll | TurnUnownedProperty
}
/**
 * After rolling the dice with {@link Turn.roll} and landing on an owned
 * property the player has to {@link payRent} and unlike 
 * {@link TurnUnownedProperty} they cannot choose to {@link finishTurn} without
 * doing so.
 */
export interface TurnOwnedProperty extends TurnBase{
    readonly stage: "OwnedProperty"
    payRent(player : PlayerID): TurnFinish | TurnOwnedProperty
    buyHousing(player: PlayerID, name: string): TurnOwnedProperty
}
/**
 * Final step of turn before allowing the next player to start the 
 * {@link TurnRoll} state.
 */
export interface TurnFinish extends TurnBase {
    readonly stage: "Finish"
    finishTurn(player : PlayerID): TurnRoll | TurnInJail | TurnFinish
}

/**
 * Union of {@link ConcreteTurn} FSM stages
 */
export type Stage = "Roll" | "Jail" | "UnownedProperty" | "OwnedProperty" | 
    "Finish"

/**
 * Primary implementation logic for Monopoly game. This is never directly 
 * exposed, where instead players access via the {@link Turn} interfaces
 */
export class ConcreteTurn<M extends Money, B extends GenericBoard<M>>{
    /**
     * Assignment notes
     * - These fields are either note exposed at all through the {@link Turn}
     *   interfaces, or if they are exposed as with {@link player} & 
     *   {@link stage} they are readonly
     * - {@link stage} is used as a tagged union type to discriminate between
     *   which interface is being used.
     */
    player : PlayerID = 1;
    stage: Stage = "Roll"; 
    space : Space<M>;
    dice = diceGenerator();
    lastDiceRoll: PairDiceValue | undefined = undefined;

    /**
     * @param board {@link Board} service to {@link movePiece}s and 
     * {@link getSpace}
     * @param players {@link Players} service to manage player state such as 
     * {@link BoardLocation} and wealth
     * @param ownership {@link Ownership} service to manage who owns which 
     * properties
     * @param housing {@link Housing} service to manage which properties have
     * houses
     * @param transfer {@link Transfer} service to transfer money and 
     * properties between players and the bank.
     * 
     * Assignment notes
     * - We cannot have the constructor be static as we want to have generics
     *   in the class with {@link Money} and {@link GenericBoard}
     * - Although this constructor is public it isn't exposed in the api, and 
     *   instead is instantiated inside {@link GameServer} and the first
     *   {@link TurnRoll} interface exposed through {@link start}
     * - We use composition over inheritance for the services
     */
    constructor(
        private readonly board: Board<M, B>,
        private readonly players : Players<M>,
        private readonly ownership: Ownership<M, B>,
        private readonly housing: Housing<M, B>,
        private readonly transfer: Transfer<M, B>,
    ){
        this.player = this.players.getCurrentTurnPlayer();
        this.stage = "Roll";
        this.space = DataFactory.createGo<M>();
    }

    /**
     * @returns First stage of {@link Turn} FSM interfaces
     */
    start(): TurnRoll{
        return this as TurnRoll;
    }

    /**
     * @param player The player who wishes to roll. If it's not that player's 
     * turn the FSM is not updated staying in {@link TurnRoll} stage
     * @returns The result of rolling the dice, either landing on a property 
     * which is owned exposing {@link TurnUnownedProperty} interface or 
     * which is not owned exposing {@link TurnOwnedProperty} interface or 
     * for locations which are not properties like FreeParking simply finish
     * If multiple doubles are thrown the {@link players} state is updated to 
     * {@link inJail} flag is updated so next turn the player will be in 
     * {@link TurnInJail}
     * @throws an {@link Error} if the IteratorYieldResult.value is undefined
     * 
     * Assignment notes
     * - We use {@link dice} generator to create random dice throws where the
     *   generator ends if 3 doubles are thrown. If this is the case we need
     *   to create a new {@link diceGenerator} 
     * - We have multiple checks for whether values are undefined e.g. 
     *   {@link roll.value} so that TypeScript knows that they are defined.
     * - Uses the fluent interface pattern to return this for method chaining
     * - Use destructuring to access {@link roll.value} elements
     * - Generator returns an {@link IteratorResult} which is then determined
     *   to be either an {@link IteratorYieldResult} or an 
     *   {@link IteratorReturnResult}
     */
    roll(player : PlayerID): TurnUnownedProperty | TurnOwnedProperty | 
        TurnFinish | TurnRoll {
        if(player != this.player){
            return this as TurnRoll;
        }
        const roll = this.dice.next();
        if(roll.done == false){
            if(roll.value){
                // destructuring
                const [diceValue, threwDouble] = roll.value;
                this.lastDiceRoll = diceValue;
                const location = this.updateLocation(diceValue);  
                // didn't throw a double           
                if(threwDouble){
                    return this.updateStage(location);
                // threw a double
                } else {
                    return this as TurnRoll;
                }
            } else {
                throw new Error(`Unable to get dice roll value for ${roll}`);
            }
        // threw 3 doubles
        } else {
            this.goToJail();
            this.dice = diceGenerator();
            this.stage = "Finish";
            return this as TurnFinish;
        }
    }


    /**
     * @param player The player who wishes to roll 
     * @returns Either rolls a double and escapes jail landing on a property
     * that could be unowned or owned. Or fail to roll a double and stay in 
     * jail as {@link players.setInJail} is not updated to false
     * @throws an {@link Error} if the IteratorYieldResult.value is undefined
     *      
     * Assignment notes
     * - Uses the fluent interface pattern to return this for method chaining
     */
    rollJail(player: PlayerID): TurnUnownedProperty | TurnOwnedProperty | 
        TurnInJail | TurnFinish {
        if(player != this.player){
            return this as TurnInJail;
        }
        const roll = this.dice.next();
        if(roll.done == false){
            if(roll.value){
                this.lastDiceRoll = roll.value[0];
                // didn't throw a double
                if(roll.value[1]){
                    this.stage = "Finish";
                    return this as TurnFinish;
                // threw a double
                } else {
                    this.players.setInJail(this.player, false);
                    const location = this.updateLocation(roll.value[0]);
                    return this.updateStage(location);
                }
            } else {
                throw new Error(`Unable to get dice roll value for ${roll}`);
            }
        }
        this.stage = "Finish";
        return this as TurnFinish;
    }

    /**
     * @returns Last dice roll for UI to expose game information
     */
    getDiceRoll(): PairDiceValue | undefined {
        return this.lastDiceRoll;
    }

    /**
     * @param player Player wishing to buy housing
     * @param name Name of deed which the player wants to buy housing for. It 
     * does not need to be the location they are currently at
     * @returns Returns either {@link TurnOwnedProperty} or
     * {@link TurnUnownedProperty} depending upon what state they were in 
     * originally. Doesn't update it.
     * 
     * Assignment notes
     * - Uses the fluent interface pattern to return this for method chaining
     * - Use optional chaining in case houseSpace is undefined
     */
    buyHousing(player: PlayerID, name: string): TurnOwnedProperty | 
        TurnUnownedProperty {
        let currentStage : TurnOwnedProperty | TurnUnownedProperty;
        if(this.stage == "OwnedProperty"){
            currentStage = this as TurnOwnedProperty;
        } else {
            currentStage = this as TurnUnownedProperty;
        }
        if(player != this.player){
            return currentStage;
        }
        const houseLocation = this.board.getLocation(name);
        if(!houseLocation){
            return currentStage;
        }
        const houseSpace = this.board.getSpace(houseLocation);
        if(houseSpace?.kind == "Deed"){
            const setNames = this.board.getSet(houseSpace.colourSet);
            if(setNames){
                this.housing.buyHouseOrHotel(
                    player, 
                    houseSpace.name, 
                    houseSpace.colourSet, 
                    setNames,
                    houseSpace.houseCost,
                );
            }
        }
        return currentStage;
    }

    /**
     * @param player Player wishing to buy property
     * @returns Either {@link TurnFinish} if purchase was successful or the 
     * same state {@link TurnUnownedProperty} if unsuccessful
     */
    buyProperty(player : PlayerID): TurnFinish | TurnUnownedProperty {
        if(player != this.player){
            return this as TurnUnownedProperty;
        }
        if(this.space.kind == "Deed" || this.space.kind == "Utility" || 
           this.space.kind == "Train") {
            this.transfer.buyProperty(this.player, this.space);
        }
        this.stage = "Finish";
        return this as TurnFinish;
    }

    /**
     * @param player Player who wishes to pay the rent they owe
     * @returns Either {@link TurnFinish} if rent payment was successful or
     * otherwise return the same state. Utility rent payments require dice roll
     * information unlike train and deed rent
     */
    payRent(player : PlayerID): TurnFinish | TurnOwnedProperty {
        if(player != this.player){
            return this as TurnOwnedProperty;
        }
        let success  = false;
        if(this.space.kind == "Deed" || this.space.kind == "Train") {
            success = this.transfer.payRent(this.player, this.space);
        } else if (this.space.kind == "Utility"){
            if(this.lastDiceRoll){
                success = this.transfer.payUtilityRent(this.player, this.space, 
                    this.lastDiceRoll);
            }
        }
        if(!success){
            return this as TurnOwnedProperty;
        }
        this.stage = "Finish";
        return this as TurnFinish;
    }

    /**
     * @param player Player who wishes to finish their turn
     * @returns Next player's {@link TurnRoll} or {@link TurnInJail}. The next
     * player's state information is not preserved in the FSM between players
     * turns so is loaded from {@link this.player}. This includes whether the 
     * player is in jail affecting which FSM state is loaded.
     */
    finishTurn(player : PlayerID): TurnRoll | TurnInJail | TurnFinish {
        if(player != this.player){
            return this as TurnFinish;
        }
        this.dice.next(true);
        this.player = this.players.getNextTurnPlayer();
        if(this.players.getInJail(this.player)){
            this.stage = "Jail";
            return this as TurnInJail;
        }
        this.stage = "Roll";
        return this as TurnRoll;
    }

    /**
     * This method not only updates the user's position but also adds 200
     * if the user passes Go
     * 
     * @param rollResult Pair of dice value 
     * @returns Updated {@link BoardLocation} based upon the dice roll
     * 
     * Assignment notes
     * - We use optional chaining in case {@link .getSpace} is undefined on
     *   board
     * - Delegate player location information to {@link this.players} and 
     *   moving pieces across board to {@link this.board}
     */
    private updateLocation(rollResult: PairDiceValue){
        let location = this.players.getLocation(this.player);
        if(location){
            const newLocation = this.board.movePiece(location, rollResult);
            if(newLocation.street < location.street){
                this.players.addMoney(this.player, 200n as M);
            }
            this.players.setLocation(this.player, newLocation);
            location = newLocation;
        }
        if(this.board.getSpace(location)?.kind == "Go To Jail"){
            const jail = this.goToJail();
            if(jail){
                return jail;
            }
        }
        return location;
    }

    /**
     * @param location Location that has been landed on
     * @returns Which turn interface we should transition to based upon 
     * the {@link stage} tag literal
     * 
     * Assignment notes
     * - Delegate who owns which properties to {@link this.ownership}
     */
    private updateStage(location: BoardLocation){
        const space = this.board.getSpace(location);
        if(space){
            this.space = space;
        }
        const owner = this.ownership.getOwner(this.space.name);
        // unowned
        if(owner == null){
            this.stage = "UnownedProperty";
            return this as TurnUnownedProperty;
        } 
        // owned
        else if (owner){
            this.stage = "OwnedProperty";
            return this as TurnOwnedProperty;
        }
        else {
            if(this.space.kind == "Card" || this.space.kind == "Tax"){
                this.players.removeMoney(this.player, 100n as M);
            }
            this.stage = "Finish";
            return this as TurnFinish;
        }
    }

    /**
     * @returns Location of jail, setting the player there. As board may not 
     * have a jail for example with the "Test" {@link BoardEditions} default to 
     * first location on the board instead.
     */
    private goToJail(){
        const jail = this.board.getLocation("Jail");
        if(jail){
            this.players.setLocation(this.player, jail);
            this.players.setInJail(this.player, true);
        // if jail doesn't exist go to first location on board
        } else {
            this.players.setLocation(this.player, {street: 1, num: 1});
        } 
        return jail;
    }
}
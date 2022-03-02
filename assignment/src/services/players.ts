// data imports
import { DataFactory } from "../../data/uk";
// types imports
import { Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from "../types/player";
import { BoardLocation } from "../types/board";

/**
 * Players class to manage the players in the game, and player state across
 * turns such as their {@link wealth}, their location {@link BoardLocation}, 
 * and whether they are {@link inJail}
 * 
 * In addition to methods to update this state information there are many 
 * methods to expose game state 
 * 
 * Assignment notes
 * - 
 */
export class Players<M extends Money> {

    /**
     * Map of {@link PlayerID} to {@link Player} which stores the core
     * turn-to-turn game information about a player
     */
    private _players : Map<PlayerID, Player<M>> = new Map<PlayerID, 
        Player<M>>();

    /**
     * The order that {@link PlayerID}s play in
     */
    private _order : PlayerID[];

    /**
     * An index to note whose turn it is 
     */
    private _orderIndex : number;

    /**
     * @param numPlayers Constructor to take the number of players and 
     * set them up with starting money and location. No validation is required
     * as {@link NumPlayers} is typed to be between 2 and 8.
     */
    constructor(readonly numPlayers: NumPlayers){
        this._order = new Array<PlayerID>(numPlayers);
        for(let i = 1; i <= numPlayers; i++){
            this._players.set(i as PlayerID, {
                id: i as PlayerID,
                wealth: DataFactory.createStartingMoney<M>(),
                location: {street: 1 , num: 1} as BoardLocation,
                inJail: false
            });
            // default order is 1-8
            this._order[i - 1] = i as PlayerID;
        }
        this._orderIndex = 0;
    }

    /**
     * @returns Whose turn it is
     * @throws Error if player is not available 
     */
    getCurrentTurnPlayer(): PlayerID {
        const player = this._order[this._orderIndex];
        if(!player){
            throw new Error("Unable to find current turn player");
        }    
        return player;
    }

    /**
     * @returns Changes the turn to the next player and gets that players id
     */
    getNextTurnPlayer(): PlayerID{
        this._orderIndex = (this._orderIndex + 1) % this.numPlayers;
        return this.getCurrentTurnPlayer();
    }

    /**
     * @returns a random player who is not the current turn player - useful for
     * testing
     * @throws Error if unable to get current turn player
     */
    getCurrentTurnNotPlayer(): PlayerID {
        const orderIndex =  (this._orderIndex + 1) % this.numPlayers;
        const player = this._order[orderIndex];
        if(!player){
            throw new Error("Unable to find current turn player");
        }
        return player;
    }

    /**
     * @returns The order that players are playing in
     */
    getOrder(): PlayerID[]{
        return this._order;
    }

    /**
     * @param order Set the order that players are playing in. Currently the 
     * default order is used but potentially the order could be set by 
     * who throws the highest dice roll etc.
     * @throws Error if the order of players doesn't match the expected
     * {@link NumPlayers}
     */
    setOrder(order : PlayerID[]){
        if(order.length != this.numPlayers){
            throw new Error(`Order has ${order.length} players not ` +
                            `${this.numPlayers} as required`);
        }
        const orderSet = new Set<PlayerID>();
        const newOrder : PlayerID[] = [];
        for(let i = 0; i < this.numPlayers; i++){
            const p = order[i];
            if(p){
                this.validatePlayerID(p);
                if(orderSet.has(p)){
                    throw new Error(`Repeated player ${p} in order`);
                }
                newOrder[i] = p;
                orderSet.add(p);
            }
        }
        // only override order if it's valid
        this._order = newOrder;
        this._orderIndex = 0;
    }
    
    /**
     * @param id Get location of a given player
     * @returns A players {@link BoardLocation}
     * @throws An error if the player does not have a location or the player
     * id isn't valid
     */
    getLocation(id: PlayerID){
        this.validatePlayerID(id);
        const player = this._players.get(id);
        if(player && player?.location){
            return player.location;
        }
        throw new Error(`Player ${id} has null location`);
    }

    /**
     * @param id Player to set location for
     * @param location Location to set them to
     * @returns Boolean depending upon whether the function was a success or
     * not
     * @throws Error if the player id isn't valid
     * 
     * Assignment notes 
     * - Typescript doesn't keep type information for specific array indices
     *   so need to define a const which it can then infer from
     */
    setLocation(id: PlayerID, location: BoardLocation){
        this.validatePlayerID(id);
        // typescript doesn't keep type information about values at specific
        // array indices
        const currentPlayer = this._players.get(id);
        if(currentPlayer){
            currentPlayer.location = location;
            this._players.set(id, currentPlayer);
            return true;
        }        
        return false;
    }

    /**
     * @param id PlayerId to check
     * @returns Boolean flag for whether a player is in jail or not
     * @throws Error if the {@link PlayerID} is invalid or doesn't exist 
     */
    getInJail(id: PlayerID){
        this.validatePlayerID(id);
        const player = this._players.get(id);
        if(player){
            return player.inJail;
        }
        throw new Error(`Player ${id} doesn't exist`);
    }

    /**
     * @param id Player to be put in or taken out of jail
     * @param inJail Boolean flag for whether a player should be set in jail 
     * or not, true for former, false for latter
     * @returns Boolean flag indicating whether the function was a success
     */
    setInJail(id: PlayerID, inJail: boolean){
        this.validatePlayerID(id);
        // we check that its defined before asserting it is
        const currentPlayer = this._players.get(id);
        if(currentPlayer){
            currentPlayer.inJail = inJail;
            this._players.set(id, currentPlayer);
            return true;
        } 
        return false;
    }

    /**
     * @param id Player to get wealth of
     * @returns Player's wealth as {@link Money}
     */
    getWealth(id: PlayerID){
        this.validatePlayerID(id);
        const currentPlayer = this._players.get(id);
        if(currentPlayer){
            return currentPlayer.wealth;
        }
        return null;
    }
    
    /**
     * @param id Player id to add money for
     * @param amount The amount of {@link Money} to add to that player
     * @returns Boolean indicating whether the function was a success or not
     * @throws Error if invalid player or amount
     */
    addMoney(id: PlayerID, amount: M){
        this.validatePlayerID(id);
        this.validateAmount(amount);
        const currentPlayer = this._players.get(id);
        if(currentPlayer){
            currentPlayer.wealth = currentPlayer.wealth + amount as M;
            this._players.set(id, currentPlayer);
            return true;
        } 
        return false;
    }

    /**
     * @param id Player id to take money from
     * @param amount The amount of {@link Money} to remove from that player
     * @returns Boolean indicating whether the function was a success or not. 
     * Returns false if the player has insufficient funds
     * @throws Error if invalid player or amount
     */
    removeMoney(id: PlayerID, amount: M){
        this.validatePlayerID(id);
        this.validateAmount(amount);
        const currentPlayer = this._players.get(id);
        if(currentPlayer){
            const r = BigInt(currentPlayer.wealth - amount);
            if(r < 0){
                return false;
            } 
            currentPlayer.wealth = r as M;
            this._players.set(id, currentPlayer);
            return true;
        }
        return false;
    }

    /**
     * @param id Helper function to validate {@link PlayerID} 
     */
    private validatePlayerID(id: PlayerID){
        if(id > this.numPlayers){
            throw new Error(`Id ${id} is invalid as only ${this.numPlayers} ` +
                            `players`);
        }
    }

    /**
     * @param amount Helper function to validate whether money is positive 
     * amount or not
     */
    private validateAmount(amount: M){
        if(amount <= 0){
            throw new Error(`Expected positive amount of money not ${amount}`);
        }
    }
}
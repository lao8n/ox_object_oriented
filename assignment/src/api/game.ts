// api imports
import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, 
    TurnUnownedProperty, TurnInJail } from './turn';
// data imports
import { DataFactory } from '../../data/uk';
// services imports
import { Board } from '../services/board';
import { Ownership } from '../services/ownership';
import { Players } from "../services/players";
import { Transfer } from '../services/transfer';
import { Housing } from '../../src/services/housing';
// types imports
import { GenericBoard, MonopolyBoard, BoardEditions, BoardLocation, Space } 
    from '../types/board';
import { GBP, Money } from "../types/money";
import { Owner } from "../types/ownership";
import { NumPlayers, PlayerID } from '../types/player';

export type MonopolyEdition = "British" | "Test"

/**
 * Game interface exposing the turn interfaces through 
 * {@link.ConcreteGame.turn} by which all turn actions are managed by a finite
 * state machine (FSM)
 * It indirectly exposes information from underlying components about game 
 * state without exposing those components
 */
export interface Game {
    /**
     * Unique id for game instance
     */
    readonly id: number
    
    /**
     * Interfaces by which {@link ConcreteTurn} can be interacted with
     * 
     * Assignment notes 
     * - {@link ConcreteTurn} is never exposed directly, but having a single
     *   underlying instance reduces the need for additional coordination or
     *   data sharing across turns
     * - Readonly objects do not expose objects that themselves can be 
     *   illegally modified
     */
    readonly turn : TurnRoll | TurnFinish | TurnInJail | TurnOwnedProperty | 
        TurnUnownedProperty

    /**
     * @param location Location on Board
     * @returns Space at a given location
     */
    getSpace(location: BoardLocation): Space<Money> | undefined

    /**
     * @returns Monopoly board size, not necessarily 40
     */
    getBoardSize(): number

    /**
     * @returns Number of players in game
     */
    getNumberPlayers(): number

    /**
     * @returns Which players turn it is
     */
    getCurrentTurnPlayer(): PlayerID

    /**
     * @returns The order players are playing in 
     */
    getPlayersInOrder(): PlayerID[]

    /**
     * @param id Player's id
     * @returns Player's board location
     */
    getPlayerLocation(id: PlayerID): BoardLocation

    /**
     * @param id Player's id
     * @returns Boolean flag of whether they are in jail or not
     */
    getPlayerInJail(id: PlayerID): boolean

    /**
     * @param id Player's id
     * @returns Get player's wealth in currency of the game
     */
    getPlayerWealth(id: PlayerID): Money | null

    /**
     * @param name Name of space on monopoly board
     * @returns Number of houses on that location. 5 houses means their is a 
     * hotel there
     */
    getNumberHouses(name: string): number | undefined

    /**
     * @returns The Bank only has 32 houses, this returns the number of houses
     * still left to buy
     */
    getBankNumberRemainingHouses(): number

    /**
     * @returns The Bank only has 6 hotels, this returns the number of hotels 
     * still left to buy
     */
    getBankNumberRemainingHotels(): number

    /**
     * @param name Name of space on monopoly board
     * @returns PlayerID of the owner of that space if there is one, which 
     * and a boolean flag as to whether all properties in that set have the 
     * same owner
     */
    getOwner(name: string): Owner | null | undefined
}

/**
 * {@link ConcreteGame} implementing Game methods. We keep it private and do 
 * not export to keep the constructor private and force game instances to be 
 * created via the {@link GameServer}
 * 
 * Assignment notes
 * - It uses structural typing to extend the {@link Game} interface where if a 
 *   new method was created the method chaining would complain
 */
class ConcreteGame {
    /**
     * Interfaces by which {@link ConcreteTurn} can be interacted with
     * 
     * Assignment notes 
     * - {@link ConcreteTurn} is never exposed directly, but having a single
     *   underlying instance reduces the need for additional coordination or
     *   data sharing across turns
     * - Readonly objects do not expose objects that themselves can be 
     *   illegally modified
     */
    readonly turn : TurnRoll | TurnFinish | TurnInJail | TurnOwnedProperty |
        TurnUnownedProperty;

    constructor(
        readonly id: number,
        private board: Board<Money, BoardEditions<Money>>,
        private players: Players<Money>,
        private ownership: Ownership<Money, BoardEditions<Money>>,
        private housing: Housing<Money, BoardEditions<Money>>,
        private concreteTurn: ConcreteTurn<Money, BoardEditions<Money>>
    ){
        this.turn = this.concreteTurn.start();
    }

    /**
     * @param location Location on Board
     * @returns Space at a given location
     */
    getSpace(location: BoardLocation): Space<Money> | undefined { 
        return this.board.getSpace(location);
    }

    /**
     * @returns Monopoly board size, not necessarily 40
     */
    getBoardSize(): number {
        return this.board.size;
    }

    /**
     * @returns Number of players in game
     */
    getNumberPlayers(): number {
        return this.players.numPlayers;
    }

    /**
     * @returns Which players turn it is
     */
    getCurrentTurnPlayer(): PlayerID {
        return this.players.getCurrentTurnPlayer();
    }

    /**
     * @returns The order players are playing in 
     */
    getPlayersInOrder(): PlayerID[] {
        return this.players.getOrder();
    }

    /**
     * @param id Player's id
     * @returns Player's board location
     */
    getPlayerLocation(id: PlayerID): BoardLocation {
        return this.players.getLocation(id);
    }

    /**
     * @param id Player's id
     * @returns Boolean flag of whether they are in jail or not
     */
    getPlayerInJail(id: PlayerID): boolean {
        return this.players.getInJail(id);
    }

    /**
     * @param id Player's id
     * @returns Get player's wealth in currency of the game
     */
    getPlayerWealth(id: PlayerID): Money | null {
        return this.players.getWealth(id);
    }

    /**
     * @param name Name of space on monopoly board
     * @returns Number of houses on that location. 5 houses means their is a 
     * hotel there
     */
    getNumberHouses(name: string): number | undefined {
        return this.housing.getNumberHouses(name);
    }

    /**
     * @returns The Bank only has 32 houses, this returns the number of houses
     * still left to buy
     */
    getBankNumberRemainingHouses(): number {
        return this.housing.getBankRemainingHouses();
    }

    /**
     * @returns The Bank only has 6 hotels, this returns the number of hotels 
     * still left to buy
     */
    getBankNumberRemainingHotels(): number {
        return this.housing.getBankRemainingHotels();
    }

    /**
     * @param name Name of space on monopoly board
     * @returns PlayerID of the owner of that space if there is one, which 
     * and a boolean flag as to whether all properties in that set have the 
     * same owner
     */
    getOwner(name: string): Owner | null | undefined {
        return this.ownership.getOwner(name);
    }
}

/**
 * GameServer is the primary access class which 
 * 
 * Assignment notes
 * - Facade pattern for entry-point to all {@link ConcreteGame} instances
 */
export class GameServer {

    /**
     * Private mutable array of games for the game server
     * 
     * Game is directly exposed though only {@link ConcreteGame.turn} & 
     * {@link ConcreteGame.id} are exposed fields.
     */
    private games: ConcreteGame[] = [];

    /**
     * @param edition Whether the user wants to play the 'British' or 'Test' 
     * versions of the game. In future could add other editions such as US etc.
     * @param numberPlayers The number of players in the game. Should be 
     * between 2 and 8
     * @returns A game instance with the required properties, which can be 
     * played using the {@link ConcreteGame.turn} field and queried for game 
     * state using the {@link ConcreteGame} methods. We allow multiple games to 
     * occur at once
     * 
     * Assignment notes
     * - Factory pattern to assign unique game id {@link ConcreteGame.id} 
     */
    startGame(edition : MonopolyEdition, numberPlayers: NumPlayers): Game {
        const id = this.games.length;
        // housing
        let money : Money;
        if(edition == "British" || edition == "Test"){
            money = 0n as GBP;
        }
        let m : GenericBoard<typeof money> | MonopolyBoard<typeof money>;
        switch(edition) {
            case "British": {
                m = DataFactory.createMonopolyBoard<typeof money>();
                break;
            } 
            case "Test": {
                m = DataFactory.createTestBoard3<typeof money>();
                break;
            }
        }
        const b = new Board<typeof money, typeof m>(m);
        const p = new Players<typeof money>(numberPlayers);
        const o = new Ownership<typeof money, typeof m>(m);
        const h = new Housing<typeof money, typeof m>(m, p, o);
        const t = new Transfer<typeof money, typeof m>(b, p, o, h);
        // api
        const c = new ConcreteTurn<typeof money, typeof m>(b, p, o, h, t);
        const g = new ConcreteGame(id, b, p, o, h, c);
        this.games.push(g);
        return g as Game;
    }

    /**
     * @param id Game id
     * @returns Game instance if available
     */
    getGame(id: number): Game | undefined {
        return this.games[id] as Game
    }
}
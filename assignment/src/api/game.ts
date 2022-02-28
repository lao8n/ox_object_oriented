import { DataFactory } from '../../data/uk';
import { Board } from '../services/board';
import { Owner, Ownership } from '../services/ownership';
import { Players } from "../services/players";
import { Transfer } from '../services/transfer';
import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, TurnUnownedProperty, TurnInJail } from './turn';
import { GenericBoard, MonopolyBoard, BoardEditions, BoardLocation, Space } from '../types/board';
import { GBP, Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from '../types/player';
import { Housing, NumHouses } from '../../src/services/housing';

type MonopolyEdition = "British" | "Test"

/**
 * Game class directly exposes the turn interfaces through which all turn 
 * actions are managed
 * It indirectly exposes information from underlying components about game state
 * without exposing those components.
 * 
 * Assignment notes
 * - 
 */
class Game {
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

    getSpace(location: BoardLocation): Space<Money> | undefined { 
        return this.board.getSpace(location);
    }

    getBoardSize(): number {
        return this.board.size;
    }

    getNumberPlayers(): number {
        return this.players.numPlayers;
    }

    getCurrentTurnPlayer(): PlayerID {
        return this.players.getCurrentTurnPlayer();
    }

    getPlayersInOrder(): PlayerID[] {
        return this.players.getOrder();
    }

    getPlayerLocation(id: PlayerID): BoardLocation {
        return this.players.getLocation(id);
    }

    getPlayerInJail(id: PlayerID): boolean {
        return this.players.getInJail(id);
    }

    getPlayerWealth(id: PlayerID): Money | null {
        return this.players.getWealth(id);
    }

    getNumberHouses(name: string): NumHouses | undefined {
        return this.housing.getNumberHouses(name);
    }

    getBankNumberRemainingHouses(): number {
        return this.housing.getBankRemainingHouses();
    }

    getBankNumberRemainingHotels(): number {
        return this.housing.getBankRemainingHotels();
    }

    getOwner(name: string): Owner | null | undefined {
        return this.ownership.getOwner(name);
    }
}

/**
 * Assignment notes
 * - Facade pattern
 */
export class GameServer {

    private games: Game[] = [];

    constructor(){

    }

    /**
     * 
     * @param edition 
     * @param money 
     * @param numberPlayers 
     * @returns 
     * 
     * Assignment notes
     * - Factory pattern
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
        const g = new Game(id, b, p, o, h, c);
        this.games.push(g);
        return g;
    }

    getGame(id: number): Game | undefined {
        return this.games[id];
    }
}
import { DataFactory } from '../../data/uk';
import { Board } from '../components/board';
import { Owner, Ownership } from '../components/ownership';
import { Players } from "../components/players";
import { Transfer } from '../services/transfer';
import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, TurnUnownedProperty, TurnInJail } from '../services/turn';
import { GenericBoard, MonopolyBoard, BoardEditions, BoardLocation } from '../types/board';
import { GBP, Money } from "../types/money";
import { NumPlayers, Player, PlayerID } from '../types/player';

type MonopolyEdition = "British" | "Test"

class Game {
    readonly turn : TurnRoll | TurnFinish | TurnInJail | TurnOwnedProperty |
        TurnUnownedProperty

    constructor(
        readonly id: number,
        private players: Players<Money>,
        private concreteTurn: ConcreteTurn<Money, BoardEditions<Money>>
    ){
        this.turn = this.concreteTurn.start()
    }

    getCurrentTurnPlayer(): PlayerID {
        return this.players.getCurrentTurnPlayer()
    }

    getPlayersInOrder(): PlayerID[] {
        return this.players.getOrder()
    }

    getPlayerLocation(id: PlayerID): BoardLocation {
        return this.players.getLocation(id)
    }

    getPlayerInJail(id: PlayerID): boolean {
        return this.players.getInJail(id)
    }

    getPlayerWealth(id: PlayerID): Money | null {
        return this.players.getWealth(id)
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
        const id = this.games.length
        // components
        let money : Money
        if(edition == "British" || edition == "Test"){
            money = 0n as GBP
        }
        let m : GenericBoard<typeof money> | MonopolyBoard<typeof money>
        switch(edition) {
            case "British": {
                m = DataFactory.createMonopolyBoard<typeof money>()
                break;
            } 
            case "Test": {
                m = DataFactory.createTestBoard3<typeof money>()
                break;
            }
        }
        const b = new Board<typeof money, typeof m>(m)
        const p = new Players<typeof money>(numberPlayers)
        const o = new Ownership<typeof money, typeof m>(m)
        // services
        const t = new Transfer<typeof money, typeof m>(b, p, o)
        const c = new ConcreteTurn<typeof money, typeof m>(b, p, o, t)
        const g = new Game(id, p, c)
        this.games.push(g)
        return g
    }

    getGame(id: number): Game | undefined {
        return this.games[id]
    }
}
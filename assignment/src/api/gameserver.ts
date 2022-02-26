import { DataFactory } from '../../data/uk';
import { Board } from '../components/board';
import { Owner, Ownership } from '../components/ownership';
import { Players } from "../components/players";
import { Transfer } from '../services/transfer';
import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, TurnUnownedProperty, TurnInJail } from '../services/turn';
import { GenericBoard, MonopolyBoard, BoardEditions } from '../types/board';
import { GBP, Money } from "../types/money";
import { NumPlayers } from '../types/player';
import { Game } from './game'

type MonopolyEdition = "British" | "Test"

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
        const g = new Game(id, c)
        this.games.push(g)
        return g
    }

    getGame(id: number): Game | undefined {
        return this.games[id]
    }
}
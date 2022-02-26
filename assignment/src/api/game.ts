import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, TurnUnownedProperty, TurnInJail} from '../services/turn';
import { BoardEditions } from '../types/board';
import { Money } from '../types/money';

export class Game {
    readonly turn : TurnRoll | TurnFinish | TurnInJail | TurnOwnedProperty |
        TurnUnownedProperty

    constructor(
        readonly id: number,
        private readonly concreteTurn: ConcreteTurn<Money, BoardEditions<Money>>
    ){
        this.turn = this.concreteTurn.start()
    }
}
import { ConcreteTurn, TurnFinish, TurnOwnedProperty, TurnRoll, TurnUnownedProperty, TurnInJail} from '../services/turn';
import { BoardEditions } from '../types/board';
import { Money } from '../types/money';

export class Game {
    readonly instance : TurnRoll | TurnFinish | TurnInJail | TurnOwnedProperty |
        TurnUnownedProperty

    constructor(
        private readonly concreteTurn: ConcreteTurn<Money, BoardEditions<Money>>
    ){
        this.instance = concreteTurn.start()
    }
}
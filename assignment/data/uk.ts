import * as board from '../src/model/board'
import { Card } from '../src/model/space/card';
import { Deed } from '../src/model/space/deed';
import { FreeParking } from '../src/model/space/free_parking';
import { Go } from '../src/model/space/go';
import { GoToJail } from '../src/model/space/gotojail';
import { Jail } from '../src/model/space/jail';
import * as money from '../src/model/money';
import { Tax } from '../src/model/space/tax';
import { Train } from '../src/model/space/train';
import { Utility } from '../src/model/space/utility';

export class DataFactory {
    static createTestBoard1<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road")
            }
        }
        return testBoard
    }

    static createTestBoard2<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road"),
                2: this.createDeed<M>("Whitechapel Road"),
                3: this.createDeed<M>("The Angel, Islington"),
                // 4 missing
                5: this.createDeed<M>("Pentonville Road"),
            }
        }
        return testBoard
    }

    static createMonopolyBoard<M extends money.Money>(): board.MonopolyBoard<M> {
        let monopolyBoard : board.MonopolyBoard<M> = {
            1: {
                1: this.createGo<M>(),
                2: this.createDeed<M>("Old Kent Road"),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Whitechapel Road"),
                5: this.createTax<M>(),
                6: this.createTrain<M>("King's Cross Station"),
                7: this.createDeed<M>("The Angel, Islington"),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Euston Road"),
                10: this.createDeed<M>("Pentonville Road"),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed<M>("Pall Mall"),
                3: this.createUtility<M>("Electric Company"),
                4: this.createDeed<M>("Whitehall"),
                5: this.createDeed<M>("Northumberland Avenue"),
                6: this.createTrain<M>("Marylebone Station"),
                7: this.createDeed<M>("Bow Street"),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Marlborough Street"),
                10: this.createDeed<M>("Vine Street"),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed<M>("The Strand"),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Fleet Street"),
                5: this.createDeed<M>("Trafalgar Square"),
                6: this.createTrain<M>("Fenchurch St Station"),
                7: this.createDeed<M>("Leicester Square"),
                8: this.createDeed<M>("Coventry Street"),
                9: this.createUtility<M>("Water Works"),
                10: this.createDeed<M>("Piccadilly"),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed<M>("Regent Street"),
                3: this.createDeed<M>("Oxford Street"),
                4: this.createCard<M>(),
                5: this.createDeed<M>("Bond Street"),
                6: this.createTrain<M>("Liverpool St Station"),
                7: this.createCard<M>(),
                8: this.createDeed<M>("Park Lane"),
                9: this.createTax<M>(),
                10: this.createDeed<M>("Mayfair"),
            },
        }
        return monopolyBoard
    }

    static createGo<M extends money.Money>(): Go<M> {
        return { 
            kind: "go",
            name: "Mayfair",
            amount: 13n as M,
        }
    }

    static createJail<M extends money.Money>(): Jail {
        return { 
            kind: "jail",
            name: "Mayfair",
        }
    }

    static createFreeParking<M extends money.Money>(): FreeParking {
        return { 
            kind: "free parking",
            name: "Mayfair",
        }
    }

    static createGoToJail<M extends money.Money>(): GoToJail {
        return { 
            kind: "go to jail",
            name: "Mayfair",
        }
    }

    static createDeed<M extends money.Money>(name: string): Deed<M> {
        return { 
            kind: "deed",
            name: name,
            colourSet: "Dark Blue",
            deedPrice: 13n as M,
            rentNoHouse: 10n as M,
            rentOneHouse: 15n as M,
            rentTwoHouse: 11n as M,
            rentThreeHouse: 13n as M,
            rentFourHouse: 14n as M,
            rentHotel: 16n as M,
        }
    }

    static createTrain<M extends money.Money>(name : string): Train<M> {
        return { 
            kind: "train",
            name: name,
            amount: 13n as M,
        }
    }

    static createUtility<M extends money.Money>(name : string): Utility<M> {
        return { 
            kind: "utility",
            name: name,
            amount: 13n as M,
        }
    }
    
    static createCard<M extends money.Money>(): Card<M> {
        return { 
            kind: "card",
            name: "Mayfair",
            amount: 13n as M,
        }
    }

    static createTax<M extends money.Money>(): Tax<M> {
        return { 
            kind: "tax",
            name: "Mayfair",
            amount: 13n as M,
        }
    }
}
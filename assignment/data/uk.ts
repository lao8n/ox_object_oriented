import * as board from '../src/types/board'
import { Card } from '../src/types/space/card';
import { Colour, Deed } from '../src/types/space/deed';
import { FreeParking } from '../src/types/space/free_parking';
import { Go } from '../src/types/space/go';
import { GoToJail } from '../src/types/space/gotojail';
import { Jail } from '../src/types/space/jail';
import * as money from '../src/types/money';
import { Tax } from '../src/types/space/tax';
import { Train } from '../src/types/space/train';
import { Utility } from '../src/types/space/utility';

export class DataFactory {
    static createTestBoard1<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road", "Brown")
            }
        }
        return testBoard
    }

    static createTestBoard2<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road", "Brown"),
                2: this.createDeed<M>("Whitechapel Road", "Brown"),
                3: this.createDeed<M>("The Angel, Islington", "LightBlue"),
                // 4 missing
                5: this.createDeed<M>("Pentonville Road", "LightBlue"),
            }
        }
        return testBoard
    }

    static createMonopolyBoard<M extends money.Money>(): board.MonopolyBoard<M> {
        let monopolyBoard : board.MonopolyBoard<M> = {
            1: {
                1: this.createGo<M>(),
                2: this.createDeed<M>("Old Kent Road", "Brown", 60n as M, 2n as M),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Whitechapel Road", "Brown", 60n as M, 4n as M),
                5: this.createTax<M>(),
                6: this.createTrain<M>("King's Cross Station"),
                7: this.createDeed<M>("The Angel, Islington", "LightBlue"),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Euston Road", "LightBlue"),
                10: this.createDeed<M>("Pentonville Road", "LightBlue"),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed<M>("Pall Mall", "Pink"),
                3: this.createUtility<M>("Electric Company"),
                4: this.createDeed<M>("Whitehall", "Pink"),
                5: this.createDeed<M>("Northumberland Avenue", "Pink"),
                6: this.createTrain<M>("Marylebone Station"),
                7: this.createDeed<M>("Bow Street", "Orange"),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Marlborough Street", "Orange"),
                10: this.createDeed<M>("Vine Street", "Orange"),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed<M>("The Strand", "Red"),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Fleet Street", "Red"),
                5: this.createDeed<M>("Trafalgar Square", "Red"),
                6: this.createTrain<M>("Fenchurch St Station"),
                7: this.createDeed<M>("Leicester Square", "Yellow"),
                8: this.createDeed<M>("Coventry Street", "Yellow"),
                9: this.createUtility<M>("Water Works"),
                10: this.createDeed<M>("Piccadilly", "Yellow"),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed<M>("Regent Street", "Green"),
                3: this.createDeed<M>("Oxford Street", "Green"),
                4: this.createCard<M>(),
                5: this.createDeed<M>("Bond Street", "Green"),
                6: this.createTrain<M>("Liverpool St Station"),
                7: this.createCard<M>(),
                8: this.createDeed<M>("Park Lane", "DarkBlue"),
                9: this.createTax<M>(),
                10: this.createDeed<M>("Mayfair", "DarkBlue"),
            },
        }
        return monopolyBoard
    }

    static createStartingMoney<M extends money.Money>(): M {
        return BigInt(1500) as M
    }

    static createGo<M extends money.Money>(): Go<M> {
        return { 
            kind: "Go",
            name: "Go",
            amount: 13n as M,
        }
    }

    static createJail<M extends money.Money>(): Jail {
        return { 
            kind: "Jail",
            name: "Jail",
        }
    }

    static createFreeParking<M extends money.Money>(): FreeParking {
        return { 
            kind: "Free Parking",
            name: "Free Parking",
        }
    }

    static createGoToJail<M extends money.Money>(): GoToJail {
        return { 
            kind: "Go To Jail",
            name: "Go To Jail",
        }
    }

    static createDeed<M extends money.Money>(
        name: string, 
        colourSet: Colour, 
        price : M = 13n as M, 
        rentNoHouse : M = 10n as M
    ): Deed<M> {
        return { 
            kind: "Deed",
            name: name,
            colourSet: colourSet,
            price: price,
            rentNoHouse: rentNoHouse,
            rentOneHouse: 15n as M,
            rentTwoHouse: 11n as M,
            rentThreeHouse: 13n as M,
            rentFourHouse: 14n as M,
            rentHotel: 16n as M,
        }
    }

    static createTrain<M extends money.Money>(name : string): Train<M> {
        return { 
            kind: "Train",
            name: name,
            price: 100n as M,
            amount: 13n as M,
        }
    }

    static createUtility<M extends money.Money>(name : string): Utility<M> {
        return { 
            kind: "Utility",
            name: name,
            price: 100n as M,
            amount: 13n as M,
        }
    }
    
    static createCard<M extends money.Money>(): Card<M> {
        return { 
            kind: "Card",
            name: "Mayfair",
            amount: 13n as M,
        }
    }

    static createTax<M extends money.Money>(): Tax<M> {
        return { 
            kind: "Tax",
            name: "Mayfair",
            amount: 13n as M,
        }
    }
}
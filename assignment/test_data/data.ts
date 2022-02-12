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

export class TestDataFactory {
    static createTestBoard1<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>()
            }
        }
        return testBoard
    }

    static createTestBoard2<M extends money.Money>(): board.GenericBoard<M> {
        let testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>(),
                2: this.createDeed<M>(),
                3: this.createDeed<M>(),
                // 4 missing
                5: this.createDeed<M>(),
            }
        }
        return testBoard
    }

    static createMonopolyBoard<M extends money.Money>(): board.MonopolyBoard<M> {
        let monopolyBoard : board.MonopolyBoard<M> = {
            1: {
                1: this.createGo<M>(),
                2: this.createDeed<M>(),
                3: this.createCard<M>(),
                4: this.createDeed<M>(),
                5: this.createTax<M>(),
                6: this.createTrain<M>(),
                7: this.createDeed<M>(),
                8: this.createCard<M>(),
                9: this.createDeed<M>(),
                10: this.createDeed<M>(),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed<M>(),
                3: this.createUtility<M>(),
                4: this.createDeed<M>(),
                5: this.createDeed<M>(),
                6: this.createTrain<M>(),
                7: this.createDeed<M>(),
                8: this.createCard<M>(),
                9: this.createDeed<M>(),
                10: this.createDeed<M>(),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed<M>(),
                3: this.createCard<M>(),
                4: this.createDeed<M>(),
                5: this.createDeed<M>(),
                6: this.createTrain<M>(),
                7: this.createDeed<M>(),
                8: this.createDeed<M>(),
                9: this.createUtility<M>(),
                10: this.createDeed<M>(),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed<M>(),
                3: this.createDeed<M>(),
                4: this.createCard<M>(),
                5: this.createDeed<M>(),
                6: this.createTrain<M>(),
                7: this.createCard<M>(),
                8: this.createDeed<M>(),
                9: this.createTax<M>(),
                10: this.createDeed<M>(),
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

    static createDeed<M extends money.Money>(): Deed<M> {
        return { 
            kind: "deed",
            name: "Mayfair",
            deedPrice: 13n as M,
            rentNoHouse: 10n as M,
            rentOneHouse: 15n as M,
            rentTwoHouse: 11n as M,
            rentThreeHouse: 13n as M,
            rentFourHouse: 14n as M,
            rentHotel: 16n as M,
        }
    }

    static createTrain<M extends money.Money>(): Train<M> {
        return { 
            kind: "train",
            name: "Mayfair",
            amount: 13n as M,
        }
    }

    static createUtility<M extends money.Money>(): Utility<M> {
        return { 
            kind: "utility",
            name: "Mayfair",
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
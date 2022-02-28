import * as board from '../src/types/board';
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
        const testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road", "Brown")
            }
        };
        return testBoard;
    }

    static createTestBoard2<M extends money.Money>(): board.GenericBoard<M> {
        const testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road", "Brown"),
                2: this.createDeed<M>("Whitechapel Road", "Brown"),
                3: this.createDeed<M>("The Angel, Islington", "LightBlue"),
                // 4 missing
                5: this.createDeed<M>("Pentonville Road", "LightBlue"),
            }
        };
        return testBoard;
    }

    static createTestBoard3<M extends money.Money>(): board.GenericBoard<M> {
        const testBoard : board.GenericBoard<M> = {
            1: {
                1: this.createDeed<M>("Old Kent Road", "Brown"),
                2: this.createDeed<M>("Whitechapel Road", "Brown"),
                3: this.createDeed<M>("The Angel, Islington", "LightBlue"),
                4: this.createDeed<M>("Euston Road", "LightBlue"),
                5: this.createDeed<M>("Pentonville Road", "LightBlue"),
            }
        };
        return testBoard;
    }

    static createMonopolyBoard<M extends money.Money>(): board.MonopolyBoard<M> {
        const monopolyBoard : board.MonopolyBoard<M> = {
            1: {
                1: this.createGo<M>(),
                2: this.createDeed<M>("Old Kent Road", "Brown", 60n, 50n, 2n, 10n, 30n, 90n, 160n, 250n),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Whitechapel Road", "Brown", 60n, 50n, 4n, 20n, 60n, 180n, 320n, 450n),
                5: this.createTax<M>(),
                6: this.createTrain<M>("King's Cross Station"),
                7: this.createDeed<M>("The Angel, Islington", "LightBlue", 100n, 50n, 6n, 30n, 90n, 270n, 400n, 550n),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Euston Road", "LightBlue", 100n, 50n, 6n, 30n, 90n, 270n, 400n, 550n),
                10: this.createDeed<M>("Pentonville Road", "LightBlue", 120n, 50n, 8n, 40n, 100n, 300n, 450n, 600n),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed<M>("Pall Mall", "Pink", 140n, 100n, 10n, 50n, 150n, 450n, 625n, 750n),
                3: this.createUtility<M>("Electric Company"),
                4: this.createDeed<M>("Whitehall", "Pink", 140n, 100n, 10n, 50n, 150n, 450n, 625n, 750n),
                5: this.createDeed<M>("Northumberland Avenue", "Pink", 160n, 100n, 12n, 60n, 180n, 500n, 700n, 900n),
                6: this.createTrain<M>("Marylebone Station"),
                7: this.createDeed<M>("Bow Street", "Orange", 180n, 100n, 14n, 70n, 200n, 550n, 750n, 950n),
                8: this.createCard<M>(),
                9: this.createDeed<M>("Marlborough Street", "Orange", 180n, 100n, 14n, 70n, 200n, 550n, 750n, 950n),
                10: this.createDeed<M>("Vine Street", "Orange", 200n, 100n, 16n, 80n, 220n, 600n, 800n, 1000n),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed<M>("The Strand", "Red", 220n, 150n, 18n, 90n, 250n, 700n, 875n, 1050n),
                3: this.createCard<M>(),
                4: this.createDeed<M>("Fleet Street", "Red", 220n, 150n, 18n, 90n, 250n, 700n, 875n, 1050n),
                5: this.createDeed<M>("Trafalgar Square", "Red", 240n, 150n, 20n, 100n, 300n, 750n, 925n, 1100n),
                6: this.createTrain<M>("Fenchurch St Station"),
                7: this.createDeed<M>("Leicester Square", "Yellow", 260n, 150n, 22n, 110n, 330n, 800n, 975n, 1150n),
                8: this.createDeed<M>("Coventry Street", "Yellow", 260n, 150n, 22n, 110n, 330n, 800n, 975n, 1150n),
                9: this.createUtility<M>("Water Works"),
                10: this.createDeed<M>("Piccadilly", "Yellow", 280n, 150n, 22n, 120n, 360n, 850n, 1025n, 1200n),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed<M>("Regent Street", "Green", 300n, 200n, 26n, 130n, 390n, 900n, 1100n, 1275n),
                3: this.createDeed<M>("Oxford Street", "Green", 300n, 200n, 26n, 130n, 390n, 900n, 1100n, 1275n),
                4: this.createCard<M>(),
                5: this.createDeed<M>("Bond Street", "Green", 320n, 200n, 28n, 150n, 450n, 1000n, 1200n, 1400n),
                6: this.createTrain<M>("Liverpool St Station"),
                7: this.createCard<M>(),
                8: this.createDeed<M>("Park Lane", "DarkBlue", 350n, 200n, 35n, 175n, 500n, 1100n, 1300n, 1500n),
                9: this.createTax<M>(),
                10: this.createDeed<M>("Mayfair", "DarkBlue", 400n, 200n, 50n, 200n, 600n, 1400n, 1700n, 2000n),
            },
        };
        return monopolyBoard;
    }

    static createStartingMoney<M extends money.Money>(): M {
        return BigInt(1500) as M;
    }

    static createGo<M extends money.Money>(): Go<M> {
        return { 
            kind: "Go",
            name: "Go",
            amount: 13n as M,
        };
    }

    static createJail<M extends money.Money>(): Jail {
        return { 
            kind: "Jail",
            name: "Jail",
        };
    }

    static createFreeParking<M extends money.Money>(): FreeParking {
        return { 
            kind: "Free Parking",
            name: "Free Parking",
        };
    }

    static createGoToJail<M extends money.Money>(): GoToJail {
        return { 
            kind: "Go To Jail",
            name: "Go To Jail",
        };
    }

    static createDeed<M extends money.Money>(
        name: string, 
        colourSet: Colour, 
        price  = 10n, 
        houseCost = 10n,
        rentNoHouse  = 10n,
        rentOneHouse = 10n,
        rentTwoHouse = 10n,
        rentThreeHouse = 10n,
        rentFourHouse = 10n,
        rentHotel = 10n,
    ): Deed<M> {
        return { 
            kind: "Deed",
            name: name,
            colourSet: colourSet,
            price: price as M,
            houseCost: houseCost as M,
            rentNoHouse: rentNoHouse as M,
            rentOneHouse: rentOneHouse as M ,
            rentTwoHouse: rentTwoHouse as M,
            rentThreeHouse: rentThreeHouse as M,
            rentFourHouse: rentFourHouse as M,
            rentHotel: rentHotel as M,
        };
    }

    static createTrain<M extends money.Money>(name : string): Train<M> {
        return { 
            kind: "Train",
            name: name,
            price: 100n as M,
            amount: 13n as M,
        };
    }

    static createUtility<M extends money.Money>(name : string): Utility<M> {
        return { 
            kind: "Utility",
            name: name,
            price: 150n as M,
        };
    }
    
    static createCard<M extends money.Money>(): Card<M> {
        return { 
            kind: "Card",
            name: "Mayfair",
            amount: 13n as M,
        };
    }

    static createTax<M extends money.Money>(): Tax<M> {
        return { 
            kind: "Tax",
            name: "Mayfair",
            amount: 13n as M,
        };
    }
}
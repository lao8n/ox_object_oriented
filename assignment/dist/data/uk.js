"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFactory = void 0;
class DataFactory {
    static createTestBoard1() {
        let testBoard = {
            1: {
                1: this.createDeed("Old Kent Road", "Brown")
            }
        };
        return testBoard;
    }
    static createTestBoard2() {
        let testBoard = {
            1: {
                1: this.createDeed("Old Kent Road", "Brown"),
                2: this.createDeed("Whitechapel Road", "Brown"),
                3: this.createDeed("The Angel, Islington", "LightBlue"),
                // 4 missing
                5: this.createDeed("Pentonville Road", "LightBlue"),
            }
        };
        return testBoard;
    }
    static createTestBoard3() {
        let testBoard = {
            1: {
                1: this.createDeed("Old Kent Road", "Brown"),
                2: this.createDeed("Whitechapel Road", "Brown"),
                3: this.createDeed("The Angel, Islington", "LightBlue"),
                4: this.createDeed("Euston Road", "LightBlue"),
                5: this.createDeed("Pentonville Road", "LightBlue"),
            }
        };
        return testBoard;
    }
    static createMonopolyBoard() {
        let monopolyBoard = {
            1: {
                1: this.createGo(),
                2: this.createDeed("Old Kent Road", "Brown", 60n, 2n),
                3: this.createCard(),
                4: this.createDeed("Whitechapel Road", "Brown", 60n, 4n),
                5: this.createTax(),
                6: this.createTrain("King's Cross Station"),
                7: this.createDeed("The Angel, Islington", "LightBlue"),
                8: this.createCard(),
                9: this.createDeed("Euston Road", "LightBlue"),
                10: this.createDeed("Pentonville Road", "LightBlue"),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed("Pall Mall", "Pink"),
                3: this.createUtility("Electric Company"),
                4: this.createDeed("Whitehall", "Pink"),
                5: this.createDeed("Northumberland Avenue", "Pink"),
                6: this.createTrain("Marylebone Station"),
                7: this.createDeed("Bow Street", "Orange"),
                8: this.createCard(),
                9: this.createDeed("Marlborough Street", "Orange"),
                10: this.createDeed("Vine Street", "Orange"),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed("The Strand", "Red"),
                3: this.createCard(),
                4: this.createDeed("Fleet Street", "Red"),
                5: this.createDeed("Trafalgar Square", "Red"),
                6: this.createTrain("Fenchurch St Station"),
                7: this.createDeed("Leicester Square", "Yellow"),
                8: this.createDeed("Coventry Street", "Yellow"),
                9: this.createUtility("Water Works"),
                10: this.createDeed("Piccadilly", "Yellow"),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed("Regent Street", "Green"),
                3: this.createDeed("Oxford Street", "Green"),
                4: this.createCard(),
                5: this.createDeed("Bond Street", "Green"),
                6: this.createTrain("Liverpool St Station"),
                7: this.createCard(),
                8: this.createDeed("Park Lane", "DarkBlue"),
                9: this.createTax(),
                10: this.createDeed("Mayfair", "DarkBlue"),
            },
        };
        return monopolyBoard;
    }
    static createStartingMoney() {
        return BigInt(1500);
    }
    static createGo() {
        return {
            kind: "Go",
            name: "Go",
            amount: 13n,
        };
    }
    static createJail() {
        return {
            kind: "Jail",
            name: "Jail",
        };
    }
    static createFreeParking() {
        return {
            kind: "Free Parking",
            name: "Free Parking",
        };
    }
    static createGoToJail() {
        return {
            kind: "Go To Jail",
            name: "Go To Jail",
        };
    }
    static createDeed(name, colourSet, price = 13n, rentNoHouse = 10n) {
        return {
            kind: "Deed",
            name: name,
            colourSet: colourSet,
            price: price,
            rentNoHouse: rentNoHouse,
            rentOneHouse: 15n,
            rentTwoHouse: 11n,
            rentThreeHouse: 13n,
            rentFourHouse: 14n,
            rentHotel: 16n,
        };
    }
    static createTrain(name) {
        return {
            kind: "Train",
            name: name,
            price: 100n,
            amount: 13n,
        };
    }
    static createUtility(name) {
        return {
            kind: "Utility",
            name: name,
            price: 100n,
            amount: 13n,
        };
    }
    static createCard() {
        return {
            kind: "Card",
            name: "Mayfair",
            amount: 13n,
        };
    }
    static createTax() {
        return {
            kind: "Tax",
            name: "Mayfair",
            amount: 13n,
        };
    }
}
exports.DataFactory = DataFactory;

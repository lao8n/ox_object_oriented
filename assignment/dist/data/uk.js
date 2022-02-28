"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFactory = void 0;
class DataFactory {
    static createTestBoard1() {
        const testBoard = {
            1: {
                1: this.createDeed("Old Kent Road", "Brown")
            }
        };
        return testBoard;
    }
    static createTestBoard2() {
        const testBoard = {
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
        const testBoard = {
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
        const monopolyBoard = {
            1: {
                1: this.createGo(),
                2: this.createDeed("Old Kent Road", "Brown", 60n, 50n, 2n, 10n, 30n, 90n, 160n, 250n),
                3: this.createCard(),
                4: this.createDeed("Whitechapel Road", "Brown", 60n, 50n, 4n, 20n, 60n, 180n, 320n, 450n),
                5: this.createTax(),
                6: this.createTrain("King's Cross Station"),
                7: this.createDeed("The Angel, Islington", "LightBlue", 100n, 50n, 6n, 30n, 90n, 270n, 400n, 550n),
                8: this.createCard(),
                9: this.createDeed("Euston Road", "LightBlue", 100n, 50n, 6n, 30n, 90n, 270n, 400n, 550n),
                10: this.createDeed("Pentonville Road", "LightBlue", 120n, 50n, 8n, 40n, 100n, 300n, 450n, 600n),
            },
            2: {
                1: this.createJail(),
                2: this.createDeed("Pall Mall", "Pink", 140n, 100n, 10n, 50n, 150n, 450n, 625n, 750n),
                3: this.createUtility("Electric Company"),
                4: this.createDeed("Whitehall", "Pink", 140n, 100n, 10n, 50n, 150n, 450n, 625n, 750n),
                5: this.createDeed("Northumberland Avenue", "Pink", 160n, 100n, 12n, 60n, 180n, 500n, 700n, 900n),
                6: this.createTrain("Marylebone Station"),
                7: this.createDeed("Bow Street", "Orange", 180n, 100n, 14n, 70n, 200n, 550n, 750n, 950n),
                8: this.createCard(),
                9: this.createDeed("Marlborough Street", "Orange", 180n, 100n, 14n, 70n, 200n, 550n, 750n, 950n),
                10: this.createDeed("Vine Street", "Orange", 200n, 100n, 16n, 80n, 220n, 600n, 800n, 1000n),
            },
            3: {
                1: this.createFreeParking(),
                2: this.createDeed("The Strand", "Red", 220n, 150n, 18n, 90n, 250n, 700n, 875n, 1050n),
                3: this.createCard(),
                4: this.createDeed("Fleet Street", "Red", 220n, 150n, 18n, 90n, 250n, 700n, 875n, 1050n),
                5: this.createDeed("Trafalgar Square", "Red", 240n, 150n, 20n, 100n, 300n, 750n, 925n, 1100n),
                6: this.createTrain("Fenchurch St Station"),
                7: this.createDeed("Leicester Square", "Yellow", 260n, 150n, 22n, 110n, 330n, 800n, 975n, 1150n),
                8: this.createDeed("Coventry Street", "Yellow", 260n, 150n, 22n, 110n, 330n, 800n, 975n, 1150n),
                9: this.createUtility("Water Works"),
                10: this.createDeed("Piccadilly", "Yellow", 280n, 150n, 22n, 120n, 360n, 850n, 1025n, 1200n),
            },
            4: {
                1: this.createGoToJail(),
                2: this.createDeed("Regent Street", "Green", 300n, 200n, 26n, 130n, 390n, 900n, 1100n, 1275n),
                3: this.createDeed("Oxford Street", "Green", 300n, 200n, 26n, 130n, 390n, 900n, 1100n, 1275n),
                4: this.createCard(),
                5: this.createDeed("Bond Street", "Green", 320n, 200n, 28n, 150n, 450n, 1000n, 1200n, 1400n),
                6: this.createTrain("Liverpool St Station"),
                7: this.createCard(),
                8: this.createDeed("Park Lane", "DarkBlue", 350n, 200n, 35n, 175n, 500n, 1100n, 1300n, 1500n),
                9: this.createTax(),
                10: this.createDeed("Mayfair", "DarkBlue", 400n, 200n, 50n, 200n, 600n, 1400n, 1700n, 2000n),
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
    static createDeed(name, colourSet, price = 10n, houseCost = 10n, rentNoHouse = 10n, rentOneHouse = 10n, rentTwoHouse = 10n, rentThreeHouse = 10n, rentFourHouse = 10n, rentHotel = 10n) {
        return {
            kind: "Deed",
            name: name,
            colourSet: colourSet,
            price: price,
            houseCost: houseCost,
            rentNoHouse: rentNoHouse,
            rentOneHouse: rentOneHouse,
            rentTwoHouse: rentTwoHouse,
            rentThreeHouse: rentThreeHouse,
            rentFourHouse: rentFourHouse,
            rentHotel: rentHotel,
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
            price: 150n,
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

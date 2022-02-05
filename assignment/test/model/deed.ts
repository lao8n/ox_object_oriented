import * as _chai from 'chai';
import * as deed from '../../src/model/deed';
import * as money from '../../src/model/money';

describe('model deed', () => {
    it('can use initialize type where prices all with the same money', () => {
        let d : deed.Deed<money.GBP> = { 
            name: "Mayfair",
            deedPrice: 13n as money.GBP,
            rentNoHouse: 10n as money.GBP,
            rentOneHouse: 15n as money.GBP,
            rentTwoHouse: 11n as money.GBP,
            rentThreeHouse: 13n as money.GBP,
            rentFourHouse: 14n as money.GBP,
            rentHotel: 16n as money.GBP,
        }
        _chai.expect(((d : deed.Deed<money.GBP>) => true)(d)).to.true;
    })
})
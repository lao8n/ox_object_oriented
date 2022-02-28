import * as _chai from 'chai';
import * as money from '../../src/types/money';
import 'mocha';

describe('model money', () => {
    it('can use GBP when GBP expected', () => {
        const gbp = BigInt(10) as money.GBP;
        _chai.expect((
            (m : money.Money) => m.toString() == "10")(gbp)).to.true;
    }),
    it('can use GBP when Money expected', () => {
        const gbp = BigInt(10) as money.GBP;
        _chai.expect(
            ((m : money.Money) => m.toString() == "10")(gbp)).to.true;
    });
});
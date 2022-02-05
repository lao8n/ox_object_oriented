import * as _chai from 'chai';
import * as money from '../../src/model/money';

describe('model money', () => {
    it('can use GBP when GBP expected', () => {
        let gbp = BigInt(10) as money.GBP
        _chai.expect(((m : money.GBP) => true)(gbp)).to.true;
    }),
    it('can use GBP when Money expected', () => {
        let gbp = BigInt(10) as money.GBP
        _chai.expect(((m : money.Money) => true)(gbp)).to.true;
    })
})
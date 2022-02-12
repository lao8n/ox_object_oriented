import * as _chai from 'chai';
import * as deed from '../../../src/model/space/deed';
import * as money from '../../../src/model/money';
import { TestDataFactory } from '../../../test_data/data';

describe('model deed', () => {
    it('can use initialize type where prices all with the same money', () => {
        let d : deed.Deed<money.GBP> = TestDataFactory.createDeed<money.GBP>()

        _chai.expect(((d : deed.Deed<money.GBP>) => true)(d)).to.true;
    })
})
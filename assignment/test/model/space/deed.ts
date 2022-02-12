import * as _chai from 'chai';
import * as deed from '../../../src/model/space/deed';
import * as money from '../../../src/model/money';
import { DataFactory } from '../../../data/uk';

describe('model deed', () => {
    it('can use initialize type where prices all with the same money', () => {
        let d : deed.Deed<money.GBP> = 
            DataFactory.createDeed<money.GBP>("Mayfair")
        _chai.expect(((d : deed.Deed<money.GBP>) => true)(d)).to.true;
    })
})
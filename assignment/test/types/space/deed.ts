import * as _chai from 'chai';
import * as deed from '../../../src/types/space/deed';
import * as money from '../../../src/types/money';
import { DataFactory } from '../../../data/uk';
import 'mocha';

describe('model deed', () => {
    it('can use initialize type where prices all with the same money', () => {
        const d : deed.Deed<money.GBP> = 
            DataFactory.createDeed<money.GBP>("Mayfair", "DarkBlue");
        _chai.expect(
            ((d : deed.Deed<money.GBP>) => d.kind == "Deed")(d)).to.true;
    });
});
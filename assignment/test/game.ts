import * as _chai from 'chai';
import { hello } from '../src/game';

describe('Hello', () => {
    it('can be called', () => {
        _chai.expect(hello()).to.true;
    })
})
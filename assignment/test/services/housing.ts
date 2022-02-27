import * as _chai from 'chai';
import { Housing } from '../../src/services/housing'
import { MonopolyBoard } from '../../src/types/board'
import { DataFactory } from '../../data/uk';
import { Board } from '../../src/services/board';
import { Owner, Ownership } from '../../src/services/ownership';
import { Players } from "../../src/services/players";

import * as money from "../../src/types/money";

describe('service housing constructor', () => {
    it('can construct', () => {
        let m = DataFactory.createMonopolyBoard<money.GBP>()
        let b = new Board<money.GBP, MonopolyBoard<money.GBP>>(m)
        let p = new Players<money.GBP>(4)
        let o = new Ownership<money.GBP, MonopolyBoard<money.GBP>>(m)
        let h = new Housing<money.GBP, MonopolyBoard<money.GBP>>(m, p, o) 
        _chai.assert.instanceOf(h, Housing)
    })
})
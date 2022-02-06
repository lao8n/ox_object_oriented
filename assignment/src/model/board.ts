import { Card } from './card';
import { Deed } from './deed';
import { FreeParking } from './free_parking';
import { Go } from './go';
import { GoToJail } from './gotojail';
import { Jail } from './jail';
import { Money } from './money';
import { Tax } from './tax';
import { Train } from './train';
import { Utility } from './utility';

/**
 * Assignment notes
 * - We use the keyof operator  to get all the types of space on the monopoly 
 *   board which will automatically update with change in MonopolyBoard
 */
export type Space<M extends Money> = 
    MonopolyBoard<M>[
        keyof MonopolyBoard<M>
    ][
        keyof MonopolyBoard<M>[keyof MonopolyBoard<M>]
    ]

/**
 * Every location on the board has a specific type of Space that must occupy it
 * giving us type-safety.
 *
 * Assignment notes
 * - 
 */
export type MonopolyBoard<M extends Money> = {
    1: {
        1: Go<M>,
        2: Deed<M>,
        3: Card<M>,
        4: Deed<M>,
        5: Tax<M>,
        6: Train<M>,
        7: Deed<M>,
        8: Card<M>,
        9: Deed<M>,
        10: Deed<M>,
    },
    2: {
        1: Jail,
        2: Deed<M>,
        3: Utility<M>,
        4: Deed<M>,
        5: Deed<M>,
        6: Train<M>,
        7: Deed<M>,
        8: Card<M>,
        9: Deed<M>,
        10: Deed<M>,
    },
    3: {
        1: FreeParking,
        2: Deed<M>,
        3: Card<M>,
        4: Deed<M>,
        5: Deed<M>,
        6: Train<M>,
        7: Deed<M>,
        8: Deed<M>,
        9: Utility<M>,
        10: Deed<M>,
    },
    4: {
        1: GoToJail,
        2: Deed<M>,
        3: Deed<M>,
        4: Card<M>,
        5: Deed<M>,
        6: Train<M>,
        7: Card<M>,
        8: Deed<M>,
        9: Tax<M>,
        10: Deed<M>,
    },
}

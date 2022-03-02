*Instructions*
```
cd assignment
tsc // compiles
npm run test // run tests -> 122 passing
npm run lint // passes
```

*Exposed API*
* `index` All exported interfaces, types and classes
* `GameServer` to start and get games
* `Game` to access Turn interfaces where FSM `TurnRoll`, `TurnInJail`, 
`TurnUnownedProperty`, `TurnOwnedProperty`, `TurnFinish` enforce ordering of 
moves and players
* `Game` exposes game information without exposing underlying services 
* `types` exposes light-weight objects like `PlayerID` and `BoardLocation` 
without exposing implementation details that are held in `services`
* `data` has Monopoly board data for both test sets and a full working board

*Internal*
* `services` houses core game implementation features
* `adt` has a generic data structure
* `test` comprehensive testing of all components

*Monopoly features checklist*
| Game feature             | Implemented | Note                                                                                                                                                             |
|--------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Token                    | No          | Just player id                                                                                                                                                   |
| Money                    | Yes         | With different currencies, enforced to be the same for the whole board                                                                                           |
| Banker                   | Yes         | Automated - see below                                                                                                                                            |
| Title Deed Cards         | Yes         | All British Monopoly board locations, easy to add alternative boards                                                                                             |
| Starting Money           | Yes         |                                                                                                                                                                  |
| Number of players        | Yes         | 2 to 8                                                                                                                                                           |
| Highest dice to start    | No          | Player order can be customised however                                                                                                                           |
| Roll dice                | Yes         | Including repeated moves with doubles, and going to jail if 3 doubles in a row                                                                                   |
| Buy property             | Yes         | Including check on whether have enough money, others already own the property etc.                                                                               |
| Rent                     | Yes         | Including different rents when a set is owned, or houses/hotels. Forced to pay rent do not require owner to ask for it                                           |
| Passing Go               | Yes         | Only if pass Go get 200, not if go to jail                                                                                                                       |
| Train                    | Yes         | Though flat rent fees, except if all in set owned                                                                                                                |
| Utility                  | Yes         | Based upon the dice roll                                                                                                                                         |
| Income tax               | Yes         | Though no choice, can only pay 100                                                                                                                               |
| Jail                     | Yes         | But stay there forever until throw a double. Just passing works                                                                                                  |
| Go to Jail               | Yes         | Yes, including update of location, do not get 200 for passing Go and updated status to jail where need to throw double to escape                                 |
| Chance & Community Chest | Yes         | Defaults to tax 100                                                                                                                                              |
| Free Parking             | Yes         |                                                                                                                                                                  |
| Houses                   | Yes         | Requirement to own set to buy, with different costs for houses, and stack to enforce ordering of building. Limit on number of available houses/hotels.           |
| Mortgage                 | No          | Can release properties though not exposed through API                                                                                                            |
| Bankruptcy               | No          | First player unable to pay and the game is over.                                                                                                                 |
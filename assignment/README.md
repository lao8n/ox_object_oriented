*How to compile code*
```
cd assignment
tsc
```
tests
```
npm run test
```

Questions about submission
* should we add node_modules folder?

Low-level data
* Static type-checking
* Data validation
* Light-weight types

High-level components
* Interfaces 
* Classes
* Public methods
* Private/protected methods

Advanced type features
* Polymorphism
* Advanced types
* Type operators

Idiomatic language features
* Destructuring
* for..of loops
* iterators
* map/filter on arrays

OOP Design patterns
* Factory
* Flyweight
* Facade
* Global Object

Error handling
* null
* throw exceptions
* return exceptions
* Option

Reusable generic data structures
* Trees, graphs, queues/stacks: 


| Game feature             | Implemented | Note                                                                                                                                                             |
|--------------------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Token                    | No          | Just player id                                                                                                                                                   |
| Money                    | Yes         | With different currencies, enforced to be the same for the whole board                                                                                           |
| Banker                   | Yes         | Automated                                                                                                                                                        |
| Title Deed Cards         | Yes         | All British Monopoly board locations                                                                                                                             |
| Starting Money           | Yes         |                                                                                                                                                                  |
| Number of player         | Yes         | 2 to 8                                                                                                                                                           |
| Highest dice to start    | No          | Player order can be customised however                                                                                                                           |
| Roll dice                | Yes         | Including repeated moves with doubles, and going to jail if 3 doubles in a row                                                                                   |
| Buy property             | Yes         | No auction however                                                                                                                                               |
| Rent                     | Yes         | Including different rents when a set is owned, or houses/hotels                                                                                                  |
| Passing Go               | Yes         | Only if pass Go, not if go to jail                                                                                                                               |
| Train & Utility          | Yes         | Though flat rent fees, except if all in set owned                                                                                                                |
| Income tax               | Yes         | Just though no choice, can only pay 200                                                                                                                          |
| Jail                     | Yes         | But stay there forever until throw a double                                                                                                                      |
| Chance & Community Chest | Yes         | Cards to either get or lose money only                                                                                                                           |
| Free Parking             | Yes         |                                                                                                                                                                  |
| Houses                   | Yes         | Including requirement to own set to buy, with different rents for houses, and stack to enforce ordering of building. No limits on houses, or selling of property |
| Mortgage                 | No          |                                                                                                                                                                  |
| Bankruptcy               | No          | First player loses the game is over.    
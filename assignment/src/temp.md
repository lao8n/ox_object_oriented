
Architectural decisions
* how should we model landing on a spot on the board? finite state machine? 
* do properties have an owner? or do owners have properties?
* a lot of actions are based upon position on the board -> can buy, have to pay rent etc. 
* some actions are based upon portfolio e.g. do i have a group of properties? do i have houses on some properties already
* allow the user to try any action e.g. buying a property or buying houses/hotels and then error if not eligible -> or only show the user validated actions. 

Board
* has a map of positions
* position is one of a few different types : chance, community, jail, go etc. 
* optimise for lookup of does this property has an owner etc. 
* position is a finite state machine based upon 

Player
* has a token
* has a position
* don't need -> has map of positions (properties owned)
* has money
* takes turn
* getActions() -> location dependent actions and portfolio dependent actions
* has properties -> need to know if you have a set because that changes the actions you can do.
* location choices: 
    1. roll dice 
    2. buy property 
    3. choose whether to pay $200 or 10% of total worth for income tax 
    4. pay fine then roll 
    5. use get of jail or purchase from another player 4
    6. ask for rent 
* anywhere choices: 
    1. buy/sell houses/hotels -> subject to constraints like a. ownership of set b. distribution of houses c. bank has houses to sell 
    2. mortgage property 
    3. auction property 
    4. buy/sell cards 
    5. sell properties subject to constraints like a. no houses on properties b. in reverse they were erected - tho can be mortgaged
    6. lift mortgage 
* obligations  
    1. pay rent if asked -> dependent upon a. houses/hotels b. mortgage c. colour group owned d. 
    2. pay taxes 
    3. draw card 
    4. go to jail
    5. go bankrupt


Community chest and Chance cards
* get money
* pay money
* move to location
* special card -> Get out of jail card

Properties
* map of position -> deed -> has an owner

User actions
* Roll dice
* Trade
* Build Houses
* Sell Houses
* Mortgage
* Redeem
* Finish turn
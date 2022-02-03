import * as util from "util";
import { Buyer, Listing, Marketplace, Price, Seller, Time, Bid } from "./marketplace";

// Setting object logging depth to 3:
util.inspect.defaultOptions.depth = 3;

// Custom time-setting hack, for testing purposes:
const now: {time: Time} = {
    time: Date.now()
};
Date.now = () => now.time;


// Log header and time:
console.log("=== 1. Create marketplace/users/listings ===");
console.log();
console.log("Set time to:", new Date(now.time));
// Create marketplace, users and listings:
const marketplace = new Marketplace();
const Mario: Seller = marketplace.seller("Mario");
const Luigi: Buyer = marketplace.buyer("Luigi");
const Peach: Buyer = marketplace.buyer("Peach");
const superMushroomsDraft = Mario.draftListing()
    .titled("Super Mushroom 3x")
    .describedAs("Bundle of 3 super mushrooms, guaranteed to make you tall!")
    .pricedAt(Price.new(15, "EUR"))
    .withMinBidTime(6*Time.day+12*Time.hour);
const fireFlowerDraft = Mario.draftListing()
    .titled("Fire Flower")
    .describedAs("One fire flower, makes you shoot fireballs!");
console.log();
console.log(marketplace);
console.log();
    
// === 1. Create marketplace/users/listings ===
//
// Set time to: 2022-01-31T01:19:55.188Z
//
// Marketplace {
//   users: {
//     Mario: User {
//       username: 'Mario',
//       listings.draft: {
//         '0': Listing {
//           stage: 'draft',
//           seller.username: 'Mario',
//           title: 'Super Mushroom 3x',
//           description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//           startPrice: 15.00 EUR,
//           minBidTime: 6d 12h 0m 0s
//         },
//         '1': Listing {
//           stage: 'draft',
//           seller.username: 'Mario',
//           title: 'Fire Flower',
//           description: 'One fire flower, makes you shoot fireballs!',
//           startPrice: undefined,
//           minBidTime: undefined
//         }
//       }
//     },
//     Luigi: User {
//       username: 'Luigi'
//     },
//     Peach: User {
//       username: 'Peach'
//     }
//   },
//   listings: [
//     Listing {
//       stage: 'draft',
//       seller.username: 'Mario',
//       title: 'Super Mushroom 3x',
//       description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//       startPrice: 15.00 EUR,
//       minBidTime: 6d 12h 0m 0s
//     },
//     Listing {
//       stage: 'draft',
//       seller.username: 'Mario',
//       title: 'Fire Flower',
//       description: 'One fire flower, makes you shoot fireballs!',
//       startPrice: undefined,
//       minBidTime: undefined
//     }
//   ]
// }


console.log("=== 2. Activate listing ===");
console.log();
now.time += 2*Time.hour;
console.log("Set time to:", new Date(now.time));
console.log();
// Set custom callbacks for state change:
function stateChangedCallback(listing: Listing, prevStage: Listing["stage"]): void {
    const {id: listingID, title, stage: newStage} = listing;
    const listingStr = title != undefined ? `'${title}'` : `#${listingID}`;
    console.log(`Listing ${listingStr} changed state from ${prevStage} to ${newStage}.`);
}
superMushroomsDraft.onStageChange(stateChangedCallback);
fireFlowerDraft.onStageChange(stateChangedCallback);
// Activate super mushroom listing:
const superMushrooms = superMushroomsDraft.activate();
console.log();
console.log(marketplace);
console.log();

// === 2. Activate listing ===
//
// Set time to: 2022-01-31T03:19:55.188Z
//
// Listing 'Super Mushroom 3x' changed state from draft to active.
//
// Marketplace {
//   users: {
//     Mario: User {
//       username: 'Mario',
//       listings.draft: {
//         '1': Listing {
//           stage: 'draft',
//           seller.username: 'Mario',
//           title: 'Fire Flower',
//           description: 'One fire flower, makes you shoot fireballs!',
//           startPrice: undefined,
//           minBidTime: undefined
//         }
//       },
//       listings.active: {
//         '0': Listing {
//           stage: 'active',
//           seller.username: 'Mario',
//           title: 'Super Mushroom 3x',
//           description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//           startPrice: 15.00 EUR,
//           minBidTime: 6d 12h 0m 0s,
//           bids.topBid: undefined,
//           listedOn: 2022-01-31T03:19:55.188Z
//         }
//       }
//     },
//     Luigi: User {
//       username: 'Luigi'
//     },
//     Peach: User {
//       username: 'Peach'
//     }
//   },
//   listings: [
//     Listing {
//       stage: 'active',
//       seller.username: 'Mario',
//       title: 'Super Mushroom 3x',
//       description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//       startPrice: 15.00 EUR,
//       minBidTime: 6d 12h 0m 0s,
//       bids.topBid: undefined,
//       listedOn: 2022-01-31T03:19:55.188Z
//     },
//     Listing {
//       stage: 'draft',
//       seller.username: 'Mario',
//       title: 'Fire Flower',
//       description: 'One fire flower, makes you shoot fireballs!',
//       startPrice: undefined,
//       minBidTime: undefined
//     }
//   ]
// }


// Log header and new time:
console.log("=== 3. Place some bids ===");
console.log();
now.time += 3*Time.day;
console.log("Set time to:", new Date(now.time));
// Set custom callbacks for bid placement/withdrawal on active super mushroom listing:
function bidPlacedCallback(listing: Listing, bid: Bid): void {
    const { title } = listing;
    const { buyer, price } = bid;
    console.log(`${buyer.username} placed a new bid on listing '${title}':`, price);
}
function bidWithdrawnCallback(listing: Listing, bid: Bid): void {
    const { title } = listing;
    const { buyer } = bid;
    console.log(`${buyer.username} withdrew their bid on listing '${title}'.`);
}
superMushrooms.bids.onBidPlaced(bidPlacedCallback);
superMushrooms.bids.onBidWithdrawn(bidWithdrawnCallback);
// Place bids:
Luigi.placeBid(superMushrooms, Price.new(2000, "JPY"));
Peach.placeBid(superMushrooms, Price.new(15, "GBP"));
console.log();
console.log(marketplace);
console.log();

const query = marketplace.selectListings
    .where(listing => listing.title.startsWith("Super"))
    .where(listing => listing.startPrice >= Price.new(10, "EUR"))
    .sortBy(listing => listing.bids.topBid?.price.valueOf() ?? 0, "descending");
const listings: readonly Listing[] = [...query]; // actually executes the query

// === 3. Place some bids ===

// Set time to: 2022-02-03T03:19:55.188Z
// Luigi placed a new bid on listing 'Super Mushroom 3x': 2000 JPY
// Peach placed a new bid on listing 'Super Mushroom 3x': 15.00 GBP

// Marketplace {
//   users: {
//     Mario: User {
//       username: 'Mario',
//       listings.draft: {
//         '1': Listing {
//           stage: 'draft',
//           seller.username: 'Mario',
//           title: 'Fire Flower',
//           description: 'One fire flower, makes you shoot fireballs!',
//           startPrice: undefined,
//           minBidTime: undefined
//         }
//       },
//       listings.active: {
//         '0': Listing {
//           stage: 'active',
//           seller.username: 'Mario',
//           title: 'Super Mushroom 3x',
//           description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//           startPrice: 15.00 EUR,
//           minBidTime: 6d 12h 0m 0s,
//           bids.topBid: { buyer: [User Peach], price: 15.00 GBP },
//           listedOn: 2022-01-31T03:19:55.188Z
//         }
//       }
//     },
//     Luigi: User {
//       username: 'Luigi',
//       activeBids: { '0': [ [Listing], 2000 JPY ] }
//     },
//     Peach: User {
//       username: 'Peach',
//       activeBids: { '0': [ [Listing], 15.00 GBP ] }
//     }
//   },
//   listings: [
//     Listing {
//       stage: 'active',
//       seller.username: 'Mario',
//       title: 'Super Mushroom 3x',
//       description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//       startPrice: 15.00 EUR,
//       minBidTime: 6d 12h 0m 0s,
//       bids.topBid: {
//         buyer: User {
//           username: 'Peach',
//           activeBids: { '0': [Array] }
//         },
//         price: 15.00 GBP
//       },
//       listedOn: 2022-01-31T03:19:55.188Z
//     },
//     Listing {
//       stage: 'draft',
//       seller.username: 'Mario',
//       title: 'Fire Flower',
//       description: 'One fire flower, makes you shoot fireballs!',
//       startPrice: undefined,
//       minBidTime: undefined
//     }
//   ]
// }


// Log header and new time:
console.log("=== 4. Sell/cancel listings ===");
console.log();
now.time += 4*Time.day;
console.log("Set time to:", new Date(now.time));
// Sell super mushroom listing, cancel fire flower listing
superMushrooms.sell();
fireFlowerDraft.cancel();
console.log();
console.log(marketplace);
console.log();

// === 4. Sell/cancel listings ===
//
// Set time to: 2022-02-07T03:19:55.188Z
// Listing 'Super Mushroom 3x' changed state from active to sold.
// Listing 'Fire Flower' changed state from draft to cancelled.
//
// Marketplace {
//   users: {
//     Mario: User {
//       username: 'Mario',
//       moneyEarned: 17.65 EUR,
//       listings.sold: {
//         '0': Listing {
//           stage: 'sold',
//           seller.username: 'Mario',
//           title: 'Super Mushroom 3x',
//           description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//           startPrice: 15.00 EUR,
//           minBidTime: 6d 12h 0m 0s,
//           soldOn: 2022-02-07T03:19:55.188Z,
//           soldAt: 15.00 GBP,
//           soldTo.username: 'Peach'
//         }
//       },
//       listings.cancelled: {
//         '1': Listing {
//           stage: 'cancelled',
//           seller.username: 'Mario',
//           title: 'Fire Flower',
//           description: 'One fire flower, makes you shoot fireballs!',
//           startPrice: undefined,
//           minBidTime: undefined,
//           cancelledOn: 2022-02-07T03:19:55.188Z
//         }
//       }
//     },
//     Luigi: User {
//       username: 'Luigi'
//     },
//     Peach: User {
//       username: 'Peach',
//       moneySpent: 17.65 EUR,
//       listingsBought: { '0': [ [Listing], 15.00 GBP ] }
//     }
//   },
//   listings: [
//     Listing {
//       stage: 'sold',
//       seller.username: 'Mario',
//       title: 'Super Mushroom 3x',
//       description: 'Bundle of 3 super mushrooms, guaranteed to make you tall!',
//       startPrice: 15.00 EUR,
//       minBidTime: 6d 12h 0m 0s,
//       soldOn: 2022-02-07T03:19:55.188Z,
//       soldAt: 15.00 GBP,
//       soldTo.username: 'Peach'
//     },
//     Listing {
//       stage: 'cancelled',
//       seller.username: 'Mario',
//       title: 'Fire Flower',
//       description: 'One fire flower, makes you shoot fireballs!',
//       startPrice: undefined,
//       minBidTime: undefined,
//       cancelledOn: 2022-02-07T03:19:55.188Z
//     }
//   ]
// }

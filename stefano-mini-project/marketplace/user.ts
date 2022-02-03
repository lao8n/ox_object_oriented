import { CustomInspectParams, CustomInspectSymbol, logObject } from "./logging";

import { ActiveListing, DraftListing, Listing, ListingStages, SoldListing, CancelledListing } from "./listing";
import { Marketplace } from "./marketplace";
import { Currency, Numeraire, Price } from "./price";

/**
 * Basic user information.
 */
interface BasicUser {
    readonly username: string
    readonly marketplace: Marketplace
}

/**
 * Interface for sellers,
 * exposing money earned and listing management functionality of the underlying {@link User} class.
 */
export interface Seller extends BasicUser {
    readonly listings: {
        readonly [Stage in Listing["stage"]]: {
            readonly [id: number]: Listing & {readonly stage: Stage}
        }
    }
    readonly moneyEarned: Price
    draftListing(): DraftListing
    cloneListing(listing: Listing): DraftListing
}

/**
 * Interface for buyers,
 * exposing money spent, listings bought and bid management functionality of the underlying {@link User} class.
 */
export interface Buyer extends BasicUser {
    readonly activeBids: { readonly [id: number]: readonly [ActiveListing, Price] }
    readonly listingsBought: { readonly [id: number]: readonly [SoldListing, Price] }
    readonly moneySpent: Price
    placeBid(listing: ActiveListing, price: Price): boolean
    withdrawBid(listing: ActiveListing): boolean
}

/**
 * Utility type to remove readonly from properties of an object/dictionary.
 */
type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
};

/**
 * Utility type to remove optionality from properties of an object/dictionary.
 */
type Mandatory<T> = {
    [K in keyof T]-?: T[K]
};

/**
 * Utility function used to count entries in a dictionary.
 */
function countEntries(dict: {readonly [key: number|string]: unknown}): number {
    let count = 0;
    for (const key in dict){
        count += 1;
    }
    return count
}

/**
 * User class, implementing functionality for both buyers and sellers
 * (the same underlying user can play both roles,
 * being exposed alternatively through the {@link Buyer} or {@link Seller} interface).
 * 
 * Further to implementing the buyer/seller functionality, the class has a number of callbacks,
 * used by other components to notify the user of certain events (according to the publish-subscribe pattern).
 * As the {@link User} class is never exposed directly through the {@link Marketplace} facade,
 * these callbacks are not visible to the library users (even though misusing them wouldn't break anything).
 */
export class User implements Seller, Buyer {

    // ==== PROPERTIES & CONSTRUCTOR ====

    /**
     * Private mutable directory of listings for a buyer,
     * arranged first by stage (through a mapped type) and then by ID (through an index signature).
     * 
     * The mapped type variable `Stage` is used to statically restrict the {@link Listing} type to one of its members,
     * via the type intersection `Listing & {readonly stage: Stage}`:
     * 
     * - `Stage = "draft"` restricts {@link Listing} to {@link DraftListing}
     * - `Stage = "active"` restricts {@link Listing} to {@link ActiveListing}
     * - `Stage = "sold"` restricts {@link Listing} to {@link SoldListing}
     * - `Stage = "cancelled"` restricts {@link Listing} to {@link CancelledListing}
     */
    private _listings: {
        [Stage in Listing["stage"]]: {
            [id: number]: Listing & {readonly stage: Stage}
        }
    } = {
        "draft": {},
        "active": {},
        "sold": {},
        "cancelled": {},
    };

    /**
     * Private mutable directory of active bids for a buyer.
     */
    private _activeBids: Mutable<Buyer["activeBids"]> = {};

    /**
     * Private mutable directory of bought listings for a buyer.
     */
    private _listingsBought: Mutable<Buyer["listingsBought"]> = {};

    /**
     * Private mutable counter of money spent for a buyer.
     */
    private _moneySpent: number = 0.0;
    
    /**
     * Private mutable counter of money earned for a seller.
     */
    private _moneyEarned: number = 0.0;

    /**
     * Readonly view on the listing directory for a seller.
     */
    get listings(): Seller["listings"] {
        return this._listings;
    }

    /**
     * Readonly view on the active bids (pairs `(listing, price)`) for a buyer.
     */
    get activeBids(): Buyer["activeBids"] {
        return this._activeBids;
    }

    /**
     * Readonly view on the listings bought (pairs `(listing, price)`) by a buyer.
     */
    get listingsBought(): Buyer["listingsBought"] {
        return this._listingsBought;
    }

    /**
     * Readonly view on the money spent by a buyer.
     */
    get moneySpent(): Price {
        const { _moneySpent: value, currency } = this;
        return Price.new(value, currency);
    }

    /**
     * Readonly view on the money earned by a seller.
     */
    get moneyEarned(): Price {
        const { _moneyEarned: value, currency } = this;
        return Price.new(value, currency);
    }

    /**
     * Number of listings by a seller, currently for internal use.
     */
    protected get numListings(): { readonly [Stage in Listing["stage"]]: number } {
        const { listings } = this;
        const counts: { [Stage in Listing["stage"]]?: number } = {};
        for (const stage of ListingStages){
            counts[stage] = countEntries(listings[stage]);
        }
        return counts as Mandatory<typeof counts>;
    }

    /**
     * Number of active bids by a buyer, currently for internal use.
     */
    protected get numActiveBids(): number {
        return countEntries(this.activeBids);
    }

    /**
     * Number of listings bought by a buyer, currently for internal use.
     */
    protected get numListingsBought(): number {
        return countEntries(this.listingsBought);
    }

    constructor(public readonly username: string,
                public readonly marketplace: Marketplace,
                private readonly currency: Currency = Numeraire){
        // React-style callback binding:
        this.notifyBidPlaced = this.notifyBidPlaced.bind(this);
        this.notifyBidWithdrawn = this.notifyBidWithdrawn.bind(this);
        this.notifyListingStageChanged = this.notifyListingStageChanged.bind(this);
        // Note: the bound callbacks are stored as properties on the instance, not as methods in the class prototype.
    }

    // ==== SELLER FUNCTIONALITY ====

    /**
     * Creates a blank draft listing for the seller.
     */
    draftListing(): DraftListing {
        return this.marketplace.draftListing(this);
    }

    /**
     * Creates a new draft listing for the seller, using the given listing as blueprint.
     */
    cloneListing(listing: Listing): DraftListing {
        return this.marketplace.cloneListing(listing, this);
    }

    // ==== BUYER FUNCTIONALITY ====

    /**
     * Places a bid on a given listing.
     */
    placeBid(listing: ActiveListing, price: Price): boolean {
        return listing.bids.place(this, price);
    }

    /**
     * Withdraws the current bid on a given listing.
     */
    withdrawBid(listing: ActiveListing): boolean {
        return listing.bids.withdraw(this);
    }

    // ==== CALLBACKS ====

    /**
     * Callback to notify a buyer that a new bid has been placed onto a listing where they have an active bid.
     * This is called both when the seller themselves places a bid and when others place a bid.
     * 
     * Currently, it is used to manage the active bids of a seller,
     * but it could also be used to track money at stake in top bids and other bid-related functionality.
     */
    notifyBidPlaced(listing: ActiveListing): void {
        const { _activeBids: activeBids, currency: ownCurrency } = this;
        const { id: listingID, bids, stage } = listing;
        if (stage != "active"){
            throw new Error("Notified of bid placement, but listing is not active.");
        }
        const bid = bids.buyerBid(this);
        if (bid != undefined){
            activeBids[listingID] = [listing, bid.price];
            listing.onStageChange(this.notifyListingStageChanged);
        }
    }

    /**
     * Callback to notify a buyer that a bid has been withdrawn from a listing where they have an active bid.
     * This is called both when the seller themselves withdraws a bid and when others withdraw a bid.
     * 
     * Currently, it is used to manage the active bids of a seller,
     * but it could also be used to track money at stake in top bids and other bid-related functionality.
     */
    notifyBidWithdrawn(listing: ActiveListing): void {
        const { _activeBids: activeBids } = this;
        const { id: listingID, bids, stage } = listing;
        if (stage != "active"){
            throw new Error("Notified of bid withdrawal, but listing is not active.");
        }
        if (listingID in activeBids){
            const bid = bids.buyerBid(this);
            if (bid == undefined){
                delete activeBids[listingID];
                listing.unregisterOnStageChange(this.notifyListingStageChanged);
            }
        }
    }
    
    /**
     * Callback to notify a seller that a new draft listing has been created for them,
     * used by the {@link Marketplace} class.
     */
    notifyDraftCreated(listing: DraftListing): void {
        const { _listings: listings } = this;
        const {id: listingID, seller, stage } = listing;
        if (stage != "draft"){
            throw new Error("Notified of draft creation, but listing is not draft.");
        }
        if (seller == this && !(listingID in listings["draft"])){
            listings["draft"][listingID] = listing;
        }
    }

    /**
     * Callback to notify a user that a listing they are involved in (either as the seller,
     * or as a buyer with an active bid) has changed stage.
     * User to:
     * 
     * - automatically arrange seller listings by current stage
     * - automatically manage active bids for buyers, when listings are sold
     * - automatically update the money spent by buyers when a listing is sold having their bid as top bid
     * - automatically update the money earned by sellers when their listings are sold
     */
    notifyListingStageChanged(listing: Listing, prevStage: Listing["stage"]): void {
        const { _listings: listings, 
                _activeBids: activeBids,
                _listingsBought: listingsBought,
                currency: ownCurrency } = this;
        const { id: listingID, stage: newStage } = listing;
        // Manage seller's listing directory:
        if (listingID in listings[prevStage]){
            delete listings[prevStage][listingID];
            listings[newStage][listingID] = listing;
        }
        if (newStage == "sold"){
            // Manage buyers' active bids and update money spent for top bidder:
            if (listingID in activeBids){
                delete activeBids[listingID];
                if (listing.soldTo == this){
                    listingsBought[listingID] = [listing, listing.soldAt];
                    this._moneySpent += listing.soldAt.convertTo(ownCurrency).value;
                }
            }
            // Update seller's money earned:
            if (listing.seller == this){
                this._moneyEarned += listing.soldAt.convertTo(ownCurrency).value;
            }
        }
    }

    // ==== CUSTOM LOGGING ====

    /**
     * Custom representation for Node.js logging.
     * 
     * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
     */
     [CustomInspectSymbol](...customInspectParams: CustomInspectParams) {
        const { username, moneySpent, moneyEarned, activeBids, listingsBought, listings,
                numListings, numActiveBids, numListingsBought } = this;
        const [depth, options, ] = customInspectParams;
        if (depth < 0){
            return options.stylize(`[User ${username}]`, 'special');
        }
        const typeName = "User";
        // Always display username:
        const members: Record<string, unknown> = {
            username: username
        };
        // Only display quantitative members with a non-zero value:
        if (moneySpent.value > 0){
            members.moneySpent = moneySpent;
        }
        if (moneyEarned.value > 0){
            members.moneyEarned = moneyEarned;
        }
        for (const stage of ListingStages){
            if (numListings[stage] > 0){
                members[`listings.${stage}`] = listings[stage];
            }
        }
        if (numActiveBids > 0){
            members.activeBids = activeBids;
        }
        if (numListingsBought > 0){
            members.listingsBought = listingsBought;
        }
        return logObject(typeName, members, ...customInspectParams);
    }

};

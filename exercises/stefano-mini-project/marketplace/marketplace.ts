import { CustomInspectParams, CustomInspectSymbol, logObject } from "./logging";
import { Listing, DraftListing, ActiveListing } from "./listing";
import { Buyer, Seller, User } from "./user";
import { ListingQuery } from "./query"

// TODO: query language (fluent interface) via visitor
// TODO: money at stake (maybe?)

/**
 * This class acts as the entry point to the users and listings of a given marketplace:
 * all components and features can be accessed from its properties and methods
 * (an arrangement known as the facade pattern).
 */
export class Marketplace {

    // ==== PROPERTIES & CONSTRUCTOR ====

    /**
     * Static counter used to automatically generate a Unique ID (UID) for each marketplace. 
     */
    private static _nextID: number = 0;

    /**
     * Automatically generated UID for a marketplace instance.
     */
    readonly id: number

    /**
     * Private mutable array of listings for the marketplace.
     * 
     * Storing the listings as an array is a low-level implementation choice,
     * potentially subject to breaking change, so it is not exposed directly.
     * Instead, access to listings is implemented via:
     * 
     * - {@link Marketplace.listing}, providing access to a listing by ID
     * - {@link queryListings}, returning a dictionary of listings selected according to a query
     * - {@link visitListings}, applying a visitor function to all listings and returning a dictionary of results
     */
    private listings: Listing[] = [];

    /**
     * Efficiently returns the listing with given ID, or undefined if one does not exist.
     */
    listing(id: number): Listing|undefined {
        return this.listings[id];
    }

    /**
     * Implements the visitor pattern:
     * allows complex processing of listings without exposing their internal storage structure,
     * by applying a given function to all active listings (once per listing, but not in any guaranteed order).
     */
    visitListings(visitor: (listing: ActiveListing) => void): void{
        const { listings } = this;
        for (const id in listings){
            const listing = listings[id];
            if (listing?.stage == "active"){
                visitor(listing);
            }
        }
    }

    /**
     * Entry point for queries on active listings:
     * returns a {@link ListingQuery} object which can be progressively built into a query,
     * and then executed to select the listings (passing a suitable visitor to {@link Marketplace.visitListings}).
     * 
     * @example
     * 
     * const query = marketplace.selectListings
     *     .where(listing => listing.title.startsWith("Super"))
     *     .where(listing => listing.startPrice >= Price.new(10, "EUR"))
     *     .sortBy(listing => listing.bids.topBid?.price.valueOf() ?? 0, "descending");
     * const listings = [...query]; // query is executed at this time
     */
    get selectListings(): ListingQuery {
        return new ListingQuery(this);
    }

    /**
     * Private, mutable collection of users, efficiently accessible by username.
     * 
     * Note that users are created and stored as instances of the {@link User} class,
     * but are only ever exposed as objects of type {@link Seller} or {@link Buyer},
     * depending on the role required.
     * 
     * @see {@link Marketplace.seller} and {@link Marketplace.buyer}
     */
    private users: {
        [username: string]: User
    } = {};

    // /**
    //  * Exposes a readonly view on the marketplace listings,
    //  * making it possible to efficiently access the listings by ID.
    //  */
    // get listings(): readonly Listing[] {
    //     // Expose mutable internal array through readonly return type:
    //     return this._listings;
    // }

    constructor(){
        // Automatically generate UID for this instance:
        this.id = Marketplace._nextID++;
    }

    // ==== FACTORY PATTERN (listings) ====

    /**
     * Creates a new draft listing for a given seller.
     * 
     * There is an interplay of responsibilities for listing creation:
     * the {@link Listing.draft} function creates the listing itself,
     * but the marketplace is responsible for supplying the listing ID,
     * registering the listing internally, registering a stage-change callback
     * for the seller and notifying the seller of creation.
     * 
     * This scheme, where one class is responsible for creating instances of another
     * by supplying additional information (managed internally), is known as the factory pattern.
     * 
     * This method lives in {@link Marketplace} because of the factory pattern responsibilities,
     * but the literate way to create draft listings is to call the {@link Seller.draftListing} method
     * on a {@link Seller} instance.
     */
    draftListing(seller: Seller): DraftListing {
        const user = this.users[seller.username];
        if (user != seller){
            throw new Error(`Seller not in marketplace.`);
        }
        const id = this.listings.length;
        const listing = Listing.draft(seller, id);
        listing.onStageChange(user.notifyListingStageChanged);
        this.listings.push(listing);
        user.notifyDraftCreated(listing);
        return listing;
    }

    /**
     * Clones an existing listing for a given seller.
     *
     * Analogously to {@link Marketplace.draftListing}, this method is an example of factory pattern at play:
     * the cloned instance is managed by the marketplace, which supplies the ID and performs registration duties. 
     * 
     * This method lives in {@link Marketplace} because of the factory pattern responsibilities,
     * but the literate way to create draft listings is to call the {@link Seller.cloneListing} method
     * on a {@link Seller} instance.
     */
    cloneListing(listing: Listing, seller: Seller): DraftListing {
        const user = this.users[seller.username];
        if (user != seller){
            throw new Error(`Seller not in marketplace.`);
        }
        const id = this.listings.length;
        const newListing = listing.clone(seller, id);
        newListing.onStageChange(user.notifyListingStageChanged);
        this.listings.push(newListing);
        user.notifyDraftCreated(newListing);
        return newListing;
    }

    // ==== FACTORY+FLYWEIGHT PATTERN (users) ====

    /**
     * Returns the {@link User} instance with the given username,
     * creating one if necessary.
     * The {@link User} class is never exposed directly:
     * 
     * - {@link Marketplace.buyer} exposes the user as a {@link Buyer}
     * - {@link Marketplace.seller} exposes the user as a {@link Seller}
     * 
     * However, using a single underlying instance allows users to play both
     * roles without for additional coordination.
     * 
     * A unique instance exists for each username,
     * to ensure data consistency and avoid unnecessary memory allocation.
     * This is an example of the flyweight pattern.
     * 
     * The marketplace is responsible to make itself known to the user constructor,
     * and to register new user internally after creation.
     * This is an example of the factory pattern. 
     */
    private user(username: string): User{
        let user = this.users[username];
        if (user == undefined){
            user = new User(username, this);
            this.users[username] = user;
        }
        return user;
    }

    /**
     * Exposes the user by given username through the {@link Buyer} interface.
     * If a user with given username does not yet exist, one is created.
     * 
     * @see {@link Marketplace.user}
     */
    buyer(username: string): Buyer{
        return this.user(username);
    }

    /**
     * Exposes the user by given username through the {@link Seller} interface.
     * If a user with given username does not yet exist, one is created.
     * 
     * @see {@link Marketplace.user}
     */
    seller(username: string): Seller{
        return this.user(username);
    }
    
    // ==== CUSTOM LOGGING ====

    /**
     * Custom representation for Node.js logging.
     * 
     * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
     */
    [CustomInspectSymbol](...customInspectParams: CustomInspectParams) {
        const { users, listings } = this;
        const typeName = "Marketplace";
        const members = {
            users: users,
            listings: listings
        };
        return logObject(typeName, members, ...customInspectParams);
    }
}

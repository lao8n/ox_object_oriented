import { CustomInspectParams, CustomInspectSymbol, logObject } from "./logging";
import { Bids } from "./bids";
import { Price } from "./price";
import { Buyer, Seller } from "./user";

/**
 * `type Time`
 * 
 * Type alias for time:
 * 
 * - if used for time intervals (e.g. {@link IncompleteListing.minBidTime}),
 *   it is an absolute number of milliseconds;
 * - if used for absolute times (e.g. {@link ActiveListing.listedOn}),
 *   it is the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC
 * 
 * @see {@link Date.now}
*/
export type Time = number;

/**
 * 
 * `const Time`
 * 
 * Implements the companion object pattern:
 * mimics a `Time` class by defining an object with the same name as the {@link Time} type.
 * 
 * This object is used to expose some useful constants and functions:
 * in a hypothetical `Time` class, they would have been defined as static readonly properties and static methods.
 */
export const Time: {
    readonly second: Time,
    readonly minute: Time,
    readonly hour: Time,
    readonly day: Time,
    string(time: Time): string
    loggableObj(time: Time): object
} = {
    second: 1000,       // 1 second = 1000 milliseconds
    minute: 60*1000,    // 1 minute = 60 seconds
    hour: 60*60*1000,   // 1 hour = 60 minutes
    day: 24*60*60*1000, // 1 day = 24 hours
    string(time: Time): string {
        const days = Math.floor(time/Time.day);
        time -= days*Time.day;
        const hours = Math.floor(time/Time.hour);
        time -= hours*Time.hour;
        const minutes = Math.floor(time/Time.minute);
        time -= minutes*Time.minute;
        const seconds = Math.floor(time/Time.second);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    loggableObj(time: Time): object {
        return {
            [CustomInspectSymbol](...[,options,]: CustomInspectParams){
                return options.stylize(Time.string(time), 'number');
            }
        }
    }
};

/**
 * Type of {@link ConcreteListing} stages.
 * 
 * @see {@link AnyListing.stage} and {@link ConcreteListing.stage}
 */
export type ListingStage = "draft" | "active" | "sold" | "cancelled";

/**
 * Array of possible listing {@link ListingStage} values.
 */
export const ListingStages: readonly ListingStage[] = ["draft", "active", "sold", "cancelled"];

/**
 * Type of callbacks for listing stage change.
 */
type StageChangeCallback = (listing: Listing, prevStage: Listing["stage"]) => void;

/**
 * As part of the memento pattern, listings information can be restored from mementos,
 * immutable containers storing a snapshot of listing information at a given time.
 * 
 * @see {@link ConcreteListing.memento}
 */
export interface ListingMemento {
    readonly title?: string
    readonly startPrice?: Price
    readonly description?: string
    readonly minBidTime?: Time
}

/**
 * Utility type to remove readonly from properties of an object/dictionary.
 */
 type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
};

/**
 * Utility function to copy values from one memento onto another.
 * 
 * This is needed because, at the moment, there isn't a conditional assignment operator
 * which can deal with the assignment requirements of the `exactOptionalPropertyTypes` flag
 * (one rather good reason why you might not want to use this flag in practice).
 */
function copyMemento(from: ListingMemento, onto: Mutable<ListingMemento>): void {
    if ("title" in from){ onto.title = from.title; }
    if ("startPrice" in from){ onto.startPrice = from.startPrice; }
    if ("description" in from){ onto.description = from.description; }
    if ("minBidTime" in from){ onto.minBidTime = from.minBidTime; }
}

/**
 * Interface for an incomplete listing:
 * the property {@link ConcreteListing.id} is always set,
 * but all other listing properties are possibly missing.
 * 
 * Exposes the {@link ConcreteListing.clone} method.
 */
export interface IncompleteListing extends ListingMemento {
    readonly id: number
    readonly seller: Seller
    // Memento patter:
    readonly memento: ListingMemento
    // Prototype pattern:
    clone(seller: Seller, id: number): DraftListing
    onStageChange(callback: StageChangeCallback): void
    unregisterOnStageChange(callback: StageChangeCallback): void
}

const BasicListingProps = ["stage", "id", "seller", "title", "startPrice", "description", "minBidTime"] as const;

/**
 * Interface for a complete listing.
 * 
 * Extends {@link IncompleteListing} to guarantee that all listing properties are set.
 */
export interface CompleteListing extends IncompleteListing {
    readonly title: string
    readonly startPrice: Price
    readonly description: string
    readonly minBidTime: Time
}

/**
 * Interface for a draft listing:
 * this is always the first stage of a listing's lifecycle.
 * 
 * Extends {@link IncompleteListing}, further exposing:
 * 
 * - {@link ConcreteListing.stage}, set to the literal `"draft"`
 * 
 * Exposes builder pattern methods to set listing properties:
 * 
 * - {@link ConcreteListing.titled}, to set {@link ConcreteListing.title}
 * - {@link ConcreteListing.pricedAt}, to set {@link ConcreteListing.startPrice}
 * - {@link ConcreteListing.describedAs}, to set {@link ConcreteListing.description}
 * - {@link ConcreteListing.withMinBidTime}, to set {@link ConcreteListing.minBidTime}
 * 
 * Exposes state pattern methods for lifecycle management:
 * 
 * - {@link ConcreteListing.activate} to progress to the {@link ActiveListing} stage
 * - {@link ConcreteListing.cancel} to progress to the {@link CancelledListing} stage
 */
export interface DraftListing extends IncompleteListing {
    restore(memento: ListingMemento): void
    // Builder pattern:
    titled(title: string): this & {readonly title: string}
    pricedAt(startPrice: Price): this & {readonly startPrice: Price}
    describedAs(description: string): this & {readonly description: string}
    withMinBidTime(minBidTime: Time): this & {readonly minBidTime: Time}
    // State pattern:
    readonly stage: "draft"
    activate(): ActiveListing
    cancel(): CancelledListing
}

const DraftListingProps: readonly (keyof DraftListing)[] = BasicListingProps;

/**
 * 
 * Interface for an active listing:
 * this is the intermediate stage of a listing's lifecycle.
 * 
 * Extends {@link CompleteListing}, further exposing:
 * 
 * - {@link ConcreteListing.stage}, set to the literal `"active"`
 * - {@link ConcreteListing.bids}, providing access to the listing bids
 * - {@link ConcreteListing.listedOn}, the time at which the listing was activated
 * 
 * Exposes state pattern methods for lifecycle management:
 * 
 * - {@link ConcreteListing.sell} to progress to the {@link SoldListing} stage
 * - {@link ConcreteListing.cancel} to progress to the {@link CancelledListing} stage
 */
export interface ActiveListing extends CompleteListing {
    readonly bids: Bids
    readonly listedOn: Time
    // State pattern:
    readonly stage: "active"
    cancel(): CancelledListing
    sell(): SoldListing
}

const ActiveListingProps: readonly (keyof ActiveListing)[] = [...BasicListingProps, "bids", "listedOn"];

/**
 * Interface for a sold listing:
 * this is one of the two possible end stages of a listing's lifecycle.
 * 
 * Extends {@link CompleteListing}, further exposing:
 * 
 * - {@link ConcreteListing.stage}, set to the literal `"sold"`
 * - {@link ConcreteListing.soldTo}, the buyer to whom this listing was sold
 * - {@link ConcreteListing.soldAt}, the time at which this listing was sold
 */
export interface SoldListing extends CompleteListing {
    readonly soldAt: Price
    readonly soldTo: Buyer
    readonly soldOn: Time
    // State pattern:
    readonly stage: "sold"
}

const SoldListingProps: readonly (keyof SoldListing)[] = [...BasicListingProps, "soldAt", "soldTo", "soldOn"];

/**
 * Interface for a cancelled listing:
 * this is one of the two possible end stages of a listing's lifecycle.
 * 
 * Extends {@link CompleteListing}, further exposing:
 * 
 * - {@link ConcreteListing.stage}, set to the literal `"cancelled"`
 */
export interface CancelledListing extends CompleteListing {
    readonly cancelledOn: Time
    // State pattern:
    readonly stage: "cancelled"
}

const CancelledListingProps: readonly (keyof CancelledListing)[] = [...BasicListingProps, "cancelledOn"];

/**
 * `type Listing`
 * 
 * Exported type for listings: a tagged union type, with tag property {@link ConcreteListing.stage}.
 * 
 * To implement the state pattern, listings are never exposed directly through the {@link ConcreteListing} class,
 * but rather they are exposed through this type or one of the types in the tagged union, according to the stage.
 */
export type Listing = DraftListing | ActiveListing | SoldListing | CancelledListing;


/**
 * 
 * `const Listing`
 * 
 * Implements the companion object pattern:
 * mimics a `Listing` class by defining an object with the same name as the {@link Listing} type.
 * This object is used to expose the static method {@link ConcreteListing.draft} to the outside,
 * without having to expose the {@link ConcreteListing} class itself.
 */
export const Listing = {
    /**
     * Entry point in the listing lifecycle, returning a blank {@link DraftListing} object.
     */
    draft(seller: Seller, id: number): DraftListing{
        return ConcreteListing.draft(seller, id);
    }
}

/**
 * Class implementing all the logic for listings.
 * 
 * This is a complex class, showcasing a variety of patterns:
 * 
 * - memento pattern: to store and restore snapshots of listing properties (e.g. for an undo feature)
 * - prototype pattern: to create a new draft listing using the properties of an existing listing as blueprint
 * - builder pattern: to progressively set the listing properties, in a literate way
 * - state pattern: to only expose properties relevant to each listing stage (also enforces encapsulation)
 * - publish-subscribe pattern: to notify interested parties of listing stage changes
 * 
 * According to the state pattern, the type {@link ConcreteListing} is never used directly to manage listings,
 * which are instead exposed through the {@link AnyListing} tagged union type.
 * In particular, there is no need to bother with additional encapsulation logic for the listing properties:
 * they need to be set internally, so their implementation would require a private property with an associated public getter,
 * but the {@link AnyListing} only ever exposes them as readonly, making it safe to leave them as public read-write in {@link ConcreteListing}.
 * 
 * To enforce the state pattern, the constructor is private:
 * new listings are created by the static method {@link ConcreteListing.draft} or the instance method {@link ConcreteListing.clone},
 * which expose the newly minted instances via the {@link DraftListing} interface (putting them in draft state).
 */
class ConcreteListing {

    // ==== PROPERTIES & CONSTRUCTOR ====

    public static readonly maxTitleLength: number = 320; // Some constant, 

    // The properties are safely exposed via the Listing union type and its members
    stage: ListingStage = "draft";
    title?: string
    startPrice?: Price
    description?: string
    minBidTime?: Time
    listedOn?: Time
    bids?: Bids
    soldAt?: Price
    soldTo?: Buyer
    soldOn?: Time
    cancelledOn?: Time

    /**
     * Constructor is private, to enforce correct staging and encapsulation.
     * 
     * Note that responsibility for listing ID management does not lie with the {@link ConcreteListing} class,
     * but rather with the marketplace that creates the listings.
     */
    private constructor(public readonly seller: Seller,
                        public readonly id: number){}

    // ==== MEMENTO PATTERN ====

    /**
     * Part of the memento pattern, returns a snapshot of listing properties at this moment.
     * This snapshot (the "memento") can then be used to revert a draft listing to a previous
     * state of editing (e.g. see {@link ConcreteListing.restore}) or to copy an existing listing
     * information from one listing to another (e.g. see {@link ConcreteListing.clone}).
     */
    get memento(): ListingMemento {
        const memento: Mutable<ListingMemento> = {};
        copyMemento(this, memento);
        return memento;
    }

    /**
     * Sets/restores listing properties from a given memento; part of the memento pattern.
     */
    restore(memento: ListingMemento): void{
        // Check staging:
        if (this.stage != "draft"){
            throw new Error("Cannot set properties on non-draft listing.");
        }
        // Validate property values:
        const { title, startPrice, minBidTime } = memento;
        if (title != undefined){
            if (title.length == 0){
                throw new Error("Cannot set empty title");
            }
            const {maxTitleLength} = ConcreteListing;
            if (title.length > maxTitleLength){
                throw new Error(`Cannot set title longer than ${maxTitleLength} characters.`);
            }
        }
        if (startPrice != undefined && startPrice.value < 0){
            throw new RangeError("Cannot set negative start price.");
        }
        if (minBidTime != undefined && minBidTime <= 0){
            throw new RangeError("Minimum bidding time must be positive.");
        }
        // Assign property values:
        copyMemento(memento, this);
    }

    // ==== PROTOTYPE PATTERN ====

    /**
     * Clones a complete listing,
     * creating a draft with the same listing information and given new seller and id.
     * 
     * This is an example of the prototype pattern,
     * where new listings are created using existing listings as blueprints.
     */
    clone(seller: Seller, id: number): DraftListing {
        const listing = new ConcreteListing(seller, id);
        listing.restore(this.memento);
        return listing as DraftListing;
    }

    // ==== BUILDER PATTERN ====

    /**
     * Part of the implementation of the builder pattern,
     * where listing properties can be assigned in any order and after listing creation.
     * 
     * This method sets the {@link ConcreteListing.title} property,
     * returning `this` for method chaining (itself a form of the fluent interface pattern).
     * The return type indicates that the {@link ConcreteListing.title} property is set after this call.
     * 
     * @example
     * // listing: DraftListing & CompleteListing
     * const listing = Listing.draft(seller, id)
     *                         .titled("Pine-scented candles")
     *                         .pricedAt(Price.new(10.00, "EUR"))
     *                         .describedAs("A pack of 10 candles with pine scent.")
     *                         .withMinBidTime(1*day+8*hour+30*minute);
     * 
     */
    titled(title: string): this & {readonly title: string} {
        this.restore({title: title})
        return this as this & {readonly title: string}
    }

    /**
     * Part of the implementation of the builder pattern,
     * where listing properties can be assigned in any order and after listing creation.
     * 
     * This method sets the {@link ConcreteListing.startPrice} property,
     * returning `this` for method chaining (itself a form of the fluent interface pattern).
     * The return type indicates that the {@link ConcreteListing.startPrice} property is set after this call.
     * 
     * @see {@link ConcreteListing.titled} for an example.
     */
    pricedAt(startPrice: Price): this & {readonly startPrice: Price} {
        this.restore({startPrice: startPrice})
        return this as this & {readonly startPrice: Price};
    }

    /**
     * Part of the implementation of the builder pattern,
     * where listing properties can be assigned in any order and after listing creation.
     * 
     * This method sets the {@link ConcreteListing.description} property,
     * returning `this` for method chaining (itself a form of the fluent interface pattern).
     * The return type indicates that the {@link ConcreteListing.description} property is set after this call.
     * 
     * @see {@link ConcreteListing.titled} for an example.
     */
    describedAs(description: string): this & {readonly description: string} {
        this.restore({description: description})
        return this as this & {readonly description: Price};
    }

    /**
     * Part of the implementation of the builder pattern,
     * where listing properties can be assigned in any order and after listing creation.
     * 
     * This method sets the {@link ConcreteListing.minBidTime} property,
     * returning `this` for method chaining (itself a form of the fluent interface pattern).
     * The return type indicates that the {@link ConcreteListing.minBidTime} property is set after this call.
     * 
     * @see {@link ConcreteListing.titled} for an example.
     */
    withMinBidTime(minBidTime: Time): this & {readonly minBidTime: Time} {
        this.restore({minBidTime: minBidTime})
        return this as this & {readonly minBidTime: Time};
    } 

    // ==== STATE PATTERN ====

    /**
     * Part of the state pattern, this is the entry point in the listing lifecycle:
     * a blank {@link ConcreteListing} instance is created and returned through the {@link DraftListing} interface.
     * 
     * @see {@link ConcreteListing.clone} for an alternative ways to create a new listing,
     * by copying the properties of an existing one.
     */
    static draft(seller: Seller, id: number): DraftListing{
        return new ConcreteListing(seller, id) as DraftListing;
    }

    /**
     * Part of the state pattern, makes a listing transition from draft to active.
     * Returns the same underlying {@link ConcreteListing} object, but through the {@link ActiveListing} interface.
     * 
     * @throws {@link Error}, unless the listing properties `title`, `startPrice`, `description` and `minBidTime` are all set. 
     */
    activate(): ActiveListing {
        const {stage} = this;
        // Runtime staging check (in case the listing is manipulated through a dated interface):
        if (stage != "draft"){
            // this error does not occur ordinarily, so it is not documented
            throw new TypeError("Cannot activate listing: stage is not 'draft'.");
        }
        // Ensure that all properties are defined (promised by 'ActiveListing' interface):
        const props = ["title", "startPrice", "description", "minBidTime"] as const;
        for (const prop of props){
            if (this[prop] == undefined){
                throw new Error(`Cannot activate listing: ${prop} is undefined.`);
            }
        }
        // Activate the listing and expose through 'ActiveListing' interface:
        this.stage = "active";
        this.listedOn = Date.now();
        this.bids = new Bids(this as ActiveListing);
        this.stageChangeCallbacks.forEach((callback) => callback(this as ActiveListing, stage));
        return this as ActiveListing;
    }

    /**
     * Part of the state pattern, makes a listing transition from draft or active to cancelled.
     * Returns the same underlying {@link ConcreteListing} object, but through the {@link CancelledListing} interface.
     * 
     * @throws {@link Error}, if there are any bids on the listing.
     */
    cancel(): CancelledListing {
        const {stage, bids} = this;
        // Runtime staging check:
        if (stage != "draft" && stage != "active"){
            // this error does not occur ordinarily, so it is not documented
            throw new TypeError("Cannot activate listing: stage is neither 'draft' nor 'active'.");
        }
        // Ensure that there are no bids before cancelling:
        const topBid = bids?.topBid;
        if (topBid != undefined){
            throw new Error("Cannot cancel a listing with bids on it.");
        } 
        // Cancel the listing and expose through 'CancelledListing' interface:
        this.stage = "cancelled";
        this.cancelledOn = Date.now();
        this.stageChangeCallbacks.forEach((callback) => callback(this as CancelledListing, stage));
        return this as CancelledListing;
    }

    /**
     * Part of the state pattern, makes a listing transition from active to sold.
     * Returns the same underlying {@link ConcreteListing} object, but through the {@link SoldListing} interface.
     * 
     * @throws {@link Error}, if there are no bids on the listing.
     * @throws {@link Error}, if the minimum bidding time has not yet elapsed.
     */
    sell(): SoldListing {
        const {stage, bids, listedOn} = this;
        // Runtime staging check:
        if (stage != "active"){
            // this error does not occur ordinarily, so it is not documented
            throw new TypeError("Cannot activate listing: stage is not 'active'.");
        }
        // Ensure that there are bids before selling:
        const topBid = bids?.topBid;
        if (topBid == undefined){
            throw new Error("Cannot sell a listing without bids on it.");
        }
        // Ensure that the minimum bidding time has elapsed:
        const soldOn = Date.now();
        const bidTime = soldOn-listedOn!;
        if (bidTime < this.minBidTime!){
            throw new Error("Cannot sell, minimum bidding time not yet elapsed.");
        }
        // Sell the listing and expose through 'SoldListing' interface:
        this.stage = "sold";
        this.soldAt = topBid.price;
        this.soldTo = topBid.buyer;
        this.soldOn = soldOn;
        this.stageChangeCallbacks.forEach((callback) => callback(this as SoldListing, stage));
        return this as SoldListing;
    }

    // ==== PUBLISH-SUBSCRIBE PATTERN ====

    /**
     * Set storing callbacks for listing stage change events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    private stageChangeCallbacks: Set<StageChangeCallback> = new Set();

    /**
     * Implements the publish-subscribe pattern for listing stage change events:
     * parties interested in listening to stage changes for this listing can register
     * a callback using this method, which will be invoked every time the stage changes.
     */
    onStageChange(callback: StageChangeCallback): void {
        this.stageChangeCallbacks.add(callback);
    }

    /**
     * Method to unregister callbacks for listing stage change events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    unregisterOnStageChange(callback: StageChangeCallback): void {
        this.stageChangeCallbacks.delete(callback);
    }

    // ==== CUSTOM LOGGING ====

    /**
     * Custom representation for Node.js logging.
     * 
     * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
     */
    [CustomInspectSymbol](...customInspectParams: CustomInspectParams) {
        const { stage, id, seller, title, description, minBidTime, startPrice} = this;
        const typeName = "Listing";
        const members: Record<string, unknown> = {
            stage: stage,
            "seller.username": seller.username,
            title: title,
            description: description,
            startPrice: startPrice,
            minBidTime: minBidTime == undefined ? undefined : Time.loggableObj(minBidTime)
        };
        if (this.stage == "active"){
            const {bids, listedOn } = this as ActiveListing;
            members["bids.topBid"] = bids.topBid;
            members["listedOn"] = new Date(listedOn);            
        }
        else if (this.stage == "cancelled"){
            const { cancelledOn } = this as CancelledListing;
            members["cancelledOn"] = new Date(cancelledOn);
        }
        else if (this.stage == "sold"){
            const { soldOn, soldAt, soldTo } = this as SoldListing;
            members["soldOn"] = new Date(soldOn);
            members["soldAt"] = soldAt;
            members["soldTo.username"] = soldTo.username;            
        }
        return logObject(typeName, members, ...customInspectParams);
    }
}

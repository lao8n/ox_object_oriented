import { ActiveListing, Listing } from "./listing";
import { Marketplace } from "./marketplace";

/**
 * Type for predicates passed to {@link ListingQuery.where}.
 */
type Predicate = (listing: ActiveListing) => boolean;

/**
 * Type for sorting order values.
 */
type SortOrder = "ascending"|"descending";

/**
 * Class to progressively construct active listing queries,
 * using the builder pattern.
 * 
 * @see {@link Marketplace.selectListings}
 * 
 * @example
 * 
 * const query = marketplace.selectListings
 *     .where(listing => listing.title.startsWith("Super"))
 *     .where(listing => listing.startPrice >= Price.new(10, "EUR"))
 *     .sortBy(listing => listing.bids.topBid?.price.valueOf() ?? 0, "descending");
 * const listings = [...query]; // query is executed at this time
 */
export class ListingQuery {

    /**
     * Private mutable array of predicates.
     */
    private readonly _predicates: Predicate[] = [];
    private _sortKey?: (listing: Listing) => number;
    private _sortOrder: SortOrder = "ascending";
    private result?: ActiveListing[];

    /**
     * Readonly view on query predicates (passed to {@link ListingQuery.where}).
     */
    get predicates(): readonly Predicate[] {
        return this._predicates;
    }

    /**
     * Readonly view on query sort key (passed to {@link ListingQuery.sortBy}).
     */
    get sortKey(): ((listing: ActiveListing) => number)|undefined {
        return this._sortKey;
    }

    /**
     * Readonly view on query sort order (passed to {@link ListingQuery.sortBy}).
     */
    get sortOrder(): SortOrder {
        return this._sortOrder;
    }

    constructor(public readonly marketplace: Marketplace){}

    /**
     * Adds one more predicate to be used when filtering the listings.
     */
    where(predicate: Predicate): this {
        const { result, _predicates: predicates } = this;
        if (result != undefined){
            this.result = result.filter(predicate);
        }
        predicates.push(predicate);
        return this;
    }

    /**
     * Sets a sort key and order for the returned listings.
     */
    sortBy(sortKey: (listing: ActiveListing) => number, sortOrder: SortOrder = "ascending"): this {
        const { result } = this;
        if (result != undefined){
            const sign = sortOrder == "ascending" ? +1 : -1;
            this.result = result.sort((a, b) => sign*(sortKey(a)-sortKey(b)));
        }
        this._sortKey = sortKey;
        this._sortOrder = sortOrder;
        return this;
    }
    
    /**
     * Executes the query, storing the resulting listings internally and returning them. 
     */
    execute(): readonly ActiveListing[] {
        let { _predicates: predicates, marketplace, sortKey } = this;
        if (this.result == undefined) {
            let result = new Array<ActiveListing>();
            const visitor = (listing: ActiveListing) => {
                let selected = true;
                for (const predicate of predicates){
                    if (!predicate(listing)){
                        selected = false;
                        break;
                    }
                }
                if (selected) {
                    result.push(listing);
                }
            };
            marketplace.visitListings(visitor);
            if (sortKey != undefined) {
                const sign = this.sortOrder == "ascending" ? +1 : -1;
                result = result.sort((a, b) => sign*(sortKey!(a)-sortKey!(b)));
            }
            this.result = result;
        }
        return this.result;
    }

    /**
     * Returns an iterator over the query results.
     * If the query has not yet been executed, executes it first
     * (a good example of the lazy evaluation pattern).
     * 
     * @example
     * 
     * const query = ...; // created, not executed yet.
     * 
     * // usage version 1 - iterate over query results
     * for (const listing of query){ // query executed once, results iterated over
     *     // do stuff with listing
     * }
     * 
     * // usage version 2 - spread into an array
     * const listings = [...query]; // query not executed again, results re-used
     */
    *[Symbol.iterator](): Iterator<ActiveListing> {
        for (const listing of this.execute()){
            yield listing;
        }
    }
}

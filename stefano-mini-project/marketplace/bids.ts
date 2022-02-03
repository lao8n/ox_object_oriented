import { ActiveListing, Listing } from "./listing";
import { Price } from "./price";
import { Stack } from "./stack";
import { Buyer, User } from "./user";

/**
 * Lightweight, immutable type to carry around bid data.
 */
export type Bid = {
    readonly buyer: Buyer
    readonly price: Price
};

/**
 * Interface used internally by {@link Bids},
 * allowing an additional `withdrawn` flag that mark bids for deletion.
 */
interface WithdrawableBid extends Bid{
    withdrawn?: true
}

type BidCallback = (listing: Listing, bid: Bid) => void;

/**
 * A stack of bids, ordered with the largest bid on top.
 */
export class Bids {
    /**
     * Internal stack containing the bids.
     * 
     * We don't use inheritance to implement {@link Bids} from {@link Stack}, but rather composition:
     * 
     * - stacks of bids does not support pop
     * - pushing a bid on top is conditional on its price being larger than the one of the next bid
     */
    private stack: Stack<WithdrawableBid> = new Stack();

    /**
     * Internal dictionary, used to keep track of the unique non-withdrawn bid for each buyer (if any).
     */
    private userBids: {
        [username: string]: WithdrawableBid
    } = {};

    /**
     * Constructor for a bid stack, tying it to a specific listing.
     */
    constructor(public readonly listing: ActiveListing){
        // Hide private properties from logging:
        for (const prop of ["_listings", "_users"]){
            Object.defineProperty(this, prop, {enumerable: false});
        }
    }

    /**
     * Returns the top bid, or `undefined` if there are no bids.
     * 
     * Implements the lazy evaluation pattern (also known as lazy initialisation):
     * withdrawn bids are popped from the top of the stack until a non-withdrawn one is found
     * (which is then the current top bid), or until the stack is empty (in which case there are no bids).
     */
    get topBid(): Bid|undefined {
        const { stack } = this;
        while (stack.notEmpty()){
            const topBid = stack.top;
            if (!topBid.withdrawn){
                // Return the top non-withdrawn bid: 
                return topBid;
            }
            // Pop the top bid, because it is withdrawn:
            stack.pop();
        }
        // There were no (non-withdrawn) bids:
        return undefined;
    }

    /**
     * Returns the bid of a given buyer, or `undefined` if the buyer did not bid.
     */
    buyerBid(buyer: Buyer): Bid|undefined {
        const bid = this.userBids[buyer.username];
        if (bid != undefined && !bid.withdrawn){
            return bid;
        }
        return undefined;
    }

    /**
     * Places a new bid for a buyer, if it is larger than the current top bid.
     * Returns `true` if the bid was successfully placed, `false` otherwise.
     */
    place(buyer: Buyer, price: Price): boolean {
        const { stack, listing, topBid } = this;
        if (listing.stage != "active"){
            throw new Error("Can only place bids on active listings.");
        }
        if (topBid == undefined){
            // First bid must be at least the listing start price:
            if (price < listing.startPrice){ return false; }
        }
        else{
            // Successive bids must exceed the previous top bid:
            if (price <= topBid.price){ return false; }
        }
        // Widthdraw previous buyer bid (if any):
        const prevBid = this.userBids[buyer.username];
        if (prevBid != undefined){
            prevBid.withdrawn = true;
        }
        // Push new bid on top of the stack:
        const bid = {buyer: buyer, price: price};
        stack.push(bid);
        // Associate new bid to buyer and notify buyer through User interface:
        this.userBids[buyer.username] = bid;
        (buyer as User).notifyBidPlaced(listing);
        for (const callback of this.bidPlacedCallbacks){
            callback(listing, bid);
        }
        return true;
    }

    /**
     * Widthdraws the current bid of a buyer.
     * Returns `true` if there was a bid to withdraw, `false` otherwise.
     */
    withdraw(buyer: Buyer): boolean {
        const { listing, userBids} = this;
        if (listing.stage != "active"){
            throw new Error("Can only place widthdraw bids on active listings.");
        }
        const bid = userBids[buyer.username];
        if (bid == undefined){
            return false;
        }
        // Widthdraw bid and notify buyer through user User interface:
        bid.withdrawn = true;
        (buyer as User).notifyBidWithdrawn(listing);
        for (const callback of this.bidWithdrawnCallbacks){
            callback(listing, bid);
        }
        return true;
    }

    /**
     * Set storing callbacks for bid placing events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    private bidPlacedCallbacks: Set<BidCallback> = new Set();
    
    /**
     * Implements the publish-subscribe pattern for bid placing events:
     * parties interested in listening to bids being placed can register
     * a callback using this method, which will be invoked every time a new bid is placed.
     */
    onBidPlaced(callback: BidCallback): void {
        this.bidPlacedCallbacks.add(callback);
    }

    /**
     * Method to unregister callbacks for bid placing events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    unregisterOnBidPlaced(callback: BidCallback): void {
        this.bidPlacedCallbacks.delete(callback);
    }

    /**
     * Set storing callbacks for bid withdrawal events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    private bidWithdrawnCallbacks: Set<BidCallback> = new Set();
    
    /**
     * Implements the publish-subscribe pattern for bid withdrawal events:
     * parties interested in listening to bids being withdrawn can register
     * a callback using this method, which will be invoked every time a bid is withdrawn.
     */
    onBidWithdrawn(callback: BidCallback): void {
        this.bidWithdrawnCallbacks.add(callback);
    }

    /**
     * Method to unregister callbacks for bid withdrawal events.
     * 
     * @see {@link ConcreteListing.onStageChange}
     */
    unregisterOnBidWithdrawn(callback: BidCallback): void {
        this.bidWithdrawnCallbacks.delete(callback);
    }

}
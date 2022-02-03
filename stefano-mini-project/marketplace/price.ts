import { CustomInspectParams, CustomInspectSymbol } from "./logging";

/** Type of supported currencies. */
export type Currency = "EUR" | "GBP" | "USD" | "JPY";

/** Numeraire currency: prices are converted to this before comparison. */
export const Numeraire: Currency = "EUR";

/**
 * Manages foreign exchange rates, for currency conversion in prices.
 * 
 * This is just a mock implementation: in reality,
 * it would connect to an online forex service and manage the requests.
 */
class Forex {

    /**
     * The {@link Forex} class implements the **singleton pattern**:
     * a single instance is used throughout the program,
     * disallowing multiple connections to the service and ensuring consistency.
     * 
     * This private static property stores the global instance of the class.
    */
    private static instance?: Forex

    /** 
     * According the singleton pattern, the constructor is private:
     * instances cannot be constructed from the outside.
     * Instead, users must call {@link Forex.service} to retrieve the instance.
    */
    private constructor(){
        // In a real implementation, this would establish the connection to the forex service API.
    }

    /**
     * Returns the unique global instance of this class, following the singleton pattern.
     */
    static get service(): Forex {
        // Collect the global instance, if it exists:
        let instance = Forex.instance;
        if (instance == undefined){
            // If the instance does not yet exist, create it and store it:
            instance = new Forex();
            Forex.instance = instance;
        }
        // Return the global instance
        return instance;
    }

    /** Converts a value from a currency to another. */
    convert(value: number, from: Currency, to: Currency): number {
        const FixedEURBasedQuote = {
            // In reality, the rates would be loaded from the forex service
            "EUR": 1, "GBP": 0.85, "JPY": 128.54, "USD": 1.15
        };
        const base2EUR = 1/FixedEURBasedQuote[from];
        const EUR2quote = FixedEURBasedQuote[to];
        return value*base2EUR*EUR2quote;
    }
}

/**
 * A price, inclusive of currency.
 * This is low-level data, but is implemented as a class because it includes significant functionality.
 * 
 * Prices implement the **flyweight patter**:
 * they are immutable, with a unique instance for each given `(value, currency)` pair.
 * As a consequence, prices can be meaningfully compared for equality.
 *
 */
export class Price {
    
    /**
     * Prices implement the **flyweight patter**:
     * they are immutable, with a unique instance for each given `(value, currency)` pair.
     * 
     * This property stores existing instances of this class.
     */
    private static instances: {
        [flyweightKey: string]: Price
    } = {};

    /** 
     * According the flyweight pattern, the constructor is private:
     * instances cannot be constructed from the outside.
     * Instead, users must call the static method {@link Price.new} to obtain an instance.
    */
    private constructor(public readonly value: number,
                        public readonly currency: Currency = Numeraire){
        if (!Number.isFinite(value)){
            throw new RangeError(`Invalid price: ${value} ${currency}`);
        }
    }

    /**
     * Given a value and a currency, this static method returns the corresponding {@link Price} instance.
     * According to the flyweight pattern, a new instance is created only when necessary:
     * if an instance for a given `(value, price)` pair already exists, it is returned.
    */
    static new(value: number, currency: Currency = Numeraire){
        const flyweightKey = `${value} ${currency}`;
        // Collect the instance corresponding to the (value, currency) pair, if one exists:
        let instance = Price.instances[flyweightKey];
        if (instance == undefined){
            // If the instance does not exist yet, create it and store it:
            instance = new Price(value, currency);
            Price.instances[flyweightKey] = instance;
        }
        // Return the price instance:
        return instance;
    }

    /** Converts the price to another currency. */
    convertTo(newCurrency: Currency): Price{
        // We destructure at the start, for added clarity:
        const {value, currency} = this; 
        if (currency == newCurrency){
            // Price.new would return 'this', so we return it directly:
            return this;
        }
        const newValue = Forex.service.convert(value, currency, newCurrency);
        return Price.new(newValue, currency);
    }

    /**
     * String representation of the price, as value and currency.
     * 
     * @example
     * console.log(Price.new(15.5, "EUR")) // 15.5 EUR
    */
    toString(): string {
        const {value, currency} = this;
        return `${value} ${currency}`;
    }

    /**
     * Value of the price in the {@link Numeraire} currency,
     * used when comparing prices for inequality.
     * 
     * Note that equality comparison don't automatically convert currency:
     * two prices are equal if they have both equal value and equal currency.
     * 
     * @example
     * Price.new(15.5, "EUR") <= Price.new(2000, "JPY") // true at rate of 1 EUR = 128.688 JPY
     * 
     */
    valueOf(): number{
        // 'Price.convertTo' returns a 'Price', but we only care about the value:
        const {value} = this.convertTo(Numeraire); // delegate conversion to 'Price.convertTo' method
        return value;
    }

    /**
     * Custom representation for Node.js logging.
     * 
     * See https://nodejs.org/api/util.html#custom-inspection-functions-on-objects
     */
    [CustomInspectSymbol](...[, options, ]: CustomInspectParams) {
        const { value, currency } = this;
        const valueStr = currency == "JPY" ? `${Math.floor(value)}` : value.toFixed(2);
        return options.stylize(`${valueStr} ${currency}`, "number");
    }
}

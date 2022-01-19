class Listing {
    private _id: bigint;
    private _title: string;
    private _description: string;
    private _minBidTime: Date;
    private _state: ""

    constructor(title? : string, startingPrice? : number, description?: string, minBidTime?: Date){
        this._id = 1n; // make unique
        this.title = title;
        this._description = description;

        
    }

    set title(title : string){
        if(title.length == 0){
            throw RangeError("cannot have empty title");
        }
        if(title.length > 50){
            throw RangeError("cannot have title longer than 50 characters");
        }
        this._title = title;
    }

    setActive()

}
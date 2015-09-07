class ProductCounter {

    private _currentValue:number;
    private _multiplier:number;


    constructor(aMultiplier:number) {
        this._currentValue = 1;
        if (aMultiplier == null) {
            this._multiplier == 1;
        }
        else {
            this._multiplier = aMultiplier;
        }
    }


    public incrementValue():void {
        this._currentValue = this._currentValue + (1 * this._multiplier);
    }

    public declineValue():void {
        console.log("declineValue currentValue: " + this._currentValue);
        var tempValue = this._currentValue;
        this._currentValue = this._currentValue - (1 * this._multiplier);
        console.log("declineValue newValue: " + this._currentValue);
        if(this._currentValue <= 0){
            this._currentValue = tempValue;
        }
    }

    public getCurrentValue():number {
        return this._currentValue;
    }

}
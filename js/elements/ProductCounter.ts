class ProductCounter {

    private _currentValue:number;
    private _multiplier:number;


    constructor(aMultiplier:number) {
        this._currentValue = 1;
        if (aMultiplier == null) {
            this._multiplier = 1;
        }
        else {
            this._multiplier = aMultiplier;
        }
    }


    public incrementValue(aCurrentValue: number):void {
        this._currentValue = aCurrentValue + (this._multiplier);
    }

    public declineValue(aCurrentValue: number):void {
        var tempValue = aCurrentValue;
        this._currentValue = aCurrentValue - (this._multiplier);
        if(this._currentValue <= 0){
            this._currentValue = tempValue;
        }
    }

    public getCurrentValue():number {
        return this._currentValue;
    }

}
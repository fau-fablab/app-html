class Utils {

    constructor() {

    }

    public isInteger(value:String):boolean {
        for (var index = 0; index < value.length; index++) {
            if (value[index].search(/[0-9]/) == -1) {
                return false;
            }
        }
        return true;
    }

    public isPositivNumber(aValue:String):boolean{
        var result = Number(aValue);
        if(result.toString() != "NaN"){
            if(result >= 1){
                return true;
            }
        }
        return false;
    }

    public isValidRoundingValue(aValue: number, aRounding:number): boolean{
        console.log("Mod: " + aValue % aRounding);
        return (aValue % aRounding) == 0;

    }

    public replaceAllCommaToDots(aValue: string):string{
       return aValue.replace(/,/g,".");
    }





}
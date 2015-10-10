class Utils {

    constructor() {

    }

    public getRandomInteger(){
        return Math.floor((Math.random() * 1000000) + 1); ;
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

    public convertToHoursAndMinuteString(aValue: number){
        var hours = Math.floor(aValue/60);
        var minutes = aValue - (hours * 60);
        if(hours == 0){
            return minutes + " m";
        }
        return hours + " h " + minutes + " m"
    }

    public getUrlVars()
    {
        var vars = [];
        var queryString:string = window.location.href.slice(window.location.href.indexOf('?') + 1);
        queryString = queryString.replace(window.location.hash, '');
        var hashes = queryString.split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            var elem = hashes[i].split('=');
            vars.push(elem[0]);
            vars[elem[0]] = elem[1];
        }
        return vars;
    }
}
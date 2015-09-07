class Utils {

    constructor() {

    }

    public isNumber(value:String):boolean {
        for (var index = 0; index < value.length; index++) {
            if (value[index].search(/[0-9]/) == -1) {
                return false;
            }
        }
        return true;
    }

}
class Formatter {

    constructor() {
    }

    public formatNumberToPrice(aNumber:any):string {
        var number = aNumber.toFixed(2) + '';
        var splitedValue = number.split('.');
        var firstValue = splitedValue[0];
        var secondValue = splitedValue.length > 1 ? '.' + splitedValue[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(firstValue)) {
            firstValue = firstValue.replace(rgx, '$1' + ',' + '$2');
        }
        return firstValue + secondValue;
    }


}

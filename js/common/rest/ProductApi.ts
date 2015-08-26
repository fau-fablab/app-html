/// <reference path="../model/Product.ts" />
/// <reference path="../../RestClient.ts"/>

class ProductApi {

    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
        console.log("Wurde erstellt");
    }

    public findAll(aLimit:number, aOffset:number):Array<common.Product> {
        this._restClient.getRequest("/products?offset=" + aOffset + "&limit=" + aLimit,this.findAllCallback);


        return null;
    }

    private findAllCallback(records:any): Array<common.Product>{
        console.log(records);
    }

    public findById(aId:number):common.Product {
        return null;
    }

    public findByName(aName:string, aLimit:number, aOffset:number):Array<common.Product> {
        return null;
    }

    public findByCategory(aName:string, aLimit:number, aOffset:number):Array<common.Product> {
        return null;
    }

    public findAllNames():Array<string> {
        return null;
    }
}

/// <reference path="../model/Product.ts" />
/// <reference path="../../util/RestClient.ts"/>

class ProductApi {

    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
    }

    public findAll(aLimit:number, aOffset:number,callback: (value: any) => any):void {
        this._restClient.requestGET("/products?offset=" + aOffset + "&limit=" + aLimit,callback);
    }

    public findById(aId:string,callback: (value: any) => any):void {
        this._restClient.requestGET("/products/find/id?search=" + aId,callback);
    }

    public findByName(aName:string, aLimit:number, aOffset:number,callback: (value: any) => any):void {
        this._restClient.requestGET("/products/find/name?search=" + aName + "&limit=" + aLimit + "&offset=" + aOffset,callback);
    }

    public findByCategory(aName:string, aLimit:number, aOffset:number,callback: (value: any) => any):void {
        this._restClient.requestGET("/products/find/category?search=" + aName + "&limit=" + aLimit + "&offset=" + aOffset,callback);
    }

    public findAllNames(callback: (value: any) => any):void {
        this._restClient.requestGET("/products/names",callback);
    }
}

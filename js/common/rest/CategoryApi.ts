/// <reference path="../../util/RestClient.ts"/>

class CategoryApi {

    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
    }

    public findAll(callback: (value: any) => any):void {
        this._restClient.requestGET("/categories/find/all",callback);
    }

    public getAutocompletions(callback: (value: any) => any):void{
        this._restClient.requestGET("/categories/autocompletions",callback);
    }


}

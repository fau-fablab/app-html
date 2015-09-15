/// <reference path="../../util/RestClient.ts"/>
class DataApi{

    private _restClient: RestClient;

    constructor(){
        this._restClient = new RestClient();
    }

    public getMailAdresses(callback: (value: any) => any): void{
        this._restClient.requestGET("/data/mail-addresses",callback);
    }
}
/// <reference path="../model/Product.ts" />
/// <reference path="../../util/RestClient.ts"/>

class ContactApi {

    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
    }

    public sendFeedback(aMessage:string,callback: (value: any) => any):void {
        this._restClient.requestGET("/mail/feedback?=" + aMessage,callback);
    }

    public sendErrorMessage(aId:number,aMessage:string,callback: (value: any) => any):void {
        this._restClient.requestGET("/mail/error?id=" + aId + "&msg=" + aMessage,callback);
    }
}

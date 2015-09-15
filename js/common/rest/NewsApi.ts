/// <reference path="../../util/RestClient.ts"/>
class NewsApi{

    private _restClient: RestClient;

    constructor(){
        this._restClient = new RestClient();
    }

    public findById(aValue:number,callback: (value: any) => any):void{
        this._restClient.requestGET("/news/"+aValue,callback);
    }

    public find(aOffset:number,aLimit:number,callback: (value: any) => any):void{
        this._restClient.requestGET("/news?offset="+aOffset+"&limit="+aLimit,callback);
    }

    public findAll(callback: (value: any) => any):void{
        this._restClient.requestGET("/news/all",callback);
    }

    public findNewsSince(aValue:number,callback: (value: any) => any):void{
        this._restClient.requestGET("/all/"+aValue,callback);
    }

    public lastUpdate(callback: (value: any) => any):void{
        this._restClient.requestGET("/news/timestamp",callback);
    }
}
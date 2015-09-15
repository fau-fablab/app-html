/// <reference path="../../util/RestClient.ts"/>
class DrupalApi{

    private _restClient: RestClient;

    constructor(){
        this._restClient = new RestClient();
    }

    public findAllTools(callback: (value: any) => any): void{
        this._restClient.requestGET("/drupal/tools",callback);
    }

    public findToolById(aValue:number,callback: (value: any) => any):void{
        this._restClient.requestGET("/drupal/tools/"+aValue,callback);
    }
}
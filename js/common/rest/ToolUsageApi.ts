/// <reference path="../../util/RestClient.ts"/>
class ToolUsageApi{

    private _restClient: RestClient;

    constructor(){
        this._restClient = new RestClient();
    }

    public getUsageForTool(aValue:number,callback: (value: any) => any): void{
        this._restClient.requestGET("/toolUsage/"+aValue,callback);
    }

    public getUsage(aToolId:number,aUsage:number,callback: (value: any) => any): void{
        this._restClient.requestGET("/toolUsage/"+aToolId+"/"+aUsage,callback);
    }
    /*
    public addUsage(aUser:string,aUsage:number,callback: (value: any) => any): void{
        this._restClient.requestGET("/toolUsage/"+aToolId+"/"+aUsage,callback);
    }

    public removeUsage

    public removeUsagesForTool

    public moveAfter
    */
}
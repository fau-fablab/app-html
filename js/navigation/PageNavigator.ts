
class PageNavigator{

    private static _defaultHashString: string = "#news";
    private _content: HTMLDivElement;
    private _lastHashString: string;

    private _state: string;

    // aContent: HTMLDivElement
    constructor(state:string){
        //this._content = aContent;
        this._lastHashString = "";
        this._state = state;
    }

    public reloadPage(newHashString: string):void{

    }

    public isPageChanged(newHashString: string):boolean{
        return newHashString != this._lastHashString;

    }

    public showState():void{
        console.log()
    }



}
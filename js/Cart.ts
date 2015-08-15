///  <reference path="CartStatus.ts"/>
///  <reference path="CartEntry.ts"/>
class Cart{
    private _cartCode:string;
    private _status:CartStatus;
    private _pushID:string;
    private _items:Array<CartEntry>;

    constructor(cartCode:string, items:Array<CartEntry>, status:CartStatus, pushID:string){
        this._cartCode = cartCode;
        this._items = items;
        this._status = status;
        this._pushID = pushID;
    }

    public get cartCode(){
        return this._cartCode;
    }

    public set (cartCode:string){
        this._cartCode = cartCode;
    }

    public get items(){
        return this._items;
    }

    public set items(items:Array<CartEntry>){
        this._items = items;
    }

    public get status(){
        return this._status;
    }

    public set status(status:CartStatus){
        this._status = status;
    }

    public get pushID(){
        return this.pushID;
    }

    public set pushID(pushID:string){
        this._pushID = pushID
    }
}
/// <reference path="CartStatus.ts" />
/// <reference path="CartEntryServer.ts" />
module common{
    export class CartServer{
        private _cartCode:string;
        private _items:Array<CartEntryServer>;
        private _status:CartStatus;
        private _pushID:string;
        private _sentToServer:number;

        public set cartCode(code:string){
            this._cartCode = code;
        }

        public get cartCode():string{
            return this._cartCode;
        }

        public set items(items:Array<CartEntryServer>){
            this._items = items;
        }

        public get items():Array<CartEntryServer>{
            return this.items;
        }

        public set status(status:CartStatus){
            this._status = status;
        }

        public get status():CartStatus{
            return this._status;
        }

        public set pushID(pushID:string){
            this._pushID = pushID;
        }

        public get pushID():string{
            return this._pushID;
        }

        public setSentToServer():void{
            this._sentToServer = new Date().getTime();
        }

        public getSentToServer():number{
            return this._sentToServer;
        }
    }
}
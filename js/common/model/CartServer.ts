/// <reference path="CartStatus.ts" />
/// <reference path="CartEntryServer.ts" />
module common{
    export class CartServer{
        private cartCode:string;
        private items:Array<CartEntryServer>;
        private status:string;
        private pushID:string;
        private sentToServer:number;

        public set cartCartCode(code:string){
            this.cartCode = code;
        }

        public get cartCartCode():string{
            return this.cartCode;
        }

        public set cartItems(items:Array<CartEntryServer>){
            this.items = items;
        }

        public get cartItems():Array<CartEntryServer>{
            return this.items;
        }

        public set cartStatus(status:string){
            this.status = status;
        }

        public get cartStatus():string{
            return this.status;
        }

        public set cartPushID(pushID:string){
            this.pushID = pushID;
        }

        public get cartPushID():string{
            return this.pushID;
        }

        public setSentToServer():void{
            this.sentToServer = new Date().getTime();
        }

        public getSentToServer():number{
            return this.sentToServer;
        }
    }
}
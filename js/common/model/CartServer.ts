/// <reference path="CartStatus.ts" />
/// <reference path="CartEntryServer.ts" />
module common{
    export class CartServer{
        private cartCode:string;
        private items:Array<CartEntryServer>;
        private status:string;
        private pushToken:string;
        private sentToServer:number;
        private platformType:string;

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

        public set cartPushToken(pushToken:string){
            this.pushToken = pushToken;
        }

        public get cartPushToken():string{
            return this.pushToken;
        }

        public setSentToServer():void{
            this.sentToServer = new Date().getTime();
        }

        public getSentToServer():number{
            return this.sentToServer;
        }

        public set cartPlatformType(platformType:string){
            this.platformType = platformType;
        }

        public get cartPlatformType():string{
            return this.platformType;
        }
    }
}
/// <reference path="CartServer.ts" />
module common{
    export class CartEntryServer{
        private id:number;
        private productId:string;
        private amount:number;
        private cart:CartServer;

        constructor(productID:string, cart:CartServer, amount:number){
            this.productId = productID;
            this.cart = cart;
            this.amount = amount;
        }

        public set cartID(id:number){
            this.id = id;
        }

        public get cartID():number{
            return this.id;
        }

        public set cartProductID(productID:string){
            this.productId = productID;
        }

        public get cartProductID():string{
            return this.productId;
        }

        public set cartAmount(amount:number){
            this.amount = amount;
        }

        public get cartAmount():number{
            return this.amount;
        }

        public set cartCart(cart:CartServer){
            this.cart = cart;
        }

        public get cartCart():CartServer{
            return this.cart;
        }
    }
}
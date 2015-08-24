/// <reference path="CartServer.ts" />
module common{
    export class CartEntryServer{
        private id:number;
        private productID:string;
        private amount:number;
        private cart:CartServer;

        constructor(productID:string, cart:CartServer, amount:number){
            this.productID = productID;
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
            this.productID = productID;
        }

        public get cartProductID():string{
            return this.productID;
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
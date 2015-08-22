/// <reference path="CartServer.ts" />
module common{
    export class CartEntryServer{
        private _id:number;
        private _productID:string;
        private _amount:number;
        private _cart:CartServer;

        constructor(productID:string, cart:CartServer, amount:number){
            this._productID = productID;
            this._cart = cart;
            this._amount = amount;
        }

        public set id(id:number){
            this._id = id;
        }

        public get id():number{
            return this._id;
        }

        public set productID(productID:string){
            this._productID = productID;
        }

        public get productID():string{
            return this._productID;
        }

        public set amount(amount:number){
            this._amount = amount;
        }

        public get amount():number{
            return this._amount;
        }

        public set cart(cart:CartServer){
            this._cart = cart;
        }

        public get cart():CartServer{
            return this._cart;
        }
    }
}
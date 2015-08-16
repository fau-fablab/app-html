/// <reference path="product.ts" />
module common{
    export class cartEntry{
        private _amount:number;
        private _product:common.product;

        constructor(product:common.product, amount:number){
            this._product = product;
            this._amount = amount;
        }

        public get product():common.product{
            return this._product;
        }

        public set product(p:common.product){
            this._product = p;
        }

        public get amount():number{
            return this._amount;
        }

        public set amount(a:number){
            this._amount = a;
        }
    }
}
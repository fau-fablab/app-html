/// <reference path="Product.ts" />
module common {
    export class CartEntry {
        private _amount:number;
        private _product:common.Product;

        constructor(product:common.Product, amount:number) {
            this._product = product;
            this._amount = amount;
        }

        public get product():common.Product {
            return this._product;
        }

        public set product(p:common.Product) {
            this._product = p;
        }

        public get amount():number {
            return this._amount;
        }

        public set amount(a:number) {
            this._amount = a;
        }
    }
}

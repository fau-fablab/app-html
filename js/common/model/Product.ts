/// <reference path="Category.ts" />
/// <reference path="Uom.ts" />
module common {
    export class Product {

        private _productId:number;
        private _name:string;
        private _description:string;
        private _price:number;
        private _itemsAvailable:number;
        private _unit:string;

        private _categoryString:string;
        private _locationString:string;
        private _locationForProductMap;

        private _categoryId:number;
        private _oumId:number;

        private _categoryObject: common.Category;
        private _uomObject: common.Uom;




        constructor(record) {
            this._productId = record.productId;
            this._name = record.name;
            this._description = record.description;
            this._price = record.price;
            this._unit = record.unit;
            this._itemsAvailable = record.itemsAvailable;

            this._categoryId = record.location_id;
            this._oumId = record.oum_id;

            this._categoryString = record.categoryString;
            this._locationString = record.location;
            this._locationForProductMap = record.locationForProductMap;

            this._categoryObject = new common.Category(record.category);

            this._uomObject = new common.Uom(record.uom);
        }


        public get productId():number {
            return this._productId;
        }

        public set productId(value:number) {
            this._productId = value;
        }

        public get name():string {
            return this._name;
        }

        public set name(value:string) {
            this._name = value;
        }

        public get description():string {
            return this._description;
        }

        public set description(value:string) {
            this._description = value;
        }

        public get price():number {
            return this._price;
        }

        public set price(value:number) {
            this._price = value;
        }

        public get itemsAvailable():number {
            return this._itemsAvailable;
        }

        public set itemsAvailable(value:number) {
            this._itemsAvailable = value;
        }

        public get unit():string {
            return this._unit;
        }

        public set unit(value:string) {
            this._unit = value;
        }

        public get categoryString():string {
            return this._categoryString;
        }

        public set categoryString(value:string) {
            this._categoryString = value;
        }

        public get locationString():string {
            return this._locationString;
        }

        public set locationString(value:string) {
            this._locationString = value;
        }

        public get categoryId():number {
            return this._categoryId;
        }

        public set categoryId(value:number) {
            this._categoryId = value;
        }

        public get oumId():number {
            return this._oumId;
        }

        public set oumId(value:number) {
            this._oumId = value;
        }

        public get categoryObject():common.Category {
            return this._categoryObject;
        }

        public set categoryObject(value:common.Category) {
            this._categoryObject = value;
        }

        public get uomObject():common.Uom {
            return this._uomObject;
        }

        public set uomObject(value:common.Uom) {
            this._uomObject = value;
        }

        public get locationForProductMap() {
            return this._locationForProductMap;
        }

        public set locationForProductMap(value) {
            this._locationForProductMap = value;
        }

    }
}

/// <reference path="Category.ts" />
/// <reference path="Uom.ts" />
module common {
    export class Product {

        public _productId:number;
        public _name:string;
        public _description:string;
        public _price:number;
        public _itemsAvailable:number;
        public _unit:string;

        public _categoryString:string;
        public _locationString:string;

        public _categoryId:number;
        public _oumId:number;

        public _categoryObject: common.Category;
        public _uomObject: common.Uom;


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


            this._categoryObject = new common.Category(record.category);

            this._uomObject = new common.Uom(record.uom);
        }

    }
}

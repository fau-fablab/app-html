module common {
    export class category {

        public _categoryId:number;
        public _name:string;
        public _locationString:string;

        public _locationId:number;
        public _parentCategoryId:number;

        constructor(record:any) {
            this._categoryId = record.categoryId;
            this._name = record.name;
            this._locationString = record.locationString;
            this._parentCategoryId = record.parent_category_id;
            this._locationId = record.location_id;
        }
    }

}
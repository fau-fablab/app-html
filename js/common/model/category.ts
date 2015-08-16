module common {
    export class Category {

        private _categoryId:number;
        private _name:string;
        private _locationString:string;

        private _locationId:number;
        private _parentCategoryId:number;

        constructor(record:any) {
            this._categoryId = record.categoryId;
            this._name = record.name;
            this._locationString = record.locationString;
            this._parentCategoryId = record.parent_category_id;
            this._locationId = record.location_id;
        }


        public get categoryId():number {
            return this._categoryId;
        }

        public set categoryId(value:number) {
            this._categoryId = value;
        }

        public get name():string {
            return this._name;
        }

        public set name(value:string) {
            this._name = value;
        }

        public get locationString():string {
            return this._locationString;
        }

        public set locationString(value:string) {
            this._locationString = value;
        }

        public get locationId():number {
            return this._locationId;
        }

        public set locationId(value:number) {
            this._locationId = value;
        }

        public get parentCategoryId():number {
            return this._parentCategoryId;
        }

        public set parentCategoryId(value:number) {
            this._parentCategoryId = value;
        }
    }
}
module common {
    export class Category {

        private _categoryId:number;
        private _name:string;
        private _locationString:string;

        private _locationId:number;
        private _parentCategoryId:number;
        private _categoryChilds: Array<number>;
        private _childCategoryObjects: Array<common.Category>;


        constructor() {
        }


        public get categoryChilds():Array<number> {
            return this._categoryChilds;
        }

        public set categoryChilds(value:Array<number>) {
            this._categoryChilds = value;
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

        public get childCategoryObjects():Array<common.Category> {
            return this._childCategoryObjects;
        }

        public set childCategoryObjects(value:Array<common.Category>) {
            this._childCategoryObjects = value;
        }
    }
}
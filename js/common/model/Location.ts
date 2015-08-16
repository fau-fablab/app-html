module common{
    export class Location{
        private _locationId: number;
        private _name: string;
        private _code: string;

        constructor(record: any){
            this._locationId = record.locationId;
            this._name = record.name;
            this._code = record.code;
        }


        public get locationId():number {
            return this._locationId;
        }

        public set locationId(value:number) {
            this._locationId = value;
        }

        public get name():string {
            return this._name;
        }

        public set name(value:string) {
            this._name = value;
        }

        public get code():string {
            return this._code;
        }

        public set code(value:string) {
            this._code = value;
        }
    }

}
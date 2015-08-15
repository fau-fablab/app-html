module common{
    export class location{
        public _locationId: number;
        public _name: string;
        public _code: string;

        constructor(record: any){
            this._locationId = record.locationId;
            this._name = record.name;
            this._code = record.code;
        }

    }

}
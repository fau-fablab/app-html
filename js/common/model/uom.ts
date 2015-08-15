module common {
    export class uom {
        public _uomId: number;
        public _name: string;
        public _rounding: number;
        public _uomType: string;

        constructor(record: any){
            this._uomId = record.uom_id;
            this._name = record.name;
            this._rounding = record.rounding;
            this._uomType = record.uomType;
        }
    }
}
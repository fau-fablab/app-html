module common {
    export class Uom {
        private _uomId: number;
        private _name: string;
        private _rounding: number;
        private _uomType: string;

        constructor(record: any){
            this._uomId = record.uom_id;
            this._name = record.name;
            this._rounding = record.rounding;
            this._uomType = record.uomType;
        }


        public get uomId():number {
            return this._uomId;
        }

        public set uomId(value:number) {
            this._uomId = value;
        }

        public get name():string {
            return this._name;
        }

        public set name(value:string) {
            this._name = value;
        }

        public get rounding():number {
            return this._rounding;
        }

        public set rounding(value:number) {
            this._rounding = value;
        }

        public get uomType():string {
            return this._uomType;
        }

        public set uomType(value:string) {
            this._uomType = value;
        }
    }
}
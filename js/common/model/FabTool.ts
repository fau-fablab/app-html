module common {
    export class FabTool {
        private _id:number;
        private _title:string;
        private _link:string;
        private _description:string;
        private _details;
        private _linkToPicture;
        private _enabledForMachineUsage:boolean;


        constructor(record:any) {
            this._id = record.id;
            this._title = record.title;
            this._link = record.link;
            this._description = record.description;
            this._details = record.details;
            this._linkToPicture = record.linkToPicture;
            this._enabledForMachineUsage = record.enabledForMachineUsage;
        }


        public get id():number {
            return this._id;
        }

        public set id(value:number) {
            this._id = value;
        }

        public get title():string {
            return this._title;
        }

        public set title(value:string) {
            this._title = value;
        }

        public get link():string {
            return this._link;
        }

        public set link(value:string) {
            this._link = value;
        }

        public get description():string {
            return this._description;
        }

        public set description(value:string) {
            this._description = value;
        }

        public get details() {
            return this._details;
        }

        public set details(value) {
            this._details = value;
        }

        public get linkToPicture() {
            return this._linkToPicture;
        }

        public set linkToPicture(value) {
            this._linkToPicture = value;
        }

        public get enabledForMachineUsage():boolean {
            return this._enabledForMachineUsage;
        }

        public set enabledForMachineUsage(value:boolean) {
            this._enabledForMachineUsage = value;
        }
    }
}
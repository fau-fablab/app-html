module common {

    export class ToolUsage {
        private _id : number;
        private _user : string;
        private _project : string;
        private _duration : number;
        private _toolId : number;
        private _successorId : number;
        private _creationDate: Date;

        constructor () {
            // TODO
        }

        public get id():number {
            return this._id;
        }

        public set id(value:number) {
            this._id = value;
        }

        public get user():string {
            return this._user;
        }

        public set user(value:string) {
            this._user = value;
        }

        public get project():string {
            return this._project;
        }

        public set project(value:string) {
            this._project = value;
        }

        public get duration():number {
            return this._duration;
        }

        public set duration(value:number) {
            this._duration = value;
        }

        public get toolId():number {
            return this._toolId;
        }

        public set toolId(value:number) {
            this._toolId = value;
        }

        public get successorId():number {
            return this._successorId;
        }

        public set successorId(value:number) {
            this._successorId = value;
        }
    }
}

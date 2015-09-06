module common{

    export enum Roles {
        USER,
        ADMIN,
        INVENTORY
    }

    export class User {

        private _username : string;
        private _password : string;
        private _roles : Array<Roles> = [];

        public get username():string {
            return this._username;
        }

        public set username(value:string) {
            this._username = value;
        }

        public get password():string {
            return this._password;
        }

        public set password(value:string) {
            this._password = value;
        }

        public get roles():Roles[] {
            return this._roles;
        }

        public set roles(value:Roles[]) {
            this._roles = value;
        }

        public clear() {
            this._username = "";
            this._password = "";
            this._roles = [];
        }

        public fromRecord(record) : boolean {
            if (record == null)
                return false;

            this._username = record.username;
            this._password = record.password;

            for (var newRole in record.roles) {

                var r : Roles = record.roles[newRole];

                if (this.roles.indexOf(r) < 0)
                    this.roles.push(r);
            }

            return true;
        }

        public hasRole(role) : boolean {

            for (var i in this._roles){
                var r1 : Roles = this._roles[i];
                var r2 : string = Roles[r1];


                if (r1 == role || r2 == role)
                    return true;
            }

            return false;
        }
    }
}
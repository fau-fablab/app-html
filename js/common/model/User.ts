module common{

    export enum Roles {
        User,
        Admin,
        Iventory
    }

    export class User {

        private _username : string;
        private _password : string;
        private _roles : Roles[] = [];


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

        public fromRecord(record) {
            this._username = record.username;
            this._password = record.password;

            for (var newRole in record.roles) {

                var r : Roles = Roles[<string>newRole];
                if (!this.roles.indexOf(r))
                    this.roles.push(r);
            }
        }

        public hasRole(role : Roles) : boolean {
            return !!this._roles.indexOf(role);
        }
    }
}
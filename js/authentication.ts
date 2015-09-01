/// <reference path="util/RestClient.ts" />

enum Roles {
    User,
    Inventory,
    Admin
}

class Authentication {
    username : string = "";
    password : string = "";
    private _isAuthenticated : boolean = false;
    private roles : Roles[] = [];
    private loginCallback : (auth : Authentication) => any = null;

    login (username : string, password : string, cb : (auth : Authentication) => any) {
        this.username = username;
        this.password = password;
        this.loginCallback = cb;

        this.authenticate();
    }

    logout () {
        this.username = "";
        this.password = "";
        this.roles = [];
        this._isAuthenticated = false;
        this.loginCallback = null;
    }

    authenticate () {
        if (this.username.length <= 0 || this.password.length <= 0) {
            alert("Username and password is required for authentication.");
        }

        var auth : Authentication = this;
        var c : RestClient = new RestClient();
        c.addAuthentication(this.username, this.password);
        c.request("GET", "/user/", function(user) {auth.initializeAuthentication(user);});
    }

    initializeAuthentication(user) {
        this.username = user.username;
        this._isAuthenticated = true;

        for (var newRole in user.roles) {

            var r : Roles = Roles[<string>newRole];
            if (!this.roles.indexOf(r))
                this.roles.push(r);
        }

        if (this.loginCallback)
            this.loginCallback(this);
    }

    hasRole(role : Roles) : boolean {
        if (this.roles.indexOf(role))
            return true;

        return false;
    }

    isAuthenticated() : boolean {
        return this._isAuthenticated;
    }

}
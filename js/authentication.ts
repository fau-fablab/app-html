/// <reference path="util/RestClient.ts" />

enum Roles {
    User,
    Inventory,
    Admin
}

class Authentication {
    username : string = "";
    password : string = "";
    isAuthenticated : boolean = false;
    roles : Roles[] = [];

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
        this.username = user.user;

        for (var newRole in user.roles) {

            var r : Roles = Roles[<string>newRole];
            if (!this.roles.indexOf(r))
                this.roles.push(r);
        }
    }

    hasRole(role : Roles) : boolean {
        if (this.roles.indexOf(role))
            return true;

        return false;
    }

}
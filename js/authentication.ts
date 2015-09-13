/// <reference path="util/RestClient.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="common/model/User.ts"/>
/// <reference path="jquery.d.ts" />

class Authentication {
    private user : common.User = new common.User();
    private _isAuthenticated : boolean = false;
    private loginCallbackExt : (auth : Authentication) => any = null;
    private static localStorageLogin : string = "login";

    constructor () {
        this.importUser(Authentication.getUserInfo());
    }

    login (username : string, password : string, cb : (auth : Authentication) => any) {
        this.user.username = username;
        this.user.password = password;
        this.loginCallbackExt = cb;

        this.authenticate();
    }

    logout () {
        localStorage.removeItem(Authentication.localStorageLogin);
        this.user.clear();
        this._isAuthenticated = false;
        this.loginCallbackExt = null;
        $("#inventory").hide();
        if(window.location.hash == "#inventory"){
            window.location.hash = "#news";
        }
    }

    authenticate () {
        if (this.user.username.length <= 0 || this.user.password.length <= 0) {
            alert("Bitte Username und Passwort eingeben.");
            return;
        }

        var auth : Authentication = this;
        var c : RestClient = new RestClient();
        c.addAuthentication(this.user.username, this.user.password);
        c.requestGET(
            "/user/",
            function(user) {auth.callbackLogin(user);},
            function (errorCode : number, errorMessage : string){auth.callbackError(errorCode, errorMessage)}
        );
    }

    callbackLogin(user) {
        this.user = new common.User();
        this.user.fromRecord(user);
        this._isAuthenticated = true;
        localStorage.setItem(Authentication.localStorageLogin, JSON.stringify(user));

        if (this.loginCallbackExt)
            this.loginCallbackExt(this);

        // show inventory if user == admin/inventory
        if(this.user && (this.user.hasRole(common.Roles.ADMIN) || this.user.hasRole(common.Roles.INVENTORY))){
            $("#inventory").show();
        }
    }

    callbackError(errorCode : number, errorMessage : string) {
        this._isAuthenticated = false;

        if (errorCode == 401) {
            alert("Username und/oder Passwort sind falsch.");
        }
        else {
            alert("Fehler beim login.");
        }
    }

    isAuthenticated() : boolean {
        return this._isAuthenticated;
    }

    getUser() : common.User {
        return this.user;
    }

    importUser(user : common.User) {
        if (user && user.password.length > 0 && user.username.length > 0) {
            this.user = user;
            this._isAuthenticated = true;
        } else {
            this._isAuthenticated = false;
        }
    }

    static getUserInfo() : common.User {
        var user : common.User = new common.User();
        var result : boolean = user.fromRecord(JSON.parse(localStorage.getItem(Authentication.localStorageLogin)));

        if (result)
            return user;
        else
            return null;
    }
}
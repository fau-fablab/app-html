/// <reference path="util/RestClient.ts" />
/// <reference path="common/model/CartEntry.ts"/>

class Authentication {
    private user : common.User = new common.User();
    private _isAuthenticated : boolean = false;
    private loginCallbackExt : (auth : Authentication) => any = null;
    private static localStorageLogin : string = "login";

    constructor () {
        this.importUser(JSON.parse(localStorage.getItem(Authentication.localStorageLogin)));
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
        this.user.fromRecord(user);
        this._isAuthenticated = true;
        localStorage.setItem(Authentication.localStorageLogin, JSON.stringify(user));

        if (this.loginCallbackExt)
            this.loginCallbackExt(this);
    }

    callbackError(errorCode : number, errorMessage : string) {
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

    importUser(user) {
        if (user == null) {
            return;
        }

        this.user = new common.User();
        this.user.fromRecord(user);
        this._isAuthenticated = true;
    }
}
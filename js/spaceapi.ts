/// <reference path="util/RestClient.ts" />
/// <reference path="libraries/jquery.d.ts" />

enum DoorState {invalid, open, close}

class SpaceApi {
    spaceName : string = "";
    state : DoorState = DoorState.invalid;
    time : number = 0;
    message : string = "";
    iconUrl : string = "";
    callback : (state : SpaceApi) => any = null;

    constructor(spaceName : string, callback : (state : SpaceApi) => any) {
        this.spaceName = spaceName;
        this.callback = callback;
        this.update();
    }

    update() {
        // this is a hack to pass object and method to callback
        // otherwise connection of method to object will be lost
        // see: http://bitstructures.com/2007/11/javascript-method-callbacks.html
        var sp : SpaceApi = this;
        var c : RestClient = new RestClient();
        c.request("GET", "/spaceapi/spaces/" + this.spaceName, function(newState) {sp.setState(newState);});
    }

    setState(newState) {

        if (newState.state.open) {
            this.iconUrl = newState.state.icon.open;
            this.state = DoorState.open;
        }
        else {
            this.iconUrl = newState.state.icon.closed;
            this.state = DoorState.close;
        }

        this.time = newState.state.lastchange;
        this.message = newState.state.message;

        if (this.callback != undefined)
                this.callback(this);
    }

    getTimeAsString() {
        var seconds : number = Math.floor(Date.now() / 1000 - this.time);

        if (seconds <= 60)
            return seconds + "s";

        var minutes : number = Math.floor(seconds / 60);
        if (minutes <= 60)
            return minutes + "m";

        var hours : number = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);

        return hours + "h " + minutes + "m";
    }
}
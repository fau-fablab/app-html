/// <reference path="RestClient.ts" />
/// <reference path="jquery.d.ts" />

enum DoorState {invalid, open, close}

class SpaceApi {
    spaceName : string = "FAU+FabLab";
    state : DoorState = DoorState.invalid;
    time : number;
    message : string;
    callback : (state : SpaceApi) => any = null;

    constructor(callback : (state : SpaceApi) => any) {
        this.callback = callback;
        this.update();
    }

    update() {
        var c : RestClient = new RestClient();
        c.request("GET", "/spaceapi/spaces/" + this.spaceName, this.setState);
    }

    setState(newState) {

        if (newState.state.open)
            this.state = DoorState.open;
        else
            this.state = DoorState.close;

        this.time = newState.state.lastchange;
        this.message = newState.state.message;

        if (this.callback) {
            this.callback(this);
        }
    }

    getTimeAsString() {
        var now = Date.now();
        var seconds = now - this.time;

        return seconds;
    }
}
/// <reference path="spaceapi.ts" />


function updateDoorState(state : SpaceApi) {
    console.log("im in callback now: " + state.message);
    var message : string = "state: " + spaceapi.state + " message: " + spaceapi.message + " lastchange: " + spaceapi.time;
    $("#doorState").html(message);
}

var spaceapi:SpaceApi = null;

function triggerUpdate() {
    console.log("triggering update");
    spaceapi.update();
}

$(document).ready(function () {

    console.log("Starte App und lege SpaceAPI an");
    spaceapi = new SpaceApi(updateDoorState);
    $("#doorState").click(triggerUpdate);

});
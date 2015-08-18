/// <reference path="spaceapi.ts" />


function updateDoorState(state : SpaceApi) {
    alert("im in callback now: " + state.message);
    var message : string = "state: " + spaceapi.state + " message: " + spaceapi.message + " lastchange: " + spaceapi.time;
    $("#doorState").html(message);
}

var spaceapi:SpaceApi = null;

function triggerUpdate() {
    alert ("triggering update");
    spaceapi.update();
}

$(document).ready(function () {

    spaceapi = new SpaceApi(updateDoorState);
    $("#doorState").click(triggerUpdate);

});
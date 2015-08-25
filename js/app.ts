/// <reference path="spaceapi.ts" />

var spaceapi:SpaceApi = null;

function updateDoorState(state : SpaceApi) {
    var message : string;
    if (state.state == DoorState.close)
        message = "Das FabLab war zuletzt vor " + state.getTimeAsString() + " geöffnet.";
    else
        message = "Das FabLab ist seit " + state.getTimeAsString() + " geöffnet.";

    $("#doorState").text(message);

    var doorStateImg = $(document.createElement('img'));
    doorStateImg.attr('src', state.iconUrl);
    doorStateImg.attr('alt', state.message);
    doorStateImg.attr('class', "navbar-brand-logo");

    var doorStateDiv = $("#doorStateIcon");

    doorStateDiv.html("");
    doorStateImg.appendTo(doorStateDiv);
}

function triggerDoorStateUpdate() {
    spaceapi.update();
}

$(document).ready(function () {

    spaceapi = new SpaceApi("FAU+FabLab", updateDoorState);
    $("#doorState").click(triggerDoorStateUpdate);

});
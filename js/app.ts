/// <reference path="spaceapi.ts" />
/// <reference path="common/rest/ProductApi.ts" />

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
    var productApi: ProductApi = new ProductApi();
    productApi.findAll(5,0,findAllProductCallback);
    productApi.findById("0008",findProductByIdCallback);
    productApi.findByName("Holzschraube",10,0,findProductByNameCallback);
    productApi.findByCategory("1-reihig",10,0,findProductByCategoryCallback);
    productApi.findAllNames(findProductNamesCallBack);

    spaceapi = new SpaceApi("FAU+FabLab", updateDoorState);
    $("#doorState").click(triggerDoorStateUpdate);
});

function findAllProductCallback(records){
    console.log("FindAll");
    console.log(records);
}

function findProductByIdCallback(records){
    console.log("FindByID");
    console.log(records);
}

function findProductByNameCallback(records){
    console.log("FindByName");
    console.log(records);
}

function findProductByCategoryCallback(records){
    console.log("FindByCategory");
    console.log(records);
}

function findProductNamesCallBack(records){
    console.log("Find ProductNames");
    console.log(records);
}
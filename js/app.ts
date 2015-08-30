/// <reference path="spaceapi.ts" />
/// <reference path="common/rest/ProductApi.ts"/>


var spaceapi:SpaceApi = null;
var lasturl: string = "";

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

$(document).ready(function () {
    console.log("Document was loaded: " + window.location.hash)

    var currentHash = "";
    var nav_links:any = $("a.nav_link2");
    nav_links.click(reloadPage);
    //setInterval("reloadPage()",250);
    if(currentHash == "" || currentHash == null || currentHash == "#close"){
        currentHash = "#news";
        window.location.hash = currentHash;
    }

    if(currentHash != lasturl){
        lasturl=currentHash;
        loadPage(currentHash);
    }
});




function loadPage(url):void{
    console.log("loadPage: " + window.location.hash);
    // remove hashtag from URL
    var newUrl = url.replace('#','');
    // URL as h1 title for page

    // create full URL
    var fullURL:string = newUrl + ".html";

    // page content
    var pageContent:string;
    console.log("FullURL: " + fullURL);
    // load site content
    $.get(fullURL, function(data){
        lasturl = url;
        pageContent = data;
        $("#content").fadeOut("fast", function(){
            $("#content").html(pageContent).fadeIn("fast");
        });
    });
}

function reloadPage(){
    var currentAttribute = $(this).attr("href");
    console.log("ReloadPage: " + window.location.hash)
    var currentHash2 = window.location.hash;
    console.log("CurrentHash: " + currentHash2);
    loadPage(currentAttribute);
}

function showHashValue(){
    console.log("CurrentHash: " + window.location.hash);
}








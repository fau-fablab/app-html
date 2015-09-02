/// <reference path="spaceapi.ts" />
/// <reference path="authentication.ts" />
/// <reference path="common/rest/ProductApi.ts"/>


var spaceapi:SpaceApi = null;
var auth:Authentication = null;
var lasturl: string = "";

function updateDoorState(state : SpaceApi) {
    var message : string;
    if (state.state == DoorState.close)
        message = "seit " + state.getTimeAsString() + " geschlossen";
    else
        message = "seit " + state.getTimeAsString() + " geöffnet";

    $("#doorState").text(message);

    var doorStateImg = $("#doorStateIcon");
    doorStateImg.attr('src', state.iconUrl);
    doorStateImg.attr('alt', state.message);
}

function triggerDoorStateUpdate() {
    spaceapi.update();
}

$(document).ready(function () {
    console.log("Document was loaded: " + window.location.hash);

    // initialize space api / door state
    spaceapi = new SpaceApi("FAU+FabLab", updateDoorState);
    $("#doorState").click(triggerDoorStateUpdate);


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

    // initialize authentication
    auth = new Authentication();
    updateAuthentication(auth);

    // register callbacks for login and cancel button in login dialog
    $("#loginDialogSubmit").click(function () {
        var user = $("#loginName").val();
        var password = $("#loginPassword").val();

        auth.login(user, password, updateAuthentication);
    });
    $("#loginDialogCancel").click(function () {
        $("#loginDialog").hide();
    });
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
    console.log("ReloadPage: " + window.location.hash);
    var currentHash2 = window.location.hash;
    console.log("CurrentHash: " + currentHash2);
    loadPage(currentAttribute);
}

function showHashValue(){
    console.log("CurrentHash: " + window.location.hash);
}

function updateAuthentication(auth : Authentication) {
    var loginButton = $("#loginButton");
    var link = $(document.createElement('a'));
    link.attr("class", "nav_link2");

    // user os logged in
    if (auth.isAuthenticated()) {
        loginButton.text("SIGNED IN AS " + auth.getUser().username + " ");

        link.text("Logout");
        link.click(function () {
            auth.logout();
            updateAuthentication(auth);
        });
        $('#loginDialog').hide();
    }
    // user is not logged in
    else {
        loginButton.text("");

        link.text("Login");
        link.click(function () {
            $('#loginDialog').show();
        });
    }
    link.appendTo(loginButton);
}

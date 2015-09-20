/// <reference path="spaceapi.ts" />
/// <reference path="authentication.ts" />
/// <reference path="common/rest/ProductApi.ts"/>
/// <reference path="util/Utils.ts"/>
/// <reference path="jquery.d.ts" />

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
    // initialize space api / door state
    spaceapi = new SpaceApi("FAU+FabLab", updateDoorState);
    $("#doorState").click(triggerDoorStateUpdate);

    var currentHash = window.location.hash;
    var nav_links:any = $("a.nav_link");
    nav_links.click(reloadPage);



    //setInterval("reloadPage()",250);
    if(currentHash == "" || currentHash == null){
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
});

function loadPage(url):void{
    console.log(url);
    // remove hashtag from URL
    var newUrl = url.replace('#','');

    // URL as h1 title for page
    var title:string = newUrl.toUpperCase();

    switch(title){
        case "NEWS":
            break;
        case "SEARCH":
            title = "PRODUKTSUCHE";
            break;
        case "CART":
            title = "WARENKORB";
            break;
        case "ABOUT":
            title = "ÜBER UNS";
            break;
        case "CONTACT":
            title = "KONTAKT";
            break;
        case "TOOLUSAGE":
            title = "RESERVIERUNG";
            break;
        case "INVENTORY":
            title = "Inventurübersicht";
            break;
        default:
            title = "NO TITLE DEFINED compare app.ts";

            break;
    }


    // create full URL
    var fullURL:string = newUrl + ".html";

    // page content
    var pageContent:string;

    // load site content
    (<any>$).get(fullURL, function(data){
        lasturl = url;
        pageContent = data;
        $("#content").fadeOut("fast", function(){
            $("#content").html(pageContent).fadeIn("fast");
            $("#h1_title").text(title);
            setMenueActive(url);
        });
    }).fail(function() {
        // hashtag does not exist -> load news
        window.location.hash = "#news";
        loadPage("#news");
    });
}

function reloadPage(){
    var currentAttribute = $(this).attr("href");

    var currentHash = window.location.hash;


    if(currentHash == lasturl){
        return;
    }
    if(currentAttribute == undefined){
        loadPage(currentHash);
    }else{
        loadPage(currentAttribute);
    }

    // close navbar when clicked
    $('.navbar-toggle').click()

}

// set menue item active
function setMenueActive(hashId:string):void{
    var nav_links:any = $("ul.nav li");
    nav_links.removeClass("active");
    $(hashId).addClass("active");
}

function updateAuthentication(auth : Authentication) {
    var loginButton = $("#loginButton");
    var link = $(document.createElement('a'));
    link.attr("class", "nav_link2");

    // user os logged in
    if (auth.isAuthenticated()) {
        loginButton.text(auth.getUser().username + " ");

        // show inventory if user == admin/inventory
        if(auth.getUser() && (auth.getUser().hasRole(common.Roles.ADMIN) || auth.getUser().hasRole(common.Roles.INVENTORY))){
            $("#inventory").show();
        }

        link.text("Logout");
        link.click(function () {
            auth.logout();
            updateAuthentication(auth);
        });
    }
    // user is not logged in
    else {
        loginButton.text("");

        link.attr("data-toggle", "modal");
        link.attr("data-target", "#loginDialog");
        link.text("Login");

        $("#inventory").hide();
        if(window.location.hash == "#inventory"){
            window.location.hash = "#news";
        }
    }
    link.appendTo(loginButton);
}

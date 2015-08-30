/// <reference path="jquery.d.ts" />

$(document).ready(function () {
    var hamburger = $("#menu-toggle");

    // open sidebar navigation & animate hamburger
    hamburger.click(function (event) {
        event.preventDefault();
        $(this).toggleClass("active");
	    changeSidebar();
    });

    //check if the URL has a reference to a page and load it
    checkURL(null);

    // recognize navigation link clicks
    $('ul li a').click(function (e){
        hamburger.toggleClass("active");
        changeSidebar();
        checkURL(null);

    });

    // recognize fablab icon click
    $("#fablab_icon").click(function (event){
        hamburger.toggleClass("active", false);
        closeSidebar();
    });

    //check for a change in the URL every 250 ms to detect if the history buttons have been used
    setInterval("checkURL()",250);

    // click listener for cart icon
    $("#cart_button").click(function(){
        window.location.hash = "#cart";
        checkURL("#cart");
    })

});


// current URL hash
var lasturl:string = "";

function checkURL(hash):void{
    // if no parameter is provided, use the hash value from the current address
    if (!hash) {
        hash = window.location.hash;
        if (hash == "" || hash == null || hash == "#close" || hash == undefined) {
            hash = "#news";
            window.location.hash = hash;
        }

        if(hash == "#closeCheckout"){
            hash = "#cart";
            window.location.hash = hash;
        }
    }

    // hash value changed
    if(hash != lasturl){
        lasturl=hash;	
        loadPage(hash);
    }
}

// load page
function loadPage(url):void{
    // remove hashtag from URL
    url=url.replace('#','');

    // URL as h1 title for page
    var title:string = url.toUpperCase();

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
        default:
            title = "NO TITLE DEFINED check sidebar_toggle.ts";
            break;
    }


    // create full URL
    var fullURL:string = url + ".html";

    // page content
    var pageContent:string;


    // load site content
    $.get(fullURL, function(data){
        pageContent = data;
        $("#content").fadeOut("fast", function(){
            $("#content").html(pageContent).fadeIn("fast");
            $("#h1_title").text(title);
        });

    });
}

// change status of sidebar to opened/closed
function changeSidebar(){

    // show active site <-> link 
    var nav_links:any = $("a.nav_link");
    nav_links.removeClass("active");

    $(window.location.hash).addClass("active");

    // get sidebar-wrapper and its position
    var elem:HTMLElement = document.getElementById("sidebar-wrapper");
    var left:string = window.getComputedStyle(elem, null).getPropertyValue("left");

    // close sidebar when opened and vice versa
    if (left == "200px") {
        closeSidebar();
    }
    else if (left == "-200px") {
        openSidebar();
    }
}

// explicit function to close sidebar
function closeSidebar():void{
    // close sidebar
    (<HTMLElement[]><any>  document.getElementsByClassName("sidebar-toggle"))[0].style.left = "-200px";

    // overlay hide to show background
    $(".overlay").hide();
}

// explicit function to open sidebar
function openSidebar():void{
    // show sidebar for navigation
    (<HTMLElement[]><any>  document.getElementsByClassName("sidebar-toggle"))[0].style.left = "200px";

    // overlay to gray out background
    $(".overlay").show();
}


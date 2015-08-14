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
    checkURL("");	

    // recognize navigation link clicks
    $('ul li a').click(function (e){
        hamburger.toggleClass("active");
        changeSidebar();
        checkURL(this.hash);

    });

    // recognize fablab icon click
    $("#fablab_icon").click(function (event){
        hamburger.toggleClass("active", false);
        closeSidebar();
    });

    //check for a change in the URL every 250 ms to detect if the history buttons have been used
    setInterval("checkURL()",250);	

});


// current URL hash
var lasturl="";	

function checkURL(hash){
    // if no parameter is provided, use the hash value from the current address
    if (!hash) {
        hash = window.location.hash;
        if (hash == "" || hash == null || hash == "#close") {
            hash = "#news";
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
function loadPage(url){
    // remove hashtag from URL
    url=url.replace('#','');

    // URL as h1 title for page
    var title = url.toUpperCase();

    switch(title){
        case "NEWS":
            break;
        case "SEARCH":
            title = "PRODUKTSUCHE";
            break;
        case "SCAN":
            title = "PRODUKTSCAN";
            break;
        case "CART":
            title = "WARENKORB";
            break;
        default:
            title = "NO TITLE DEFINED check sidebar_toggle.ts";
            break;
    }

    // create full URL
    var fullURL = url + ".html";

    // page content
    var pageContent;

    // load site content
    $.get(fullURL, function(data){
        pageContent = data;
        $("#content").fadeOut("fast", function(){
	        $("#content").html(pageContent).fadeIn("fast");
            $("#h1_title").text(title);
            // adapt height according to carts height
            if(title == "WARENKORB"){
                //var cart_footer_height = $("#cart_footer").css("height");
                //$("#content").css("margin-bottom", cart_footer_height);

            }
        });

    });
}

// change status of sidebar to opened/closed
function changeSidebar(){

    // show active site <-> link 
    var nav_links = $("a.nav_link");
    nav_links.removeClass("active");
    $(window.location.hash).addClass("active");

    // get sidebar-wrapper and its position
    var elem = document.getElementById("sidebar-wrapper");
    var left = window.getComputedStyle(elem, null).getPropertyValue("left");

    // close sidebar when opened and vice versa
    if (left == "200px") {
        closeSidebar();
    }
    else if (left == "-200px") {
        openSidebar();
    }
}

// explicit function to close sidebar
function closeSidebar(){
    // close sidebar
    (<HTMLElement[]><any>  document.getElementsByClassName("sidebar-toggle"))[0].style.left = "-200px";

    // overlay hide to show background
    $(".overlay").hide();
}

// explicit function to open sidebar
function openSidebar(){
    // show sidebar for navigation
    (<HTMLElement[]><any>  document.getElementsByClassName("sidebar-toggle"))[0].style.left = "200px";

    // overlay to gray out background
    $(".overlay").show();
}
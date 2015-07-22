/// <reference path="jquery.d.ts" />
$(document).ready(function () {
    var hamburger = $("#menu-toggle");
    // open sidebare navigation
    hamburger.click(function (e) {
        e.preventDefault();
        changeSidebar();
    });
    //check if the URL has a reference to a page and load it 
    checkURL(null);
    // recognize navigation link clicks
    $('ul li a').click(function (e) {
        changeSidebar();
        checkURL(this.hash);
    });
    //check for a change in the URL every 250 ms to detect if the history buttons have been used
    setInterval("checkURL()", 250);
});
// current URL hash
var lasturl = "";
function checkURL(hash) {
    // if no parameter is provided, use the hash value from the current address
    if (!hash)
        hash = window.location.hash;
    // hash value changed
    if (hash != lasturl) {
        lasturl = hash;
        loadPage(hash);
    }
}
// load page
function loadPage(url) {
    // remove hashtag from URL
    url = url.replace('#', '');
    // create full URL
    var fullURL = url + ".html";
    // page content
    var pageContent;
    // load site content
    $.get(fullURL, function (data) {
        pageContent = data;
        $("#content").fadeOut("fast", function () {
            $("#content").html(pageContent).fadeIn("fast");
        });
    });
}
// change status of sidebar to opened/closed
function changeSidebar() {
    // show active site <-> link 
    var nav_links = $("a.nav_link");
    nav_links.removeClass("active");
    $(window.location.hash).addClass("active");
    var overlay = $(".overlay");
    var elem = document.getElementById("sidebar-wrapper");
    var left = window.getComputedStyle(elem, null).getPropertyValue("left");
    var sidebar = document.getElementsByClassName("sidebar-toggle")[0];
    if (left == "200px") {
        sidebar.style.left = "-200px";
        overlay.hide();
    }
    else if (left == "-200px") {
        sidebar.style.left = "200px";
        overlay.show();
    }
}

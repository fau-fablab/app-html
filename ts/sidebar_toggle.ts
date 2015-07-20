/// <reference path="jquery.d.ts" />

$(document).ready(function () {
    var hamburger = $("#menu-toggle");
    var overlay = $(".overlay");

    $('.dropdown').on('show.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
    });
    $('.dropdown').on('hide.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
    });
    hamburger.click(function (e) {
        e.preventDefault();
        var elem = document.getElementById("sidebar-wrapper");
        var left = window.getComputedStyle(elem, null).getPropertyValue("left");
        var sidebar: HTMLElement = (<HTMLElement[]><any>  document.getElementsByClassName("sidebar-toggle"))[0];
        if (left == "200px") {
            sidebar.style.left = "-200px";
            overlay.hide();
        }
        else if (left == "-200px") {
            sidebar.style.left = "200px";
            overlay.hide();
        }
    });
});
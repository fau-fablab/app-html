/// <reference path="iscroll.d.ts" />

$(document).ready(function () {
    // add vertical touch scrolling
    var vertScroll = new IScroll("#about_container",{
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true
    });
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);
});
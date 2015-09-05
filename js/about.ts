/// <reference path="libraries/iscroll.d.ts" />
/// <reference path="libraries/jquery.d.ts" />
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
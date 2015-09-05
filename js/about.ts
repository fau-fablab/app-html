/// <reference path="iscroll.d.ts" />
/// <reference path="jquery.d.ts" />
$(document).ready(function () {
    // add vertical touch scrolling

    var vertScroll = new IScroll("#about_container");

    setTimeout(function () {
        vertScroll.refresh();
    }, 200);
});
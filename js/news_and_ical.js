/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />
// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function () {
    // make CORS REST calls by using class RestClient
    var client = new RestClient();
    // get news
    client.request("GET", "/news/all", addNews);
    // get icals
    client.request("GET", "/ical/all", addICals);
    // touch scrolling for iCals and news
    var vertScroll, horScroll;
    // callback function to add news to the news_container
    function addNews(news) {
        for (var i = 0; i < news.length; i++) {
            var image = news[i].linkToPreviewImage || "img/news_nopicture.png";
            $("#news_container").append("<div class='card' data-image='" + image + "' data-title='" + news[i].title + "' data-descriptionShort='" + news[i].descriptionShort + "'>" + "<div class=\"card-image\" style=\"background-image:url('" + image + "');\"/>" + "<h2>" + news[i].title + "</h2>" + "<p>" + news[i].descriptionShort + "</p></div>");
            // add vertical touch scrolling
            vertScroll = new IScroll("#wrapperNews", {
                hideScrollbar: true
            });
            vertScroll.refresh();
        }
        // show news dialog click function
        $(".card").click(function (event) {
            // return if it is a drag and not a click
            if (vertScroll.moved) {
                return false;
            }
            var card = $(this);
            // set max-height off dialog
            $("#newsDialogInner").css("max-height", getMaxHeightDialog());
            // disable scroll in the background
            disableScroll();
            var image = card.attr("data-image");
            var title = card.attr("data-title");
            var descriptionShort = convertToLinks(card.attr("data-descriptionShort"));
            // set content
            $("#dialogTitle").text(title);
            $("#dialogDescriptionShort").html(descriptionShort);
            $("#dialogImage").attr("src", image);
            // show dialog
            $("#openNewsDialog").addClass("newsDialog-active");
        });
        // close dialog
        $("#closeNewsDialog").click(function (event) {
            // close dialog
            $("#openNewsDialog").removeClass("newsDialog-active");
            // allow scrolling again
            $('body').css('overflow', 'auto').off('touchmove');
        });
    }
    // add iCals to ical_container
    function addICals(icals) {
        for (var i = 0; i < icals.length; i++) {
            // get parsed ical Event
            var ical = parseICalEvent(icals[i]);
            var title = ical[0];
            var date = ical[1];
            var time = ical[2];
            var location = ical[3];
            var description = ical[4];
            // add iCal
            $("#ical_container").append("<span class='ical' id='ical" + i + "'  data-title='" + title + "' data-date='" + date + "' data-time='" + time + "' data-location='" + location + "' data-description='" + description + "'>" + "<h2>" + title + "</h2>" + "<hr class='ical_line'>" + "<img src='img/ic_nav_news.png'>" + "<p>" + date + "<br/>" + time + "<br/>" + location + "</p>" + "</span>");
            // color the background of iCal according to event type
            var iCalDiv = $("#ical" + i);
            if (title.toUpperCase() == "SELFLAB") {
                iCalDiv.css("background-color", "#789487");
            }
            else if (title.toUpperCase() == "OPENLAB") {
                iCalDiv.css("background-color", "#788F94");
            }
            else {
                iCalDiv.css("background-color", "#9C5151");
            }
        }
        // adapt width of horizontal scroll area to #icals
        var count = $("#ical_container span").length;
        var iCalsWidth = count * (parseInt($("#ical_container span").css("width").replace("px", "")) + parseInt($("#ical_container span").css("margin-right").replace("px", "")) + parseInt($("#ical_container span").css("margin-left").replace("px", "")));
        $("#ical_container").css("width", (iCalsWidth + 16) + "px");
        // add horizontal touch scrolling
        var horScroll = new IScroll("#wrapperICal", {
            scrollX: true,
            hideScrollbar: true
        });
        horScroll.refresh();
        // show iCal dialog click function
        $(".ical").click(function (event) {
            // return if it is a drag and not a click
            if (horScroll.moved) {
                return false;
            }
            var ical = $(this);
            // set max-height off dialog
            $("#iCalDialogInner").css("max-height", getMaxHeightDialog());
            // disable scroll in the background
            disableScroll();
            // get content
            var title = ical.attr("data-title");
            var date = ical.attr("data-date");
            var location = ical.attr("data-location");
            var time = ical.attr("data-time");
            var description = ical.attr("data-description");
            // set content
            $("#iCalTitle").text(title);
            if (!(location == null || location == "" || location == "null")) {
                var temp = location;
                location = "</br>Wo: " + temp;
            }
            else {
                location = "";
            }
            if (!(description == null || description == "" || description == "null")) {
                var temp = description;
                description = "</br></br>" + temp;
            }
            else {
                description = "";
            }
            $("#iCalInfos").html("Uhrzeit: " + time + "<br/>Datum: " + date + location + description);
            // show dialog
            $("#openICalDialog").addClass("iCalDialog-active");
        });
        // close dialog
        $("#closeICalDialog").click(function (event) {
            // close dialog
            $("#openICalDialog").removeClass("iCalDialog-active");
            // allow scrolling again
            $('body').css('overflow', 'auto').off('touchmove');
        });
    }
    // return two digits representation of year/day/hours/minutes
    function twoDigits(n) {
        return n < 10 ? '0' + n : '' + n;
    }
    // parse iCal Event and return array with [title, date, time, location]
    function parseICalEvent(ical) {
        // get start date and time
        var dateStart = ical.start.split("T")[0];
        var timeStart = ical.start.split("T")[1].split("Z")[0];
        var dateObjectStart = new Date(dateStart.substr(0, 4), dateStart.substr(4, 2) - 1, parseInt(dateStart.substr(6)), timeStart.substr(0, 2), timeStart.substr(2, 2), timeStart.substr(4, 2));
        // get end date and time
        var dateEnd = ical.end.split("T")[0];
        var timeEnd = ical.end.split("T")[1].split("Z")[0];
        var dateObjectEnd = new Date(dateEnd.substr(0, 4), dateEnd.substr(4, 2), parseInt(dateEnd.substr(6)) - 1, timeStart.substr(0, 2), timeEnd.substr(2, 2), timeEnd.substr(4, 2));
        // get current date
        var currentDate = new Date();
        // date == today?
        var date;
        if (dateObjectStart.getUTCDate() == currentDate.getUTCDate() && dateObjectStart.getUTCMonth() == currentDate.getUTCMonth() && dateObjectStart.getUTCFullYear() == currentDate.getUTCFullYear()) {
            date = "Heute";
        }
        else {
            date = twoDigits(dateObjectStart.getUTCDate()) + "." + twoDigits((dateObjectStart.getUTCMonth() + 1)) + "." + dateObjectStart.getUTCFullYear();
        }
        // get location
        var location = ical.location || "";
        // allDay event?
        var time;
        if (ical.allday) {
            time = "ganztägig";
        }
        else {
            // set duration
            time = twoDigits(dateObjectStart.getUTCHours()) + ":" + twoDigits(dateObjectStart.getUTCMinutes()) + " - " + twoDigits(dateObjectEnd.getUTCHours()) + ":" + twoDigits(dateObjectEnd.getUTCMinutes());
        }
        // get title
        var title = ical.summery;
        // get description
        var description = ical.description;
        return [title, date, time, location, description];
    }
    // disable scroll when a dialog is opened
    function disableScroll() {
        $('body').css('overflow', 'hidden').on('touchmove', function (event) {
            event.preventDefault();
        });
    }
    // get maximum height of a dialog
    function getMaxHeightDialog() {
        var marginTop = $("#iCalDialogInner").css("margin-top").replace("px", "");
        var marginBottom = $("#iCalDialogInner").css("margin-bottom").replace("px", "");
        var maxHeight = $(window).height() - marginTop - marginBottom;
        return maxHeight;
    }
    // find links in the description and convert them to real links
    function convertToLinks(text) {
        var replacedText, replacePattern1, replacePattern2;
        //URLs starting with http://, https://
        replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
        replacedText = text.replace(replacePattern1, '<a class="colored-link-1" title="$1" href="$1" target="_blank">$1</a>');
        //URLs starting with "www."
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a class="colored-link-1" href="http://$2" target="_blank">$2</a>');
        //returns the text result
        return replacedText;
    }
});
//# sourceMappingURL=news_and_ical.js.map
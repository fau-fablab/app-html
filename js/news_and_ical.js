/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />
// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function () {
    // make CORS REST calls by using class RestClient
    var client = new RestClient();
    client.request("GET", "/news/all", addNews);
    // callback function to add news to the news_container
    function addNews(news) {
        for (var i = 0; i < news.length; i++) {
            var image = news[i].linkToPreviewImage || "img/news_nopicture.png";
            $("#news_container").append("<div class='card' data-image='" + image + "' data-title='" + news[i].title + "' data-descriptionShort='" + news[i].descriptionShort + "'>" + "<div class=\"card-image\" style=\"background-image:url('" + image + "');\"/>" + "<h2>" + news[i].title + "</h2>" + "<p>" + news[i].descriptionShort + "</p></div>");
        }
        // show news dialog click function
        $(".card").click(function (event) {
            var card = $(this);
            // set max-height off dialog
            var marginTop = $("#newsDialogInner").css("margin-top").replace("px", "");
            var marginBottom = $("#newsDialogInner").css("margin-bottom").replace("px", "");
            var maxHeight = $(window).height() - marginTop - marginBottom;
            $("#newsDialogInner").css("max-height", maxHeight);
            // disable scroll in the background and remember position
            $("#openNewsDialog").attr("data-scroll", $(document).scrollTop());
            $("#content").css("overflow", "hidden");
            // get content
            var image = card.attr("data-image");
            var title = card.attr("data-title");
            var descriptionShort = card.attr("data-descriptionShort");
            // set content
            $("#dialogTitle").text(title);
            $("#dialogDescriptionShort").text(descriptionShort);
            $("#dialogImage").attr("src", image);
            // show dialog
            $("#openNewsDialog").addClass("newsDialog-active");
        });
        // close dialog
        $("#closeNewsDialog").click(function (event) {
            // close dialog
            $("#openNewsDialog").removeClass("newsDialog-active");
            // allow scroll and set scroll pos
            $("#content").css("overflow", "visible");
            $(document).scrollTop($("#openNewsDialog").attr("data-scroll"));
        });
    }
});
//# sourceMappingURL=news_and_ical.js.map
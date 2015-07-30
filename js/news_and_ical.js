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
    }
});
//# sourceMappingURL=news_and_ical.js.map
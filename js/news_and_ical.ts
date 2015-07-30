/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />

// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function(){
	// make CORS REST calls by using class RestClient
	var client:RestClient = new RestClient();
	client.request("GET","/news/all", addNews);

    // callback function to add news to the news_container
	function addNews(news) {
		for (var i = 0; i < news.length; i++) {
            var image = news[i].linkToPreviewImage || "img/news_nopicture.png";
			$("#news_container").append("<div class='card' data-image='"+ image +"' data-title='"+ news[i].title +"' data-descriptionShort='"+
                news[i].descriptionShort +"'>" +
				"<div class=\"card-image\" style=\"background-image:url('" + image + "');\"/>" +
				"<h2>" + news[i].title + "</h2>" +
				"<p>" + news[i].descriptionShort + "</p></div>");
		}

        // show news dialog click function
        $(".card").click(function(event){

             var card = $(this);

            // set max-height off dialog
            var marginTop:any = $("#newsDialogInner").css("margin-top").replace("px", "");
            var marginBottom:any = $("#newsDialogInner").css("margin-bottom").replace("px", "");
            var maxHeight = $(window).height() - marginTop - marginBottom;
            $("#newsDialogInner").css("max-height", maxHeight);

            // disable scroll in the background
            $('body').css('overflow', 'hidden').on('touchmove', function(event) {
                event.preventDefault();
            });

            // get content
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
        $("#closeNewsDialog").click(function(event){
            // close dialog
            $("#openNewsDialog").removeClass("newsDialog-active");

            // allow scrolling again
            $('body').css('overflow', 'auto').off('touchmove');

        });
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

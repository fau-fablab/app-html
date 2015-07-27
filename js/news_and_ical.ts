/// <reference path="RestClient.ts"/>
﻿/// <reference path="jquery.d.ts" />

// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function(){
	// make CORS REST calls by using class RestClient
	var client:RestClient = new RestClient();
	client.request("GET","/news/all", addNews);
	function addNews(news){
		for(var i=0; i< news.length;i++){
			$("#news_container").append("<div class='card'>" +
					"<div class=\"card-image\" style=\"background-image:url('"+ news[i].linkToPreviewImage +"');\"/>" +
					"<h2>"+ news[i].title +"</h2>" +
					"<p>"+ news[i].descriptionShort +"</p></div>"); 
		}
	}
});

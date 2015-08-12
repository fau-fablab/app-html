/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />

// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function(){


    var LOADLIMIT = 2;
    var OFFSET = 0;

    var client:RestClient = new RestClient();

    client.request("GET","/products?offset="+OFFSET+"&limit="+LOADLIMIT, showProducts);


    function showProducts(records){
        for (var i = 0; i < records.length; i++) {
            $("#seach_results").append("<div> <h1> " + records[i].name + " " + records[i].location +  " </h1></div>");
        }
    }


});

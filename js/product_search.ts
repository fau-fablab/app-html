/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />

// import RestClient.js in order to use it and append this js
$.getScript("js/RestClient.js", function(){

});

function sayHallo(){
    alert("asdfaf")
}

function search(){
    var restClient = new RestClient();
    var LOADLIMIT = 50;
    var OFFSET = 0;
    var researchCriteria = $('#inputSuche').val();
    console.log(researchCriteria);

    hideEmptyResultText();

    if(researchCriteria == ""){
        console.log("war leer");
        restClient.request("GET","/products?offset="+OFFSET+"&limit="+LOADLIMIT, showProducts);
    }
    else if(isNumber(researchCriteria)){
        console.log("War number");
        restClient.request("GET","/products/find/id?id="+researchCriteria, showProducts);
    }
    else{
        console.log("War ein String");
        restClient.request("GET","/products/find/name?search="+researchCriteria+"&limit="+LOADLIMIT+"&offset="+OFFSET, showProducts);
    }


}

function showProducts(records){
    cleanTable();

    if(records.length == 0){
        console.log("Records waren leer");
        showEmptyResultText();
    }
    for (var i = 0; i < records.length; i++) {
        $("#search_results").append("<tr>" +
            " <td>"+ records[i].productId+"</td>" +
            " <td><div>"+ records[i].name+"</div><div>"+ records[i].category.name+"</div></td>" +
            " <td>"+ records[i].location+"</td>" +
            " <td><div>"+ records[i].price+" <span class=\"glyphicon glyphicon-euro\"></span></div><div>"+ records[i].uom.name+"</div></td>" +
            "</tr>");
    }
}

function isNumber(value: String){
    for(var index = 0; index < value.length; index++){
        if(value[index].search(/[0-9]/) == -1) {
            return false;
        }
    }
    return true;
}

function cleanTable(){
    console.log("clickt cleanTable");
    $("#search_results").empty();
}

function showEmptyResultText(){
    var headline = $("#empty_text").show();
    headline.text("Keine Treffer!");
}

function hideEmptyResultText(){
    $("#empty_text").hide();
}


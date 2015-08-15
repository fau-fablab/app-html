/// <reference path="restClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />
/// <reference path="common/model/category.ts" />
/// <reference path="common/model/product.ts" />


function search(): void{
    console.log("Start 07");
    var restClient = new RestClient();
    var LOADLIMIT: number = 50;
    var OFFSET: number = 0;
    var researchCriteria: any = $('#inputSuche').val();

    hideEmptyResultText();


    if(researchCriteria == ""){
        console.log("war leer");
        restClient.request("GET","/products?offset="+OFFSET+"&limit="+LOADLIMIT, showProducts);
    }
    else if(isNumber(researchCriteria)){
        restClient.request("GET","/products/find/id?id="+researchCriteria, showProducts);
    }
    else{
        restClient.request("GET","/products/find/name?search="+researchCriteria+"&limit="+LOADLIMIT+"&offset="+OFFSET, showProducts);
    }

}

function showProducts(records: any): void{
    cleanTable();
    if(records.length == 0){
        console.log("Records waren leer");
        showEmptyResultText();
    }
    for (var i = 0; i < records.length; i++) {
        var product = new common.product(records[i]);


        // probleme mit
        var categoryName: string= product._categoryObject._name;
        var uomName: string = product._uomObject._name;






        $("#search_results").append("<tr>" +
            " <td>"+ product._productId+"</td>" +
            " <td><div>"+ product._name+"</div><div>"+ categoryName+"</div></td>" +
            " <td>"+ product._locationString+"</td>" +
            " <td><div>"+ product._price+" <span class=\"glyphicon glyphicon-euro\"></span></div><div>"+ uomName+"</div></td>" +
            "</tr>");
    }
}

function isNumber(value: String): boolean{
    for(var index = 0; index < value.length; index++){
        if(value[index].search(/[0-9]/) == -1) {
            return false;
        }
    }
    return true;
}

function cleanTable(): void{
    console.log("clickt cleanTable");
    $("#search_results").empty();
}

function showEmptyResultText(): void{
    var headline = $("#empty_text").show();
    headline.text("Keine Treffer!");
}

function hideEmptyResultText(): void{
    $("#empty_text").hide();
}


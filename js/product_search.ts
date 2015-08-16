/// <reference path="restClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />
/// <reference path="common/model/category.ts" />
/// <reference path="common/model/product.ts" />

var currentProcutList: Array<common.Product> = new Array<common.Product>();

function search(): void{
    console.log("Start 08");
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
    for (var index = 0; index < records.length; index++) {
        var product = new common.Product(records[index]);
        currentProcutList.push(product);
        // probleme mit
        var categoryName: string= product._categoryObject._name;
        var uomName: string = product._uomObject._name;


        $("#search_results").append("<tr data-toggle='modal' data-target='#myModal' class='product_row' productid='"+ product._productId +"' arrayindex='"+index+"'> " +
            " <td id='productId' '>"+ product._productId+"</td>" +
            " <td id='productName'><div>"+ product._name+"</div><div>"+ categoryName+"</div></td>" +
            " <td id='productLocation'>"+ product._locationString+"</td>" +
            " <td id='productPrice'><div>"+ product._price+" <span class=\"glyphicon glyphicon-euro\"></span></div><div>"+ uomName+"</div></td>" +
            "</tr>");
    }


    $(".product_row").click(function(event){

        var currentElement = $(this);
        var productId = currentElement.attr("productid");
        var arrayIndex = currentElement.attr("arrayindex");
        var currentProduct: common.Product = currentProcutList[arrayIndex];
        console.log("ProductId: " + productId);
        console.log("ArrayIndex: " + arrayIndex);
        console.log("ProductId: " + currentProcutList[arrayIndex]._productId)

        var modalHeaderName = $("#myModalLabel");
        var modalProductIdLabel = $("#modal-productid");
        var modalProductNameLabel = $("#modal-productname");
        var modalProductDescriptionLabel = $("#modal-productdescription");
        var modalProductPriceLabel = $("#modal-productprice");
        var modalProductUnitLabel = $("#modal-productunit");
        var modalProductLocationLabel = $("#modal-productlocation");
        var modalProductCategoryLabel = $("#modal-productCategory");

        modalHeaderName.text(currentProduct._name);
        modalProductIdLabel.text(currentProduct._productId+"");
        modalProductNameLabel.text(currentProduct._name);
        modalProductDescriptionLabel.text(currentProduct._description);
        modalProductPriceLabel.text(currentProduct._price + " \u20AC");
        modalProductUnitLabel.text(currentProduct._unit);
        modalProductLocationLabel.text(currentProduct._locationString);
        modalProductCategoryLabel.text(currentProduct._categoryString);

    });
}

function clickedProductElement(){
    alert("asdfasdf ");
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
    currentProcutList.length = 0;
    $("#search_results").empty();
}

function showEmptyResultText(): void{
    var headline = $("#empty_text").show();
    headline.text("Keine Treffer!");
}

function hideEmptyResultText(): void{
    $("#empty_text").hide();
}


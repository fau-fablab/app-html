/// <reference path="RestClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />
/// <reference path="common/model/Category.ts" />
/// <reference path="common/model/Product.ts" />
/// <reference path="cart_functions.ts"/>

var currentProcutList:Array<common.Product> = new Array<common.Product>();
var vertScroll:any;
var LOADLIMIT: number = 10;
var OFFSET:number = 0;
var searchingProducts:boolean = false;
var restClient = new RestClient();

$(document).ready(function () {
    var ajaxLoader: any = $('#ajax_loader_div');
    ajaxLoader.hide();
});

document.onkeydown = function(event) {
    if(event.keyCode == 13){
        search();
    }
}

function search():void {

    var researchCriteria:any = $('#inputSuche').val();
    var ajaxLoader: any = $('#ajax_loader_div');
    ajaxLoader.show();

    if (researchCriteria == "") {
        restClient.request("GET", "/products?offset=" + OFFSET + "&limit=" + LOADLIMIT, showProducts);
    }
    else if (isNumber(researchCriteria)) {
        restClient.request("GET", "/products/find/id?id=" + researchCriteria, showProduct);
    }
    else {
        restClient.request("GET", "/products/find/name?search=" + researchCriteria + "&limit=" + LOADLIMIT + "&offset=" + OFFSET, showProducts);
    }
}
/*
function addMoreProducts(record:any){

    var pos:number[] = [0,0];
    if(vertScroll){
        pos[0] = vertScroll.x;
        pos[1] = vertScroll.y;
        vertScroll.destroy();
    }
}

 function loadMoreProducts(){
 if( Math.abs(vertScroll.maxScrollY) - Math.abs(vertScroll.y) <= 10) {
 if (!searchingProducts) {
 searchingProducts = true;
 // show loader gif

 // number of news that are already loaded
 var count:number = $("#search_results table").length;
 console.log("Anzahl der counts beim scrolln: " + count);
 // send request
 client.request("GET", "/products?offset=" + count + "&limit=" + LOADLIMIT, showProducts);
 }
 }
 }
*/

function showProduct(record:any):void {
    var recordArray = [];
    recordArray.push(record);
    showProducts(recordArray);
}



function showProducts(records:any):void {
    cleanTable();
    currentProcutList.length = 0;

/*
    var pos:number[] = [0,0];
    if(vertScroll){
        pos[0] = vertScroll.x;
        pos[1] = vertScroll.y;
        vertScroll.destroy();
    }

    vertScroll = new IScroll("#search_results_container",{
        probeType: 3,
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true
    });
    // check scroll position to load dynamically more news
    vertScroll.on("scroll", loadMoreNews);
    vertScroll.refresh();
    vertScroll.scrollTo(pos[0],pos[1]);
*/

    if (records.length == 0) {
        showEmptyResultText();
    }
    for (var index = 0; index < records.length; index++) {
        var product = new common.Product(records[index]);
        currentProcutList.push(product);
    }
    createTableRows(currentProcutList);
    prepareDialogFunktions();
    var ajaxLoader: any = $('#ajax_loader_div');
    ajaxLoader.hide();
}

function prepareDialogFunktions() {
    $(".product_row").click(function (event) {

        var currentElement = $(this);
        var productId = currentElement.attr("productid");
        var arrayIndex = currentElement.attr("arrayindex");
        var currentProduct:common.Product = currentProcutList[arrayIndex];

        var modalHeaderName = $("#myModalLabel");
        var modalProductIdLabel = $("#modal-productid");
        var modalProductNameLabel = $("#modal-productname");
        var modalProductDescriptionLabel = $("#modal-productdescription");
        var modalProductPriceLabel = $("#modal-productprice");
        var modalProductUnitLabel = $("#modal-productunit");
        var modalProductLocationLabel = $("#modal-productlocation");
        var modalProductCategoryLabel = $("#modal-productCategory");
        var modalProductMapLink = $("#modal-productMap");
        var modalProductAddToCart = $("#modal-productAddToCart");

        modalProductAddToCart.attr("data-product", JSON.stringify(currentProduct));
        modalHeaderName.text(currentProduct.name);
        modalProductIdLabel.text(currentProduct.productId + "");
        modalProductNameLabel.text(currentProduct.name);
        modalProductDescriptionLabel.text(currentProduct.description);
        modalProductPriceLabel.text(currentProduct.price + " \u20AC");
        modalProductUnitLabel.text(currentProduct.unit);
        modalProductLocationLabel.text(currentProduct.locationString);
        modalProductCategoryLabel.text(currentProduct.categoryString);

        var preparedLocationString = currentProduct.locationForProductMap;
        //preparedLocationString = preparedLocationString.replace(" / ", "/" );
        //preparedLocationString = preparedLocationString.replace(" ","_");
        var newlocationURL = "https://ec2-52-28-16-59.eu-central-1.compute.amazonaws.com:4433/productMap/productMap.html" + "?id=" + preparedLocationString;
        modalProductMapLink.attr("href", newlocationURL);

    });
}

function createTableRows(productArray:Array<common.Product>) {
    cleanTable();
    for (var index = 0; index < productArray.length; index++) {
        var product = productArray[index];
        var categoryName:string = product.categoryObject.name;
        var uomName:string = product.uomObject.name;

        $("#search_results").append("<tr data-toggle='modal' data-target='#myModal' class='product_row' productid='" + product.productId + "' arrayindex='" + index + "'> " +
            " <td id='productId' '>" + product.productId + "</td>" +
            " <td id='productName'><div>" + product.name + "</div><div>" + categoryName + "</div></td>" +
            " <td id='productLocation'>" + product.locationString + "</td>" +
            " <td id='productPrice'><div>" + product.price + " <span class=\"glyphicon glyphicon-euro\"></span></div><div>" + uomName + "</div></td>" +
            "</tr>");
    }
    prepareDialogFunktions();
}

function createTableHeader() {
    $("#search_results").append("<tr> " +
        " <th onclick='sortById()'>" + "Id" + "</th>" +
        " <th onclick='sortByName()'>" + "Name" + "</th>" +
        " <th onclick='sortByLocation()'>" + "Lagerort" + "</th>" +
        " <th onclick='sortByPrice()'>" + "Preis" + "</th>" +
        "</tr>");
}

function isNumber(value:String):boolean {
    for (var index = 0; index < value.length; index++) {
        if (value[index].search(/[0-9]/) == -1) {
            return false;
        }
    }
    return true;
}

function cleanTable():void {
    $("#search_results").empty();
    createTableHeader();
}

function showEmptyResultText():void {
    var headline = $("#empty_text").show();
    headline.text("Keine Treffer!");
}

function hideEmptyResultText():void {
    $("#empty_text").hide();
}

function sortById() {
    var newArrayAscendingOrder = new Array<common.Product>();
    //var newArrayDescendingOrder = new Array<common.Product>();

    newArrayAscendingOrder = currentProcutList;

    var tempProduct:common.Product = null;

    for (var index = 0; index < newArrayAscendingOrder.length - 1; index++) {
        for (var innerIndex = 0; innerIndex < newArrayAscendingOrder.length - 1; innerIndex++) {
            if (newArrayAscendingOrder[innerIndex].productId > newArrayAscendingOrder[innerIndex + 1].productId) {
                tempProduct = newArrayAscendingOrder[innerIndex];
                newArrayAscendingOrder[innerIndex] = newArrayAscendingOrder[innerIndex + 1];
                newArrayAscendingOrder[innerIndex + 1] = tempProduct;
            }
        }
    }
    createTableRows(newArrayAscendingOrder);
}

function sortByName() {
    newArrayAscendingOrder: Array<common.Product>();
    var newArrayAscendingOrder = new Array<common.Product>();
    //var newArrayDescendingOrder = new Array<common.Product>();

    newArrayAscendingOrder = currentProcutList;

    var tempProduct:common.Product = null;

    for (var index = 0; index < newArrayAscendingOrder.length - 1; index++) {
        for (var innerIndex = 0; innerIndex < newArrayAscendingOrder.length - 1; innerIndex++) {
            if ((newArrayAscendingOrder[innerIndex].name[0]) > (newArrayAscendingOrder[innerIndex + 1].name[0])) {
                tempProduct = newArrayAscendingOrder[innerIndex];
                newArrayAscendingOrder[innerIndex] = newArrayAscendingOrder[innerIndex + 1];
                newArrayAscendingOrder[innerIndex + 1] = tempProduct;
            }
        }
    }
    createTableRows(newArrayAscendingOrder);
}

function sortByLocation() {
    newArrayAscendingOrder: Array<common.Product>();
    var newArrayAscendingOrder = new Array<common.Product>();
    //var newArrayDescendingOrder = new Array<common.Product>();

    newArrayAscendingOrder = currentProcutList;
    var tempProduct:common.Product = null;

    for (var index = 0; index < newArrayAscendingOrder.length - 1; index++) {
        for (var innerIndex = 0; innerIndex < newArrayAscendingOrder.length - 1; innerIndex++) {
            if ((newArrayAscendingOrder[innerIndex].locationString[0]) > (newArrayAscendingOrder[innerIndex + 1].locationString[0])) {
                tempProduct = newArrayAscendingOrder[innerIndex];
                newArrayAscendingOrder[innerIndex] = newArrayAscendingOrder[innerIndex + 1];
                newArrayAscendingOrder[innerIndex + 1] = tempProduct;
            }
        }
    }
    createTableRows(newArrayAscendingOrder);
}

function sortByPrice() {
    var newArrayAscendingOrder = new Array<common.Product>();
    //var newArrayDescendingOrder = new Array<common.Product>();

    newArrayAscendingOrder = currentProcutList;

    var tempProduct:common.Product = null;

    for (var index = 0; index < newArrayAscendingOrder.length - 1; index++) {
        for (var innerIndex = 0; innerIndex < newArrayAscendingOrder.length - 1; innerIndex++) {
            if ((newArrayAscendingOrder[innerIndex].price * 1000) > (newArrayAscendingOrder[innerIndex + 1].price * 1000)) {
                tempProduct = newArrayAscendingOrder[innerIndex];
                newArrayAscendingOrder[innerIndex] = newArrayAscendingOrder[innerIndex + 1];
                newArrayAscendingOrder[innerIndex + 1] = tempProduct;
            }
        }
    }
    createTableRows(newArrayAscendingOrder);

}

// add product to cart button from product search
$("#modal-productAddToCart").click(function(){

    var btn = $(this);
    var product:any = JSON.parse(btn.attr("data-product"));
    var numberValue: any = $("#modal-number").val();
    var count: number = parseInt(numberValue);
    product.__proto__ = common.Product.prototype;
    addProduct(new common.CartEntry(product,count));
    // let it bounce
    setTimeout(function () {
        (<any>$("#cart_button_quantity")).effect("bounce", { times:3 }, 300);
    }, 200);
});

$("#modal-number-down").click(function(){
    var dialogProductPrice = $("#modal-productprice").text();
    var dialogProductID = $("#modal-productid").text();
    var product: common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));
    var numberValue: any = $("#modal-number").val();
    var count: number = parseInt(numberValue);
    count--;
    if(count >= 0){
        var newValue: any = count;
        $("#modal-number").val(newValue);
        var newPrice: number = product.price * newValue;
        $("#modal-productprice").text(product.price+ " \u20AC" + " ("+ newPrice + " \u20AC" +")");
    }
});

$("#modal-number-up").click(function(){
    var dialogProductPrice = $("#modal-productprice").text();
    var dialogProductID = $("#modal-productid").text();
    var product: common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));
    var numberValue: any = $("#modal-number").val();
    var count: number = parseInt(numberValue);
    count++;
    if(count < 1000){
        var newValue: number = count;
        $("#modal-number").val(newValue+"");
        console.log("Produkt-Price: " + product.price);
        console.log("Count: " + newValue);
        var newPrice: number = product.price * newValue;
        $("#modal-productprice").text(product.price+ " \u20AC" + " ("+ newPrice + " \u20AC" +")");
    }
});

function getProductByID(procutList:Array<common.Product>,id:number):common.Product{
    for(var index = 0; index<procutList.length;index++){
        if(procutList[index].productId == id){
            return procutList[index];
        }
    }
    // not possible
    return null;
}

function clearNumberPicker(){
    $("#modal-number").val("1");
}



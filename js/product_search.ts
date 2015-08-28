/// <reference path="common/rest/ProductApi.ts"/>
/// <reference path="common/model/Category.ts" />
/// <reference path="common/model/Product.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="jquery.d.ts" />
/// <reference path="iscroll.d.ts" />
/// <reference path="cart_functions.ts"/>

var currentProcutList:Array<common.Product> = new Array<common.Product>();
var vertScroll:any;
var LOADLIMIT: number = 10;
var OFFSET:number = 0;
var productApi: ProductApi = new ProductApi();
// scrollelement
var vertScroll;
// prevent loading further products when they are already loading
var searchingProducts:boolean = false;
// which search was used?
var findAllSearch:string = "false";

$(document).ready(function () {
    $('#loadMoreProductsLoader').hide();
});

document.onkeydown = function(event) {
    if(event.keyCode == 13){
        search();
    }
}

function search():void {
    cleanTable();
    var researchCriteria:any = $('#inputSuche').val();
    $('#loadMoreProductsLoader').show();

    if (researchCriteria == "") {
        findAllSearch = "true";

        productApi.findAll(LOADLIMIT,OFFSET,showSearchResults);
    }
    else if (isNumber(researchCriteria)) {

        productApi.findById(researchCriteria,showProduct);
    }
    else {
        findAllSearch = researchCriteria;

        productApi.findByName(researchCriteria,LOADLIMIT,OFFSET,showSearchResults);
    }
}

function showProduct(record:any):void {
    cleanTable();
    var recordArray = [];
    recordArray.push(record);
    showProducts(recordArray);
}

function showSearchResults(records:any):void{
    cleanTable();
    currentProcutList.length = 0;
    showProducts(records);
}


function showProducts(records:any):void {
    // remember scroll position
    var pos:number[] = [0,0];
    if(vertScroll){
        pos[0] = vertScroll.x;
        pos[1] = vertScroll.y;
        vertScroll.destroy();
    }

    if (records.length == 0) {
        showEmptyResultText();
    }
    for (var index = 0; index < records.length; index++) {
        var product = new common.Product(records[index]);
        currentProcutList.push(product);
    }
    createTableRows(currentProcutList);
    prepareDialogFunktions();
    $('#loadMoreProductsLoader').hide();

    // add vertical touch scrolling
    vertScroll = new IScroll("#search_results_container",{
        probeType: 3,
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true
    });
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);

    // check scroll position to load dynamically more Products
    vertScroll.on("scroll", loadMoreProducts);
    vertScroll.refresh();
    vertScroll.scrollTo(pos[0],pos[1]);
    // Products loaded -> new iCals can be loaded while scrolling
    searchingProducts = false;
}

// load more products when scrolling
function loadMoreProducts():void{
    if( Math.abs(vertScroll.maxScrollY) - Math.abs(vertScroll.y) <= 10) {
        if (!searchingProducts) {
            searchingProducts = true;
            // show loader gif
            $('#loadMoreProductsLoader').show();
            // number of products that are already loaded
            var count:number = $("#search_results tr").length-1;

            // send request
            // which search was used?
            if(findAllSearch == "true"){
                productApi.findAll(LOADLIMIT,count,showProducts);
            }else{
                productApi.findByName(findAllSearch,LOADLIMIT,count,showProducts);
            }
        }
    }
}

function prepareDialogFunktions() {
    $(".product_row").click(function (event) {
        // return if it is a drag and not a click
        if (vertScroll.moved) {
            return false;
        }

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



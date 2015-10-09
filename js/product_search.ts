/// <reference path="common/rest/ProductApi.ts"/>
/// <reference path="common/rest/CategoryApi.ts"/>
/// <reference path="common/model/Category.ts" />
/// <reference path="common/model/Product.ts" />
/// <reference path="jquery.d.ts" />
/// <reference path="cart_functions.ts"/>
/// <reference path="util/Formatter.ts"/>
/// <reference path="elements/ProductCounter.ts"/>
/// <reference path="elements/ProductDialog.ts"/>
/// <reference path="elements/CategoryView.ts"/>

/// <reference path="util/Utils.ts"/>

var currentProcutList:Array<common.Product> = [];
var autoComplitionArray:Array<string> = [];
var LOADLIMIT:number = 10;
var OFFSET:number = 0;
var productApi:ProductApi = new ProductApi();
var categoryApi:CategoryApi = new CategoryApi();
var formatter:Formatter = new Formatter();
var productCounter:ProductCounter;
var utils:Utils = new Utils();
var api = new CategoryApi();
var categoryView: CategoryView;
// scrollelement

// prevent loading further products when they are already loading
var searchingProducts:boolean = false;
// which search was used?
var findAllSearch:string = "false";

document.onkeydown = function (event) {
    if (event.keyCode == 13) {
        search();
    }
};

$(document).ready(function () {

    // disable input til list is loaded
    $("#inputSuche").prop("disabled", true);
    $("#search_btn").prop("disabled", true);
    $("#loadDataLoader").show();

    $('#loadMoreProductsLoader').hide();
    var selectElement = $('#category_options');
    categoryApi.getAutocompletions(callbackCategoryAutoCompletions);
    categoryApi.findAll(callBackCategories);
    var productApi:ProductApi = new ProductApi();
    productApi.getAutocompletions(callbackAutoCompletions);

    // set and initialise tooltip
    var tooltip:any = $("#search_tooltip");
    tooltip.prop("title", "Gib dein gewünschtes Produkt ein und drücke auf Suchen. Wenn du alle Produkte finden willst, " +
        "dann lasse das Feld frei und suche direkt. Alternativ kannst du auch die Produktid eingeben.");
    tooltip.tooltip({placement: 'bottom'});

    // add change listener for data list to start search when option is selected
    $("#inputSuche").on("input", function () {
        var found:boolean = (<any>$).inArray($(this).val(), autoComplitionArray) > -1;
        if (found) {
            search();
        }
    });
});

function callBackCategories(records:Array<common.Category>){
    var categoryTree: common.Category = api.getCategoriesAsTree(records);
    var categoryTreeFirstLevel: Array<any> = new Array();
    var categoryViewElement = $("#category_search_result");
    categoryView = new CategoryView($("#category_search_result"));
    categoryView.createNewCategoryView(categoryTree);
}

function callbackCategoryAutoCompletions(records):void{
    var selectedElement = $('#category_options');
    for(var index = 0; index < records.length;index++){
        selectedElement.append("<option>"+records[index]+"</option>");
    }
    selectedElement.prop("selectedIndex", 0);
}

function callbackAutoCompletions(records):void {
    autoComplitionArray = records;
    var datalist = $("#product_options");
    for (var index = 0; index < autoComplitionArray.length; index++) {
        datalist.append("<option value='" + autoComplitionArray[index] + "'></option>");
    }
    // enable search
    $("#inputSuche").prop("disabled", false);
    $("#search_btn").prop("disabled", false);
    $("#loadDataLoader").hide();
}

function search():void {
    cleanTable();
    var errorLabel = $("#errorMessageSearch");
    errorLabel.hide();
    var researchCriteria:any = $('#inputSuche').val();
    var selectedElement = $('#category_options');
    var selectedValue = selectedElement.find(":selected").val();

    var checkedValue = $('#wellform input:radio:checked').val();
    switch (checkedValue) {
        case "byName":
            productApi.findByName(researchCriteria, LOADLIMIT, OFFSET, showSearchResults);
            $('#loadMoreProductsLoader').show();
            break;
        case "allProducts":
            productApi.findAll(LOADLIMIT, OFFSET, showSearchResults);
            $('#loadMoreProductsLoader').show();
            break;
        case "byId":
            if(researchCriteria.length > 0) {
                if (utils.isInteger(researchCriteria)) {
                    productApi.findById(researchCriteria, showProduct);
                    $('#loadMoreProductsLoader').show();
                }
                else{
                    showErrorMessage("Geben Sie bitte eine vierstellige Zahl ein. (z.B. 008 oder 1342)");
                }
            }else{
                showErrorMessage("Geben Sie bitte eine vierstellige Zahl ein. (z.B. 008 oder 1342)");
            }
            break;
        case "byCategory":
            productApi.findByCategory(selectedValue,0,0,showSearchResults);
            $('#loadMoreProductsLoader').show();
            break;
    }
}
function showErrorMessage(aValue: string){
    var errorLabel = $("#errorMessageSearch");
    errorLabel.text(aValue);
    errorLabel.show();
}

function showProduct(record:any):void {
    cleanTable();
    var recordArray = [];
    recordArray.push(record);
    currentProcutList.length = 0;
    showProducts(recordArray);
}

function showSearchResults(records:any):void {
    cleanTable();
    currentProcutList.length = 0;
    showProducts(records);
}

function showProducts(records:any):void {
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
    // check scroll position to load dynamically more Products
    // Products loaded -> new iCals can be loaded while scrolling
    searchingProducts = false;
}


var productDialog:ProductDialog;
function prepareDialogFunktions() {
    $(".product_row").click(function () {
        $('body').css('overflow','hidden');
        $('body').css('position','fixed');
        var currentElement = $(this);
        var productId = currentElement.attr("productid");
        var arrayIndex = currentElement.attr("arrayindex");
        var currentProduct:common.Product = currentProcutList[arrayIndex];
        productCounter = new ProductCounter(currentProduct.uomObject.rounding);
        productDialog = new ProductDialog(currentProduct);

        // close dialog
        $(".closeSearchDialog").click(function(event){
            $('body').css('overflow','auto');
            $('body').css('position','relative');
        });

    });
}

function createTableRows(productArray:Array<common.Product>) {
    cleanTable();

    for (var index = 0; index < productArray.length; index++) {
        var product = productArray[index];
        var categoryName:string = product.categoryObject.name;
        var uomName:string = product.uomObject.name;
        var productRow = $("");

        $("#search_results").append("<tr data-toggle='modal' data-target='#myModal' class='product_row' productid='" + product.productId + "' arrayindex='" + index + "'> " +
            " <td id='productId' '>" + product.productId + "</td>" +
            " <td id='productName'><div>" + product.name + "</div><div>" + categoryName + "</div></td>" +
            " <td id='productLocation'>" + product.locationString + "</td>" +
            " <td id='productPrice'><div>" + formatter.formatNumberToPrice(product.price) + " <span class=\"glyphicon glyphicon-euro\"></span></div><div>" + uomName + "</div></td>" +
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
    var newArrayAscendingOrder = [];
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
    Array<common.Product>();
    var newArrayAscendingOrder = [];
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
    Array<common.Product>();
    var newArrayAscendingOrder = [];
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
    var newArrayAscendingOrder = [];
    //var newArrayDescendingOrder = new Array<common.Product>()
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
$("#modal-productAddToCart").click(function () {

    var btn = $(this);
    var product:any = JSON.parse(btn.attr("data-product"));
    var numberValue:any = $("#modal-number").val();
    var count:number = numberValue;
    product.__proto__ = common.Product.prototype;
    var cartButtonQuantity = $("#cart_button_quantity");
    cartButtonQuantity.hide();

    addProduct(new common.CartEntry(product, count));
    // let it bounce

    cartButtonQuantity.show();
    setTimeout(function () {
        (<any>$("#cart_button_quantity")).effect("bounce", {times: 3}, 300);
    }, 200);
});


$("#modal-number-down").click(function () {

    var dialogProductPrice = $("#modal-productprice").text();
    var dialogProductID = $("#modal-productid").text();
    var product:common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));
    var numberValue:any = $("#modal-number").val();
    var count:number = parseInt(numberValue);
    count--;
    if (count >= 0) {
        var newValue:any = count;
        $("#modal-number").val(newValue);
        var newPrice:number = product.price * newValue;
        var formatedPrice = formatter.formatNumberToPrice(product.price);
        var formatedNewPrice = formatter.formatNumberToPrice(newPrice);
        $("#modal-productprice").text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
    }
});

$("#modal-number-up").click(function () {
    var dialogProductPrice = $("#modal-productprice").text();
    var dialogProductID = $("#modal-productid").text();
    var product:common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));
    var numberValue:any = $("#modal-number").val();
    var count:number = parseInt(numberValue);
    count++;
    if (count < 1000) {
        var newValue:number = count;
        $("#modal-number").val(newValue + "");
        var newPrice:number = product.price * newValue;
        var formatedPrice = formatter.formatNumberToPrice(product.price);
        var formatedNewPrice = formatter.formatNumberToPrice(newPrice);
        $("#modal-productprice").text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
    }
});

$("#modal-number").change(function () {

    var modalNumberLabel = $("#modal-number");
    var numberValue:any = modalNumberLabel.val();

    var util:Utils = new Utils();
    var modal_productId:any = $("#modal-productid");
    var dialogProductID = modal_productId.text();
    var product:common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));

    numberValue = util.replaceAllCommaToDots(numberValue);
    if (!(util.isPositivNumber(numberValue))) {
        modalNumberLabel.val("1");
        numberValue = 1;
    }

    if (!(util.isValidRoundingValue(numberValue, product.uomObject.rounding))) {
        modalNumberLabel.val("1");
        numberValue = 1;
    }

    var dialogProductID = modal_productId.text();
    var product:common.Product = getProductByID(currentProcutList, parseInt(dialogProductID));
    var newPrice:number = product.price * numberValue;

    var formatedPrice = formatter.formatNumberToPrice(product.price);
    var formatedNewPrice = formatter.formatNumberToPrice(newPrice);
    $("#modal-productprice").text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");

});

function getProductByID(procutList:Array<common.Product>, id:number):common.Product {
    for (var index = 0; index < procutList.length; index++) {
        if (procutList[index].productId == id) {
            return procutList[index];
        }
    }
    // not possible
    return null;
}

function clearNumberPicker() {
    $("#modal-number").val("1");
}






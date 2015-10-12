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
/// <reference path="elements/InfoResource.ts"/>
/// <reference path="util/Utils.ts"/>

var LOADLIMIT:number = 0;
var OFFSET:number = 0;

var _productApi:ProductApi = new ProductApi();
var _categoryApi:CategoryApi = new CategoryApi();

var _currentProcutList:Array<common.Product> = new Array();
var _allProducts: Array<common.Product> = new Array();
var _autoComplitionProductArray:Array<string> = [];
var _infoResource: InfoResource = new InfoResource();

var _categoryTree: common.Category;
var _categoryView: CategoryView;

var _formatter:Formatter = new Formatter();
var _productCounter:ProductCounter;
var _utils:Utils = new Utils();

var extendedSearchLink;
var searchButton = $("#search_btn");
var searchInfoButton = $("#search_tooltip");
var searchInputField = $("#inputSuche");
var searchErrorField = $("#errorMessageSearch");

var resultProductContainer = $("#search_results_container");
var resultProductTable = $("#search_results");
var autocomplicationLoaderImage = $("#loadDataLoader");
var productResultLoaderImage = $('#loadMoreProductsLoader');

var resultCategoryContainer = $("#search_result_category_container");
var resultCategoryList = $("#category_search_result");
var categoryResultLoaderImage = $("#loadMoreProductsLoaderForCategories");
var categorySelectionField = $('#category_options');

document.onkeydown = function (event) {
    if (event.keyCode == 13) {
        search();
    }
};

$(document).ready(function () {
    // disable input til list is loaded
    categorySelectionField.hide();
    $( ".radio" ).change(function() {
        var checkedValue = $('#wellform input:radio:checked').val();
        switch (checkedValue) {
            case "byName":
                searchInputField.prop("disabled", false);
                categorySelectionField.hide();
                break;
            case "allProducts":
                searchInputField.prop("disabled", false);
                categorySelectionField.hide();
                break;
            case "byId":
                searchInputField.prop("disabled", false);
                categorySelectionField.hide();
                break;
            case "byCategory":
                searchInputField.prop("disabled", true);
                categorySelectionField.show();
                break;
            case "byCategoryTree":
                searchInputField.prop("disabled", false);
                categorySelectionField.hide();
                break;
        }
    });
    searchInputField.prop("disabled", true);
    searchButton.prop("disabled", true);
    autocomplicationLoaderImage.show();
    productResultLoaderImage.hide();
    resultProductContainer.hide();
    resultCategoryContainer.hide();
    // loadAllProducts

    _productApi.findAll(0,0,callBackAllProducts);

    var selectElement = categorySelectionField;
    _categoryApi.getAutocompletions(callbackCategoryAutoCompletions);


    _productApi.getAutocompletions(callbackAutoCompletions);

    // set and initialise tooltip
    console.log("vor tooltip");
    var tooltip:any = searchInfoButton;
    tooltip.prop("title", _infoResource.productInfo);
    tooltip.tooltip({placement: 'bottom'});
    console.log("nach tooltip");

});

function callBackCategoryTree(records:Array<common.Category>){
    _categoryTree = _categoryApi.getCategoriesAsTree(records);
    if(_allProducts.length != 0){
        var categoryViewElement = resultCategoryList;
        _categoryView = new CategoryView(resultCategoryList);
        _categoryView.createNewCategoryView(_categoryTree,_allProducts);
    }
    prepareDialogForTreeListFunctions();
    categoryResultLoaderImage.hide();
}

function callBackAllProducts(records:any){
    for (var index = 0; index < records.length; index++) {
        var product = new common.Product(records[index]);
        _allProducts.push(product);
    }
}

function callbackCategoryAutoCompletions(records):void{
    var selectedElement = categorySelectionField;
    for(var index = 0; index < records.length;index++){
        selectedElement.append("<option>"+records[index]+"</option>");
    }
    selectedElement.prop("selectedIndex", 0);
}

function callbackAutoCompletions(records):void {
    searchInputField.prop("disabled", false);
    searchButton.prop("disabled", false);

    autocomplicationLoaderImage.hide();
    _autoComplitionProductArray = records;
    // enable search

    // autocompletion
    (<any>searchInputField).autocomplete({
        minLength: 2,
        source: _autoComplitionProductArray,
        select: function( event, ui ) {
            searchInputField.val(ui.item.value);
            search();
        }
    });
}

function search():void {
    cleanTable();
    var errorLabel = searchErrorField;
    errorLabel.hide();

    var researchCriteria:any = $('#inputSuche').val();
    var selectedElement = categorySelectionField;
    var selectedValue = selectedElement.find(":selected").val();

    var checkedValue = $('#wellform input:radio:checked').val();
    switch (checkedValue) {
        case "byName":
            resultCategoryContainer.hide();
            resultProductContainer.show();
            _productApi.findByName(researchCriteria, LOADLIMIT, OFFSET, showSearchResults);
            productResultLoaderImage.show();
            break;
        case "allProducts":
            resultCategoryContainer.hide();
            resultProductContainer.show();
            _productApi.findAll(LOADLIMIT, OFFSET, showSearchResults);
            productResultLoaderImage.show();
            break;
        case "byId":
            resultCategoryContainer.hide();
            resultProductContainer.show();
            if(researchCriteria.length == 4) {
                if (_utils.isInteger(researchCriteria)) {
                    _productApi.findById(researchCriteria, showProduct);
                    productResultLoaderImage.show();
                }
                else{
                    showErrorMessage("Geben Sie bitte eine vierstellige Zahl ein. (z.B. 0008 oder 1342)");
                }
            }else{
                showErrorMessage("Geben Sie bitte eine vierstellige Zahl ein. (z.B. 0008 oder 1342)");
            }
            break;
        case "byCategory":

            resultCategoryContainer.hide();
            resultProductContainer.show();
            _productApi.findByCategory(selectedValue,0,0,showSearchResults);
            productResultLoaderImage.show();
            break;
        case "byCategoryTree":
            resultCategoryList.empty();
            resultProductContainer.hide();
            resultCategoryContainer.show();
            categoryResultLoaderImage.show();
            _categoryApi.findAll(callBackCategoryTree);
            break;

    }
}
function showErrorMessage(aValue: string){
    var errorLabel = searchErrorField;
    errorLabel.text(aValue);
    errorLabel.show();
}

function showProduct(record:any):void {
    cleanTable();
    var recordArray = [];
    recordArray.push(record);
    _currentProcutList.length = 0;
    showProducts(recordArray);
}

function showSearchResults(records:any):void {
    cleanTable();
    _currentProcutList.length = 0;
    showProducts(records);
}

function showProducts(records:any):void {
    if (records.length == 0) {
        showEmptyResultText();
    }
    for (var index = 0; index < records.length; index++) {
        var product = new common.Product(records[index]);
        _currentProcutList.push(product);
    }
    createTableRows(_currentProcutList);
    prepareDialogFunktions();
    productResultLoaderImage.hide();
}


var productDialog:ProductDialog;
function prepareDialogFunktions() {
    $(".product_row").click(function () {
        //$('body').css('overflow','hidden');
        //$('body').css('position','fixed');
        var currentElement = $(this);
        var productId = currentElement.attr("productid");
        var arrayIndex = currentElement.attr("arrayindex");
        var currentProduct:common.Product = _currentProcutList[arrayIndex];
        console.log(currentProduct);
        _productCounter = new ProductCounter(currentProduct.uomObject.rounding);
        productDialog = new ProductDialog(currentProduct);

        // close dialog
        $(".closeSearchDialog").click(function(event){
            //$('body').css('overflow','auto');
            //$('body').css('position','relative');
        });

    });
}

function prepareDialogForTreeListFunctions(){
    console.log("Anzahl der Produkte: " + _allProducts.length);
    $(".collapse_list_entry").click(function () {
        console.log("Anzahl der Produkte: " + _allProducts.length);
        //$('body').css('overflow','hidden');
        //$('body').css('position','fixed');
        var currentElement = $(this);
        var productId = currentElement.attr("productid");
        _currentProcutList = _allProducts;
        var productObject:common.Product = getProductByID(_currentProcutList, parseInt(productId));
        //var productObject:common.Product = findProductByID(productId,_allProducts);
        console.log("Found productID: " + productId);
        console.log(productObject);
        _productCounter = new ProductCounter(productObject.uomObject.rounding);
        productDialog = new ProductDialog(productObject);

        // close dialog
        $(".closeSearchDialog").click(function(event){
            //$('body').css('overflow','auto');
            //$('body').css('position','relative');
        });

    });
}

function findProductByID(aProductId:any,aProducts: Array<common.Product>):common.Product{
    for(var index in aProducts){
        if(aProductId == aProducts[index].productId){
            return aProducts[index];
        }
    }
    console.log("No Product found for id " + aProductId + "!");
    return;
}

function createTableRows(productArray:Array<common.Product>) {
    cleanTable();

    for (var index = 0; index < productArray.length; index++) {
        var product = productArray[index];
        var categoryName:string = product.category.name;
        var uomName:string = product.uomObject.name;
        var productRow = $("");

        resultProductTable.append("<tr data-toggle='modal' data-target='#myModal' class='product_row' productid='" + product.productId + "' arrayindex='" + index + "'> " +
            " <td id='productId' class='col-md-2 col-xs-2'>" + product.productId + "</td>" +
            " <td id='productName' class='col-md-3 col-xs-3'><div>" + product.name + "</div><div>" + categoryName + "</div></td>" +
            " <td id='productLocation' class='col-md-5 col-xs-5'>" + product.locationString + "</td>" +
            " <td id='productPrice' class='col-md-2 col-xs-2'><div>" + _formatter.formatNumberToPrice(product.price) + " <span class=\"glyphicon glyphicon-euro\"></span></div><div>" + uomName + "</div></td>" +
            "</tr>");
    }


    prepareDialogFunktions();
}

function createTableHeader() {
    resultProductTable.append("<tr> " +
        " <th onclick='sortById()'>" + "Id" + "</th>" +
        " <th onclick='sortByName()'>" + "Name" + "</th>" +
        " <th onclick='sortByLocation()'>" + "Lagerort" + "</th>" +
        " <th onclick='sortByPrice()'>" + "Preis" + "</th>" +
        "</tr>");
}


function cleanTable():void {
    resultProductTable.empty();
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
    newArrayAscendingOrder = _currentProcutList;
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
    newArrayAscendingOrder = _currentProcutList;
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

    newArrayAscendingOrder = _currentProcutList;
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
    newArrayAscendingOrder = _currentProcutList;
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

    console.log("Product");
    console.log(product);
    console.log("count");
    console.log(count);
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
    var product:common.Product = getProductByID(_currentProcutList, parseInt(dialogProductID));
    var numberValue:any = $("#modal-number").val();
    var count:number = parseInt(numberValue);
    count--;
    if (count >= 0) {
        var newValue:any = count;
        $("#modal-number").val(newValue);
        var newPrice:number = product.price * newValue;
        var formatedPrice = _formatter.formatNumberToPrice(product.price);
        var formatedNewPrice = _formatter.formatNumberToPrice(newPrice);
        $("#modal-productprice").text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
    }
});

$("#modal-number-up").click(function () {
    var dialogProductPrice = $("#modal-productprice").text();
    var dialogProductID = $("#modal-productid").text();
    var product:common.Product = getProductByID(_currentProcutList, parseInt(dialogProductID));
    var numberValue:any = $("#modal-number").val();
    var count:number = parseInt(numberValue);
    count++;
    if (count < 1000) {
        var newValue:number = count;
        $("#modal-number").val(newValue + "");
        var newPrice:number = product.price * newValue;
        var formatedPrice = _formatter.formatNumberToPrice(product.price);
        var formatedNewPrice = _formatter.formatNumberToPrice(newPrice);
        $("#modal-productprice").text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
    }
});

$("#modal-number").change(function () {

    var modalNumberLabel = $("#modal-number");
    var numberValue:any = modalNumberLabel.val();

    var util:Utils = new Utils();
    var modal_productId:any = $("#modal-productid");
    var dialogProductID = modal_productId.text();
    var product:common.Product = getProductByID(_currentProcutList, parseInt(dialogProductID));

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
    var product:common.Product = getProductByID(_currentProcutList, parseInt(dialogProductID));
    var newPrice:number = product.price * numberValue;

    var formatedPrice = _formatter.formatNumberToPrice(product.price);
    var formatedNewPrice = _formatter.formatNumberToPrice(newPrice);
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


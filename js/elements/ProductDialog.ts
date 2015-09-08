/// <reference path="../common/model/Product.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../util/Formatter.ts"/>
/// <reference path="ProductCounter.ts"/>
/// <reference path="../common/rest/ProductApi.ts"/>

class ProductDialog {

    private static _formatter:Formatter = new Formatter();
    private static _currentProduct:common.Product;
    private static _productCounter:ProductCounter;
    private static _productApi:ProductApi = new ProductApi();

    private static modalHeaderName = $("#myModalLabel");
    private static modalProductIdLabel = $("#modal-productid");
    private static modalProductNameLabel = $("#modal-productname");
    private static modalProductDescriptionLabel = $("#modal-productdescription");
    private static modalProductPriceLabel = $("#modal-productprice");
    private static modalProductUnitLabel = $("#modal-productunit");
    private static modalProductLocationLabel = $("#modal-productlocation");
    private static modalProductCategoryLabel = $("#modal-productCategory");
    private static modalProductMapLink = $("#modal-productMap");
    private static modalProductAddToCart = $("#modal-productAddToCart");

    private static modalProductCounterUp = $("#modal-number-up");
    private static modalProductCounterDown = $("#modal-number-down");
    private static modalProductCounterValue = $("#modal-number");


    constructor(aProduct:common.Product) {
        console.log("Create ProductDialog");
        ProductDialog._currentProduct = aProduct;

        ProductDialog.modalProductAddToCart.attr("data-product", JSON.stringify(ProductDialog._currentProduct));
        ProductDialog.modalHeaderName.text(ProductDialog._currentProduct.name);
        ProductDialog.modalProductIdLabel.text(ProductDialog._currentProduct.productId + "");
        ProductDialog.modalProductNameLabel.text(ProductDialog._currentProduct.name);
        ProductDialog.modalProductDescriptionLabel.text(ProductDialog._currentProduct.description);
        var formattetPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
        ProductDialog.modalProductPriceLabel.text(formattetPrice + " \u20AC");
        ProductDialog.modalProductUnitLabel.text(ProductDialog._currentProduct.unit);
        ProductDialog.modalProductLocationLabel.text(ProductDialog._currentProduct.locationString);
        ProductDialog.modalProductCategoryLabel.text(ProductDialog._currentProduct.categoryString);

        var preparedLocationString = ProductDialog._currentProduct.locationForProductMap;

        var newlocationURL = ProductDialog._productApi.getLinkToProductMap() + "?id=" + preparedLocationString;
        ProductDialog.modalProductMapLink.attr("href", newlocationURL);

        ProductDialog._productCounter = new ProductCounter(aProduct.uomObject.rounding);

        ProductDialog.modalProductCounterValue.val("1");
        this.setFunctionIncrementProductCounter();
        this.setFunctionDeclineProductCounter();

    }

    private setFunctionIncrementProductCounter():void {
        ProductDialog.modalProductCounterUp.click(function () {
            ProductDialog._productCounter.incrementValue();
            var newValue:number = ProductDialog._productCounter.getCurrentValue();
            ProductDialog.modalProductCounterValue.val(newValue + "");
            var newPrice:number = ProductDialog._currentProduct.price * newValue;
            var formatedPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
            var formatedNewPrice = ProductDialog._formatter.formatNumberToPrice(newPrice);
            ProductDialog.modalProductPriceLabel.text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
        });
    }

    private setFunctionDeclineProductCounter():void {
        ProductDialog.modalProductCounterDown.click(function () {
            ProductDialog._productCounter.declineValue();
            var newValue:number = ProductDialog._productCounter.getCurrentValue();
            ProductDialog.modalProductCounterValue.val(newValue + "");
            var newPrice:number = ProductDialog._currentProduct.price * newValue;
            var formatedPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
            var formatedNewPrice = ProductDialog._formatter.formatNumberToPrice(newPrice);
            ProductDialog.modalProductPriceLabel.text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
        });
    }




}
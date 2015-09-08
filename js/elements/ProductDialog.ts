/// <reference path="../common/model/Product.ts" />
/// <reference path="../jquery.d.ts" />
/// <reference path="../util/Formatter.ts"/>
/// <reference path="ProductCounter.ts"/>
/// <reference path="../common/rest/ProductApi.ts"/>

class ProductDialog {

    private static _formatter:Formatter = new Formatter();
    private static _currentProduct:common.Product;
    private static _productCounter:ProductCounter;
    private _productApi: ProductApi = new ProductApi();

    private modalHeaderName = $("#myModalLabel");
    private modalProductIdLabel = $("#modal-productid");
    private modalProductNameLabel = $("#modal-productname");
    private modalProductDescriptionLabel = $("#modal-productdescription");
    private modalProductPriceLabel = $("#modal-productprice");
    private modalProductUnitLabel = $("#modal-productunit");
    private modalProductLocationLabel = $("#modal-productlocation");
    private modalProductCategoryLabel = $("#modal-productCategory");
    private modalProductMapLink = $("#modal-productMap");
    private modalProductAddToCart = $("#modal-productAddToCart");

    private modalProductCounterUp = $("#modal-number-up");
    private modalProductCounterDown = $("#modal-number-down");
    private modalProductCounterValue = $("#modal-number");




    constructor(aProduct:common.Product) {
        ProductDialog._currentProduct = aProduct;
        console.log("Create ProductDialog with Product " + ProductDialog._currentProduct.name);


        this.modalProductAddToCart.attr("data-product", JSON.stringify(ProductDialog._currentProduct));
        this.modalHeaderName.text(ProductDialog._currentProduct.name);
        this.modalProductIdLabel.text(ProductDialog._currentProduct.productId + "");
        this.modalProductNameLabel.text(ProductDialog._currentProduct.name);
        this.modalProductDescriptionLabel.text(ProductDialog._currentProduct.description);
        var formattetPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
        this.modalProductPriceLabel.text(formattetPrice + " \u20AC");
        this.modalProductUnitLabel.text(ProductDialog._currentProduct.unit);
        this.modalProductLocationLabel.text(ProductDialog._currentProduct.locationString);
        this.modalProductCategoryLabel.text(ProductDialog._currentProduct.categoryString);

        var preparedLocationString = ProductDialog._currentProduct.locationForProductMap;

        var newlocationURL = this._productApi.getLinkToProductMap() + "?id=" + preparedLocationString;
        this.modalProductMapLink.attr("href", newlocationURL);

        ProductDialog._productCounter = new ProductCounter(aProduct.uomObject.rounding);

        this.modalProductCounterValue.val("1");
        this.setFunctionIncrementProductCounter();
        this.setFunctionDeclineProductCounter();

    }

    private setFunctionIncrementProductCounter():void {
        this.modalProductCounterUp.click(function () {
            console.log("starteIncrement with Product " + ProductDialog._currentProduct.name);
            ProductDialog._productCounter.incrementValue();
            var newValue:number = ProductDialog._productCounter.getCurrentValue();
            var modalProductCounterValue = $("#modal-number");
            modalProductCounterValue.val(newValue + "");
            var newPrice:number = ProductDialog._currentProduct.price * newValue;
            var formatedPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
            var formatedNewPrice = ProductDialog._formatter.formatNumberToPrice(newPrice);
            var modalProductPriceLabel = $("#modal-productprice");
            modalProductPriceLabel.text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
        });
    }

    private setFunctionDeclineProductCounter():void {
        this.modalProductCounterDown.click(function () {
            console.log("starteIncrement with Product " + ProductDialog._currentProduct.name);
            ProductDialog._productCounter.declineValue();
            var newValue:number = ProductDialog._productCounter.getCurrentValue();
            var modalProductCounterValue = $("#modal-number");
            modalProductCounterValue.val(newValue + "");
            var newPrice:number = ProductDialog._currentProduct.price * newValue;
            var formatedPrice = ProductDialog._formatter.formatNumberToPrice(ProductDialog._currentProduct.price);
            var formatedNewPrice = ProductDialog._formatter.formatNumberToPrice(newPrice);
            var modalProductPriceLabel = $("#modal-productprice");
            modalProductPriceLabel.text(formatedPrice + " \u20AC" + " (" + formatedNewPrice + " \u20AC" + ")");
        });
    }
}
/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="iscroll.d.ts" />

// scrollelement
var vertScroll;

// show all cart entries when cart is loaded
function showAllCartEntries() {
    if (!browserLocalStorageSupport()) {
        return;
    }

    var cart:string[] = getCart();

    var total_price:number = 0;

    for (var i = 0; i < cart.length; i++) {
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = common.CartEntry.prototype;
        product.product.__proto__ = common.Product.prototype;
        total_price += product.product.price * product.amount;
        addProductToDom(product);
    }

    // set total price in footer
    $("#cart_total_price_text").text(total_price.toFixed(2).toString()+ " €");

    // show amount in cart icon in header
    var cart_quantity = $("#cart_button_quantity");
    if (cart.length != 0) {
        var cart_quantity = $("#cart_button_quantity");
        cart_quantity.text(cart.length.toString());
        cart_quantity.show();
    } else {
        cart_quantity.hide();
    }

    // add vertical touch scrolling
    vertScroll = new IScroll("#cart_container");
    setTimeout(function () {
        vertScroll.refresh();
    }, 0);

}



function browserLocalStorageSupport():boolean{
    // return if browser does not support local storage and inform the user
    if (!window["localStorage"]) {
        alert("No local storage support");
        return false;
    }
    return true;

}

function addProductToDom(entry:common.CartEntry):void{
    // add product to DOM
    var card:string = "<tr>" +
        "<td>" +
        "<h4>" + entry.product.name + "</h4>"+
        "<p>" + entry.product.price + " € pro " + entry.product.unit +"</p>" +
        "<p>Menge:" +entry.amount +"</p>" +
        "</td>" +
        "<td>"+
        "<p>" + (entry.product.price*entry.amount).toFixed(2) + " €" + "</p>"+
        "</td></tr>";

    $("#cartEntries_container").append(card);
}

// add a product to a cart
function addProduct(entry:common.CartEntry):void{
    // return if browser does not support local storage and inform the user
    if (!browserLocalStorageSupport()) {
        return;
    }


    // get cart from storage
    var cart:string[] = getCart();

    // set key for new product
    var key:string = entry.product.productId.toString();

    // store product and cart
    //try{
        localStorage.setItem(key, JSON.stringify(entry));
    //}catch(e){

    //}


    // product already exists?
    if(productExists(cart,key)){
        return;
    }

    cart.push(key);
    //try{
        localStorage.setItem("cart", JSON.stringify(cart));
    //}catch(e){

    //}

    showAllCartEntries();
}

// get valid cart or create one
function getCart():string[]{
    var storageString:string = localStorage.getItem("cart");
    var cart:string[];
    if(!storageString){
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
    }else{
        cart = JSON.parse(storageString);
    }
    return cart;
}

function removeProduct(){

}

function checkOut(){

}

function productExists(cart, key):boolean{
    for(var i=0;i<cart.length; i++){
        if(cart[i] == key){
            return true;
        }
    }
    return false;
}

// show all cart entries that are in the current cart
showAllCartEntries();

// TODO: consider full storage


// Just for debugging
$("#clearCache").click(function(){
    var cart = getCart();

    for(var i=0;i<cart.length;i++){
        var key = cart[i];
        localStorage.removeItem(key);
    }
    cart = [];
    localStorage.setItem("cart",JSON.stringify(cart));
});

// debug
var test ={

    "productId": "0008",
    "name": "Keramik 10pF (SMD 0805)",
    "description": null,
    "unit": "Stück",
    "oum_id": 1,
    "categoryId": 7,
    "categoryString": "Alle Produkte / Elektronik / Elektronikmaterial / Kondensator",
    "price": 0.1,
    "itemsAvailable": 0,
    "location": "unknown location",
    "location_id": 0,
    "locationObject":

    {

        "id": 0,
        "locationId": 0,
        "name": null,
        "code": null

    },
    "category":
    {

        "id": 0,
        "categoryId": 7,
        "name": "Kondensator",
        "location_id": 18,
        "categories":

            [
                20,
                19,
                252,
                9
            ]

    },
    "uom":

    {
        "uom_id": 1,
        "name": "Stück",
        "rounding": 1,
        "uomType": "reference"
    }

};
var testProduct:common.Product = new common.Product(test);
var testEntry:common.CartEntry = new common.CartEntry(testProduct, 2);
// addProduct(testEntry);



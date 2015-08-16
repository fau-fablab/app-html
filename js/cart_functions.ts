/// <reference path="jquery.d.ts" />
/// <reference path="common/model/cartEntry.ts"/>

// show all cart entries when cart is loaded
function showAllCartEntries(){
    if (!browserLocalStorageSupport()) {
        return;
    }

    var cart:string[] = getCart();

    for(var i=0;i<cart.length; i++){
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = common.cartEntry.prototype;
        addProductToDom(product);
    }
}


function browserLocalStorageSupport():boolean{
    // return if browser does not support local storage and inform the user
    if (!window["localStorage"]) {
        alert("No local storage support");
        return false;
    }
    return true;

}

function addProductToDom(entry:common.cartEntry):void{
    // add product to DOM
    var card:string = "<div class='cart_card'><div class='cart_card_left'>" +
        "<h4>" + entry.product._name + "</h4>"+
        "<p>" + entry.product._price + " pro " + entry.product._unit +"</p>" +
        "<p>Menge:" +entry.amount +"</p>" +
        "</div>" +
        "<div class='cart_card_right'>"+
        "<p>" + Math.round((entry.product._price*entry.amount) * 100)/100 + "</p>"+
        "</div></div>";

    $("#cart_container").append(card);
}

// add a product to a cart
function addProduct(entry:common.cartEntry):void{
    // return if browser does not support local storage and inform the user
    if (!browserLocalStorageSupport()) {
        return;
    }


    // get cart from storage
    var cart:string[] = getCart();

    // set key for new product
    var key:string = entry.product._productId.toString();

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
})

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
var testProduct:common.product = new common.product(test);
var testEntry:common.cartEntry = new common.cartEntry(testProduct, 2);
//addProduct(testEntry);
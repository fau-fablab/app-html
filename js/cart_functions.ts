/// <reference path="jquery.d.ts" />
/// <reference path="CartEntry.ts"/>

// show all cart entries when cart is loaded
function showAllCartEntries(){
    if (!browserLocalStorageSupport()) {
        return;
    }

    var cart:string[] = getCart();

    for(var i=0;i<cart.length; i++){
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = CartEntry.prototype;
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

function addProductToDom(entry:CartEntry):void{
    // add product to DOM
    var card:string = "<div class='cart_card'><div class='cart_card_left'>" +
        "<h4>" + entry.name + "</h4>"+
        "<p>" + entry.price + " pro " + entry.unit +"</p>" +
        "<p>Menge:" +entry.amount +"</p>" +
        "</div>" +
        "<div class='cart_card_right'>"+
        "<p>" + Math.round((entry.price*entry.amount) * 100)/100 + "</p>"+
        "</div></div>";

    $("#cart_container").append(card);
}

// add a product to a cart
function addProduct(entry:CartEntry):void{
    // return if browser does not support local storage and inform the user
    if (!browserLocalStorageSupport()) {
        return;
    }


    // get cart from storage
    var cart:string[] = getCart();

    // set key for new product
    var key:string = entry.product_id.toString();

    // store product and cart
    localStorage.setItem(key, JSON.stringify(entry));

    // product already exists?
    if(productExists(cart,key)){
        return;
    }

    cart.push(key);
    localStorage.setItem("cart", JSON.stringify(cart));

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

// DEBUG
addProduct(new CartEntry(12, "test", 5, 5,"auto", "stück", "untere kiste", 3));
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
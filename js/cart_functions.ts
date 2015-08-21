/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="iscroll.d.ts" />

//always show quantity in header
$( document ).ready(function() {
    adaptQuantityInHeader();
    // let it bounce
    if(getCart().length >0)
        (<any>$("#cart_button_quantity")).effect("bounce", { times:3 }, 300);
});

// scrollelement
var vertScroll;

// get total price of shopping cart
function getTotalPrice():number{
    var cart:string[] = getCart();
    var total_price:number = 0;
    for (var i = 0; i < cart.length; i++) {
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = common.CartEntry.prototype;
        product.product.__proto__ = common.Product.prototype;
        total_price += product.product.price * product.amount;
    }
    return total_price;
}

// show all cart entries when cart is loaded
function showAllCartEntries() {
    if (!browserLocalStorageSupport()) {
        return;
    }

    var cart:string[] = getCart();

    // show info msg when cart is empy
    if(cart.length == 0){
        $("#cart_container").append("<div class='info'><i>Dein Warenkorb ist leider noch leer.</i></div>");
    }

    // add producs to dom
    for (var i = 0; i < cart.length; i++) {
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = common.CartEntry.prototype;
        product.product.__proto__ = common.Product.prototype;
        addProductToDom(product);
    }

    // set total price in footer
    $("#cart_total_price_text").text(getTotalPrice().toFixed(2).toString()+ " €");

    // show amount in cart icon in header
    adaptQuantityInHeader();

    // add vertical touch scrolling
    vertScroll = new IScroll("#cart_container",{
        scrollbars: true
    });
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);

    // click function for a removed cart entry
    $(".btn_remove").click(function(event){
        var cartEntry = $(this);
        removeProduct(cartEntry);
    });

}

// adapt quantity for shopping cart icon in the header
function adaptQuantityInHeader():void{
    // show amount in cart icon in header
    var cart:string[] = getCart();
    var cart_quantity = $("#cart_button_quantity");
    if (cart.length != 0) {
        var cart_quantity = $("#cart_button_quantity");
        var quantity:number = 0;
        for (var i = 0; i < cart.length; i++) {
            var key:string = cart[i];
            var product:any = JSON.parse(localStorage[key]);
            product.__proto__ = common.CartEntry.prototype;
            quantity += parseInt(product.amount);
        }
        cart_quantity.text(quantity.toString());
        cart_quantity.show();
    } else {
        cart_quantity.hide();
    }
}

// used browser supports local storage usage?
function browserLocalStorageSupport():boolean{
    // return if browser does not support local storage and inform the user
    if (!window["localStorage"]) {
        alert("No local storage support");
        return false;
    }
    return true;

}

// add a product to the DOM
function addProductToDom(entry:common.CartEntry):void{
    // add product to DOM
    var cartEntry_total:string = (entry.product.price*entry.amount).toFixed(2);
    var card:string = "<tr>" +
        "<td style='line-height: 30px !important;height:30px !important;'>" +
        "<h4>" + entry.product.name + "</h4>"+
        "<p class='cart_cartEntry_text'>" + entry.product.price.toFixed(2) + " € pro " + entry.product.unit +"</p>" +
        "<p class='cart_cartEntry_text'>Menge:  <select id='picker_"+entry.product.productId.toString()+"' data-width='63px' class='selectpicker'></select></p>" +
        "</td>" +
        "<td class='cart_card_right' style='line-height: 30px !important;height:30px !important;'>" +
        "<button type='button' class='btn_remove' data-key='"+entry.product.productId.toString()+"' " +
        "data-total='"+cartEntry_total+"'>" +
        "<span class='glyphicon glyphicon-remove'></span>" +
        "</button>" +
        "<p class='cart_card_total_price'>" + (entry.product.price*entry.amount).toFixed(2) + " €" + "</p>"+
        "</td></tr>";

    // enable quantity picker
    $("#cartEntries_container").append(card);
    (<any>$(".selectpicker")).selectpicker();
    var picker = $("#picker_"+entry.product.productId.toString());
    for(var i=1;i<201;i++){
        picker.append("<option>"+i+"</option><option data-divider='true'></option>");
    }
    picker.val(<any>entry.amount);
    (<any>$(".selectpicker")).selectpicker('refresh');

    // save changes
    picker.change(function(event){
        entry.amount = $(this).val();
        updateCartEntry(entry);

    });
}

// save quantity changes that have been made to the CartEntry
function updateCartEntry(entry:common.CartEntry){
    // get key for the entry
    var key:string = entry.product.productId.toString();

    // store product
    localStorage.setItem(key, JSON.stringify(entry));

    // adapt shopping cart icon
    adaptQuantityInHeader();
    (<any>$("#cart_button_quantity")).effect("bounce", { times:3 }, 300);

    // change total price
    $("#cart_total_price_text").text(getTotalPrice().toFixed(2).toString()+ " €");
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
    // show amount in cart icon in header
    adaptQuantityInHeader();
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

// removes the product
function removeProduct(cartEntry:any){
    var key:string = cartEntry.attr("data-key");

    // remove product from storage
    var cart:string[] = getCart();
    localStorage.removeItem(key);
    var pos:number = cart.indexOf(key);
    if (pos > -1) {
        cart.splice(pos, 1);
    }

    // save changed cart array
    localStorage.setItem("cart",JSON.stringify(cart));

    // remove row from DOM
    $('#cartEntries_container tr:eq('+pos+')').remove();

    // adapt quantity icon in the header
    adaptQuantityInHeader();

    // adapt total price
    $("#cart_total_price_text").text(getTotalPrice().toFixed(2).toString()+ " €");

    // let it bounce
    if(cart.length > 0) {
        (<any>$("#cart_button_quantity")).effect("bounce", {times: 3}, 300);
    }else{
        // show info msg when cart is empy
        $("#cart_container").append("<div class='info'><i>Dein Warenkorb ist leider noch leer.</i></div>");
    }
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

// clear cache -> remove all products that have ever been stored including related carts
function clearCache():void{
    alert("hi");
    var cart = getCart();

    // remove single cart entries
    for(var i=0;i<cart.length;i++){
        var key = cart[i];
        localStorage.removeItem(key);
    }

    // remove array
    localStorage.removeItem("cart");

}






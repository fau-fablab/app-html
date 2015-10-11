/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="iscroll.d.ts" />
/// <reference path="checkout.ts"/>
/// <reference path="util/Utils.ts"/>

// always show quantity in header
$( document ).ready(function() {
    adaptQuantityInHeader();
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
    var checkout_btn:any = $("#cart_checkout_btn");

    // show info msg when cart is empty
    if(cart.length == 0){
        disableCart();
    }else{
        // enable checkout
        checkout_btn.prop("disabled", false);
    }

    // add products to dom
    var str:string = "";
    var entries:Array<common.CartEntry> = [];

    for (var i = 0; i < cart.length; i++) {
        var key:string = cart[i];
        var product:any = JSON.parse(localStorage[key]);
        product.__proto__ = common.CartEntry.prototype;
        product.product.__proto__ = common.Product.prototype;
        product.product.uomObject.__proto__ = common.Uom.prototype;
        str += createProductForDom(product);
        entries.push(product);
    }

    $("#cartEntries_container").append(str);


    // set listeners
    for(var j=0;j<entries.length;j++){
        setCartEntryListeners(entries[j]);
    }

    // set total price in footer
    $("#cart_total_price_text").text(getTotalPrice().toFixed(2).toString()+ " €");

    // show amount in cart icon in header
    adaptQuantityInHeader();

    // add vertical touch scrolling
    vertScroll = new IScroll("#cart_container");
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);

    // click function for a removed cart entry
    $(".btn_remove").click(function(){
        var cartEntry = $(this);
        removeProduct(cartEntry);
    });

    // checkout button click function
    checkout_btn.click(function(){
        checkout();
    });

    // close checkout dialog
    $("#closeCheckoutDialog").click(function(){
        $("#openCheckoutDialog").removeClass("checkoutDialog-active");
    });
}

// adapt quantity for shopping cart icon in the header
function adaptQuantityInHeader():void{
    // show amount in cart icon in header
    var cart:string[] = getCart();
    var cart_quantity = $("#cart_button_quantity");
    if (cart.length != 0) {
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

// add listeners for a entry
function setCartEntryListeners(entry:common.CartEntry){

    // change event for input
    var picker_input = $("#picker_input_"+entry.product.productId.toString());
    // add listeners for the picker
    var cartEntry_total_price = $("#cart_card_total_price_"+entry.product.productId.toString());
    picker_input.change(function(){
        var util:Utils = new Utils();
        var numberValue:string = util.replaceAllCommaToDots($(this).val());
        var val:number = parseFloat(numberValue);

        if (!(util.isPositivNumber(numberValue))) {
            val = 1;
            $(this).val("1");
        }
        if (!(util.isValidRoundingValue(val, entry.product.uomObject.rounding))) {
            val = 1;
            $(this).val("1");
        }
        entry.amount = val;
        updateCartEntry(entry, cartEntry_total_price);
    });

    // picker up event
    var picker_up = $("#picker_up_"+entry.product.productId.toString());
    picker_up.click(function(){
        var old:string = picker_input.val();
        var newAmount:number = parseFloat(old)+1;
        picker_input.val(newAmount.toString());
        picker_input.trigger("change");
        picker_up.blur();
    });

    // picker down event
    var picker_down = $("#picker_down_"+entry.product.productId.toString());
    picker_down.click(function(){
        var old:string = picker_input.val();
        var newAmount:number = parseFloat(old)-1;
        if(newAmount < 0 ){
            newAmount = 0;
        }
        picker_input.val(newAmount.toString());
        picker_input.trigger("change");
        picker_down.blur();
    });
}


// creates a cart entry for the dom and returns the string
function createProductForDom(entry:common.CartEntry){

    var cartEntry_total:string = (entry.product.price*entry.amount).toFixed(2);
    return "<tr>" +
        "<td style='line-height: 30px !important;height:30px !important;'>" +
        "<h4>" + entry.product.name + "</h4>"+
        "<p class='cart_cartEntry_text'>" + entry.product.price.toFixed(2) + " € pro " + entry.product.unit +"</p>" +
        "<div class='input-group number-spinner col-md-3 col-xs-6'><span class='input-group-btn data-dwn'><button class='btn btn-default'" +
        " data-dir='dwn' id='picker_down_"+entry.product.productId.toString()+"'><span class='glyphicon glyphicon-minus'></span>" +
        "</button></span>" +
        "<input id='picker_input_"+entry.product.productId.toString()+"' type='text' value='"+<any>entry.amount+
        "' class='form-control text-center'  min='1'>" +
        "<span class='input-group-btn data-up'>" +
        "<button class='btn btn-default' data-dir='up' id='picker_up_"+entry.product.productId.toString()+"'>" +
        "<span class='glyphicon glyphicon-plus'></span></button></span></div>"+
        "</td>" +
        "<td class='cart_card_right' style='line-height: 30px !important;height:30px !important;'>" +
        "<button type='button' class='btn_remove' data-key='"+entry.product.productId.toString()+"' " +
        "data-total='"+cartEntry_total+"'>" +
        "<span class='glyphicon glyphicon-remove'></span>" +
        "</button>" +
        "<p class='cart_card_total_price' id='cart_card_total_price_"+entry.product.productId.toString()+"'>" + (entry.product.price*entry.amount).toFixed(2) + " €" + "</p>"+
        "</td></tr>";
}

// save quantity changes that have been made to the CartEntry
function updateCartEntry(entry:common.CartEntry, card_total_price){
    // get key for the entry
    var key:string = entry.product.productId.toString();

    // store product
    localStorage.setItem(key, JSON.stringify(entry));

    // adapt shopping cart icon
    adaptQuantityInHeader();
    bounceShoppingCartIcon();

    // change total price for card
    card_total_price.text((entry.amount*entry.product.price).toFixed(2) + " €");

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
    localStorage.setItem(key, JSON.stringify(entry));

    // product already exists?
    if(productExists(cart,key)){
        return;
    }

    // save product
    cart.push(key);
    localStorage.setItem("cart", JSON.stringify(cart));

    // show amount in cart icon in header
    adaptQuantityInHeader();
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

    // let it bounce and adabt cart functionalities
    if(cart.length > 0) {
        bounceShoppingCartIcon();
        enableCart();
    }else{
        // show info msg when cart is empty and disable checkout button
        disableCart();
    }
}



/**** Small helping functions *****/

// product exists?
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
    var cart = getCart();

    // remove single cart entries
    for(var i=0;i<cart.length;i++){
        var key = cart[i];
        localStorage.removeItem(key);
    }

    // remove array
    localStorage.removeItem("cart");

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

// used browser supports local storage usage?
function browserLocalStorageSupport():boolean{
    // return if browser does not support local storage and inform the user
    if (!window["localStorage"]) {
        alert("Dein Browser unterstützt leider die Speicherform LocalStorage nicht.");
        return false;
    }
    return true;

}

// let the shopping cart icon bounce in header
function bounceShoppingCartIcon(){
    (<any>$("#cart_button_quantity")).effect("bounce", { times:3 }, 300);
}

// cart == empty -> show info msg and disable checkout button
function disableCart(){
    $("#cart_container").append("<div class='info'><i>Dein Warenkorb ist leider noch leer.</i></div>");
    // disable checkout
    $("#cart_checkout_btn").prop("disabled", true);
}

// cart != empty -> enable checkout button
function enableCart(){
    // disable checkout
    $("#cart_checkout_btn").prop("disabled", false);
}


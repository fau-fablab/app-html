/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="common/model/PlatformType.ts"/>
/// <reference path="iscroll.d.ts" />
/// <reference path="common/model/CartServer.ts"/>
/// <reference path="common/model/CartEntryServer.ts"/>
/// <reference path="util/RestClient.ts"/>

//always show quantity in header
$( document ).ready(function() {
    adaptQuantityInHeader();
    // let it bounce
    if(getCart().length >0)
        bounceShoppingCartIcon();
});

// scrollelement
var vertScroll;

// cart being used right now
var sentCartCode:string;

// repeater for polling cart status
var requestRepeater;

// Rest Client
var client:RestClient = new RestClient();

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

    // show info msg when cart is empty
    if(cart.length == 0){
        disableCart();
    }else{
        // enable checkout
        $("#cart_checkout_btn").prop("disabled", false);
    }

    // add products to dom
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
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true
    });
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);

    // click function for a removed cart entry
    $(".btn_remove").click(function(event){
        var cartEntry = $(this);
        removeProduct(cartEntry);
    });

    // checkout button click function
    $("#cart_checkout_btn").click(function(event){
        checkOut();
    });

    // close checkout dialog
    $("#closeCheckoutDialog").click(function(event){
        $("#openCheckoutDialog").removeClass("checkoutDialog-active");
    });
}

// callback of sent cart
function cartCreationCallback(callback):void{
    if(callback == "" || callback == undefined){
        // succesfully sent -> start polling
        startPollingFromServer();
        // disable input and X-button
        $("#submitQRCode").prop("disabled", true);
        $("#qrCodeInput").prop("disabled", true);
        $("#closeCheckoutDialog").hide();
        // show info msg and loader
        $("#cartSentLoader").show();
        $("#qrCodeStatus").toggleClass("cart_checkoutError", false);
        $("#qrCodeStatus").toggleClass("cart_checkoutSuccess", false);
        $("#qrCodeStatus").html("Warenkorb erfolgreich an Kasse gesendet!");
        $("#qrCodeInfo").html("Bitte Bezahlvorgang abschließen!");
        // show cancel button
        var cancelCheck = $("#cart_cancelCheckout");
        cancelCheck.click(function(){
            //cancel checkout
            cancelCheckout();
        })
        cancelCheck.show();
    }else{
        // error
        $("#qrCodeStatus").toggleClass("cart_checkoutError", true);
        $("#qrCodeStatus").toggleClass("cart_checkoutSuccess", false);
        $("#qrCodeStatus").html("Falscher QR Code");
        $("#qrCodeInfo").html("Überprüfe den QR Code!<br/>Generiere dir an der Kasse einen neuen, " +
            "falls dieser Fehler wiederholt, trotz korrekter Eingabe, auftritt.");
    }
}

// function cancel checkout via button
function cancelCheckout(){
    client.request("POST", "/checkout/cancelled/"+sentCartCode, callbackCheckoutCancelled);
}

// callback response from checkout cancel
function callbackCheckoutCancelled(response){
    resetCheckoutDialog();
    callbackPolling(null);
    if(response != "true"){
        $("#qrCodeStatus").toggleClass("cart_checkoutError", true);
        $("#qrCodeStatus").toggleClass("cart_checkoutSuccess", false);
        $("#qrCodeStatus").html("Fehler!");
        $("#qrCodeInfo").html("Warenkorb ist nicht mehr gültig oder wurde schon abgebrochen!");
    }
}

// checkout was cancelled succesfully
function checkoutCancelledSuccesfully(){
    $("#qrCodeInfo").html("Der Bezahlvorgang wurde abgebrochen...");
    $("#qrCodeStatus").html("Abgebrochen!");
    $("#closeCheckoutDialog").show();
    $("#cart_cancelledCheckout").click(function(){
       $("#closeCheckoutDialog").trigger("click");
    });
    $("#cart_cancelledCheckout").show();
}

// cart is paid and checkout is successfully performed
function checkoutPaidSuccesfully(){
    // TODO: SAVE OLD CART ?
    // delete cart
    clearCache();
    // remove entries from DOM
    $("#cartEntries_container").empty();
    // adapt shopping cart icon and total price
    $("#cart_total_price_text").text("");
    adaptQuantityInHeader();
    disableCart();
    resetCheckoutDialog();
    $("#submitQRCode").prop("disabled", true);
    $("#qrCodeInput").prop("disabled", true);
    $("#qrCodeStatus").toggleClass("cart_checkoutError", false);
    $("#qrCodeStatus").toggleClass("cart_checkoutSuccess", true);
    $("#qrCodeStatus").html("Bestellung abgeschlossen");
    $("#qrCodeInfo").html("Dein Bezahlvorgang war erfolgreich!");
    $("#cart_paidCheckout").click(function(){
        $("#closeCheckoutDialog").trigger("click");
    })
    $("#cart_paidCheckout").show();
}

// function start polling from server
function startPollingFromServer(){
    clearTimeout(requestRepeater);
    client.request("GET","/checkout/"+sentCartCode, callbackPolling);
}

// callback response from polling
function callbackPolling(response){
    switch (response.status){
        case "PENDING":
            // nothing happened --> continue polling
            requestRepeater = setTimeout(startPollingFromServer, 500);
            break;
        case "PAID":
            // success msg
            // show info msg for a short time, hide loader
            checkoutPaidSuccesfully();
            break;
        case "CANCELLED":
            // cancelled msg
            resetCheckoutDialog();
            checkoutCancelledSuccesfully();
            break;
        default:
            console.log("error polling");
            break;
    }
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



// add a product to the DOM
function addProductToDom(entry:common.CartEntry):void{
    // add product to DOM
    var cartEntry_total:string = (entry.product.price*entry.amount).toFixed(2);
    var card:string = "<tr>" +
        "<td style='line-height: 30px !important;height:30px !important;'>" +
        "<h4>" + entry.product.name + "</h4>"+
        "<p class='cart_cartEntry_text'>" + entry.product.price.toFixed(2) + " € pro " + entry.product.unit +"</p>" +
        //"<p class='cart_cartEntry_text'>Menge:  <select id='picker_"+entry.product.productId.toString()+"' data-width='63px' class='selectpicker'></select></p>" +
        "<div class='input-group number-spinner col-md-3 col-xs-3'><span class='input-group-btn data-dwn'><button class='btn btn-default'" +
        " data-dir='dwn' id='picker_down_"+entry.product.productId.toString()+"'><span class='glyphicon glyphicon-minus'></span>" +
        "</button></span>" +
        "<input id='picker_input_"+entry.product.productId.toString()+"' type='text' class='form-control text-center'  min='1'>" +
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

    // set amount in the picker
    $("#cartEntries_container").append(card);
    var picker_input = $("#picker_input_"+entry.product.productId.toString());
    picker_input.val(<any>entry.amount);

    // add listeners for the picker
    var cartEntry_total_price = $("#cart_card_total_price_"+entry.product.productId.toString());
    picker_input.change(function(event){
        entry.amount = $(this).val();
        updateCartEntry(entry, cartEntry_total_price);
    });

    var picker_up = $("#picker_up_"+entry.product.productId.toString());
    picker_up.click(function(){
        var old:string = picker_input.val();
        var newAmount:number = parseFloat(old)+1;
        picker_input.val(newAmount.toString());
        picker_input.trigger("change");
        picker_up.blur();
    });

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
    card_total_price.text((entry.amount*entry.product.price).toFixed(2));

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

// checkout process triggered by button click
function checkOut(){
    // show dialog
    $("#openCheckoutDialog").addClass("checkoutDialog-active");
    resetCheckoutDialog();
    // listener for qr code input
    $("#submitQRCode").click(function(){
        $("#cart_cancelledCheckout").hide();
        var val:any = $("#qrCodeInput").val();
        if(isNaN(Number(val))){
            $("#qrCodeStatus").toggleClass("cart_checkoutError", true);
            $("#qrCodeStatus").toggleClass("cart_checkoutSuccess", false);
            $("#qrCodeStatus").html("Falscher QR Code");
            $("#qrCodeInfo").html("Überprüfe den QR Code!<br/>Er besteht aus negativen oder positiven Zahl.");
            return;
        }

        // remove old information
        $("#qrCodeInfo").html("");
        $("#qrCodeStatus").html("");

        // create new Cart
        var cartServer:common.CartServer = new common.CartServer();
        sentCartCode = val;
        cartServer.cartCartCode = sentCartCode;
        var stat:common.CartStatus = common.CartStatus.PENDING;
        var cartStatusString:string = common.CartStatus[stat];
        cartServer.cartStatus = cartStatusString;
        //var platformType:common.PlatformType = common.PlatformType.HTML;
        // TODO: Fix platform type problem for HTML
        var platformType:common.PlatformType = common.PlatformType.ANDROID;
        var platformType_string:string = common.PlatformType[platformType];
        cartServer.cartPlatformType = platformType_string;
        cartServer.cartPushToken = "HTML";
        var cartEntriesServer:Array<common.CartEntryServer> = new Array<common.CartEntryServer>();
        var cart:string[] = getCart();
        for(var i= 0; i<cart.length; i++){
            var key:string = cart[i];
            var product:any = JSON.parse(localStorage[key]);
            product.__proto__ = common.CartEntry.prototype;
            product.product.__proto__ = common.Product.prototype;
            cartEntriesServer.push(new common.CartEntryServer(product.product.productId, cartServer, product.amount));
        }
        cartServer.cartItems = cartEntriesServer;

        // REST CALL
        // post cart
        var res = JSON.stringify(cartServer, function(key, val) {
            // remove cyclic references
            if(key == 'cart') {
                //return nothing;
                return;
            } else {
                return val;
            }
        });

        console.log(res);
        // send cart to cash desk
        client.request("POST","/carts", cartCreationCallback, res);
    });
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

// reset checkout modal
function resetCheckoutDialog(){
    $("#closeCheckoutDialog").show();
    $("#submitQRCode").prop("disabled", false);
    $("#qrCodeInput").prop("disabled", false);
    $("#cartSentLoader").hide();
    $("#cart_cancelCheckout").hide();
    $("#cart_cancelledCheckout").hide();
    $("#cart_paidCheckout").hide();
    $("#qrCodeStatus").html("");
    $("#qrCodeInfo").html("");
    $("#qrCodeInput").val("");
}
/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartServer.ts"/>
/// <reference path="common/model/PlatformType.ts"/>
/// <reference path="util/RestClient.ts"/>
/// <reference path="cart_functions.ts"/>
$(document).ready(function () {
    // initialise and set tooltip
    var tooltip:any =  $("#cart_tooltip");
    tooltip.prop("title", "Wenn du bezahlen möchtest, generiere dir an der Kasse im FABLAB einen QR Code " +
        "und klicke hier auf den \"Zur Kasse\"-Button. Nun kannst du den QR Code scannen und bequem im FABLAB bezahlen.");
    tooltip.tooltip({placement: 'top'});
});

// cart being used right now
var sentCartCode:string;

// repeater for polling cart status
var requestRepeater;

// Rest Client
var client:RestClient = new RestClient();

// checkout process triggered by button click
function checkout(){
    resetCheckoutDialog();
    // listener for qr code input
    $("#submitQRCode").click(function(){
        $("#cart_cancelledCheckout").hide();
        var val:any = $("#qrCodeInput").val();
        var qrCodeInfo:any = $("#qrCodeInfo");
        var qrCodeStatus:any = $("#qrCodeStatus");
        if(isNaN(Number(val))){
            qrCodeStatus.toggleClass("cart_checkoutError", true);
            qrCodeStatus.toggleClass("cart_checkoutSuccess", false);
            qrCodeStatus.html("Falscher QR Code");
            qrCodeInfo.html("Überprüfe den QR Code!<br/>Er besteht aus negativen oder positiven Zahl.");
            return;
        }

        // remove old information
        qrCodeInfo.html("");
        qrCodeStatus.html("");

        // create new Cart
        var cartServer:common.CartServer = new common.CartServer();
        sentCartCode = val;
        cartServer.cartCartCode = sentCartCode;
        var stat:common.CartStatus = common.CartStatus.PENDING;
        cartServer.cartStatus = common.CartStatus[stat];
        // TODO: Fix platform type problem for HTML
        cartServer.cartPlatformType = common.PlatformType[common.PlatformType.ANDROID];
        cartServer.cartPushToken = "HTML";
        var cartEntriesServer:Array<common.CartEntryServer> = [];
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

            } else {
                return val;
            }
        });

        console.log(res);
        // send cart to cash desk
        client.request("POST","/carts", cartCreationCallback, res);
    });
}

// function cancel checkout via button
function cancelCheckout(){
    client.request("POST", "/checkout/cancelled/"+sentCartCode, callbackCheckoutCancelled);
}

// checkout was cancelled succesfully
function checkoutCancelledSuccesfully(){
    $("#qrCodeInfo").html("Der Bezahlvorgang wurde abgebrochen...");
    $("#qrCodeStatus").html("Abgebrochen!");
    $("#closeCheckoutDialog").show();
    var cancelCheckout:any = $("#cart_cancelledCheckout");
    cancelCheckout.click(function(){
        $("#closeCheckoutDialog").trigger("click");
    });
    cancelCheckout.show();
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
    var qrCodeStatus:any = $("#qrCodeStatus");
    qrCodeStatus.toggleClass("cart_checkoutError", false);
    qrCodeStatus.toggleClass("cart_checkoutSuccess", true);
    qrCodeStatus.html("Bestellung abgeschlossen");
    $("#qrCodeInfo").html("Dein Bezahlvorgang war erfolgreich!");
    var paidCheckout:any = $("#cart_paidCheckout");
    paidCheckout.click(function(){
        $("#closeCheckoutDialog").trigger("click");
    });
    paidCheckout.show();
}

/** Callbacks from REST Calls **/

// callback of sent cart
function cartCreationCallback(callback):void{
    var qrCodeStatus:any = $("#qrCodeStatus");
    var qrCodeInfo:any = $("#qrCodeInfo");
    if(callback == "" || callback == undefined){
        // succesfully sent -> start polling
        startPollingFromServer();
        // disable input and X-button
        $("#submitQRCode").prop("disabled", true);
        $("#qrCodeInput").prop("disabled", true);
        $("#closeCheckoutDialog").hide();
        // show info msg and loader
        $("#cartSentLoader").show();
        qrCodeStatus.toggleClass("cart_checkoutError", false);
        qrCodeStatus.toggleClass("cart_checkoutSuccess", false);
        qrCodeStatus.html("Warenkorb erfolgreich an Kasse gesendet!");
        qrCodeInfo.html("Bitte Bezahlvorgang abschließen!");
        // show cancel button
        var cancelCheck = $("#cart_cancelCheckout");
        cancelCheck.click(function(){
            //cancel checkout
            cancelCheckout();
        });
        cancelCheck.show();
    }else{
        // error
        qrCodeStatus.toggleClass("cart_checkoutError", true);
        qrCodeStatus.toggleClass("cart_checkoutSuccess", false);
        qrCodeStatus.html("Falscher QR Code");
        qrCodeInfo.html("Überprüfe den QR Code!<br/>Generiere dir an der Kasse einen neuen, " +
            "falls dieser Fehler wiederholt, trotz korrekter Eingabe, auftritt.");
    }
}

// callback response from checkout cancel
function callbackCheckoutCancelled(response){
    resetCheckoutDialog();
    callbackPolling(null);
    if(response != "true"){
        var qrCodeStatus:any = $("#qrCodeStatus");
        qrCodeStatus.toggleClass("cart_checkoutError", true);
        qrCodeStatus.toggleClass("cart_checkoutSuccess", false);
        qrCodeStatus.html("Fehler!");
        $("#qrCodeInfo").html("Warenkorb ist nicht mehr gültig oder wurde schon abgebrochen!");
    }
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


/** Helping Functions **/

// reset checkout modal
function resetCheckoutDialog(){
    $("#closeCheckoutDialog").show();
    $("#submitQRCode").prop("disabled", false);
    var qrCodeInput:any = $("#qrCodeInput");
    qrCodeInput.prop("disabled", false);
    $("#cartSentLoader").hide();
    $("#cart_cancelCheckout").hide();
    $("#cart_cancelledCheckout").hide();
    $("#cart_paidCheckout").hide();
    $("#qrCodeStatus").html("");
    $("#qrCodeInfo").html("");
    qrCodeInput.val("");
}

// start polling from server
function startPollingFromServer(){
    clearTimeout(requestRepeater);
    client.request("GET","/checkout/"+sentCartCode, callbackPolling);
}
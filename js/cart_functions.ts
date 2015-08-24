/// <reference path="jquery.d.ts" />
/// <reference path="common/model/CartEntry.ts"/>
/// <reference path="iscroll.d.ts" />
/// <reference path="common/model/CartServer.ts"/>
/// <reference path="common/model/CartEntryServer.ts"/>
/// <reference path="RestClient.ts"/>

//always show quantity in header
$( document ).ready(function() {
    adaptQuantityInHeader();
    // let it bounce
    if(getCart().length >0)
        bounceShoppingCartIcon();
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

    // show info msg when cart is empty
    if(cart.length == 0){
        disableCart();
    }else{
        // enable checkout
        $("#cart_checkout_btn").prop("disabled", false);
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
    alert(callback);
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
    bounceShoppingCartIcon();

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

    // listener for qr code input
    $("#submitQRCode").click(function(){
        var val:any = $("#qrCodeInput").val();
        if(val.length < 9 || isNaN(Number(val))){
            $("#qrCodeInfo").html("Der QR Code muss aus 9 Zahlen bestehen!");
            return;
        }

        // TODO: HIER WARENKORB AN DEN SERVER SENDEN!
        // create new Cart
        var cartServer:common.CartServer = new common.CartServer();
        var cartCode:string = val;
        cartServer.cartCartCode = cartCode;
        var stat:common.CartStatus = common.CartStatus.PENDING;
        var cartStatusString:string = common.CartStatus[stat];
        cartServer.cartStatus = cartStatusString;

        cartServer.cartPushID = "HTML";
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
        var client:RestClient = new RestClient();
        // post cart
        var res = JSON.stringify(cartServer, function(key, val) {

            if(key == 'cart') {
                //return val.cartCartCode;
                return cartCode;
            } else {
                return val;
            }
        });

        res = res.replace(/["]/g, "");
        res = res.replace(/[[]/g, "(" );
        res = res.replace(/[\]]/g, ");" );
        res = res.replace(/[:]/g, "=" );

      var test = "{\"cartCode\":\"exampleCartCode\",\"items\":[{\"id\":5234,\"productId\":\"0042\",\"amount\":23.0},{\"id\":7534,\"productId\":\"0062\",\"amount\":83.0}],\"status\":\"CANCELLED\",\"pushId\":\"asdfas123\",\"sentToServer\":1440274939390}";
       // alert(test);
        client.request("POST","/carts?create", cartCreationCallback, JSON.stringify(test));
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
        alert("Dein Browser unterstützt leider unsere Speicherform LocalStorage nicht.");
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

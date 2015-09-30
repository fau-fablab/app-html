/// <reference path="jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="common/model/User.ts"/>

// Rest Client
var client:RestClient = new RestClient();

// load inventory list
$( document ).ready(function() {

    // get user info and return to news  if no admin
    var user:common.User = Authentication.getUserInfo();
    if(window.location.hash == "#inventory" && !(user && (user.hasRole(common.Roles.ADMIN) || user.hasRole(common.Roles.INVENTORY)))){
        window.location.hash = "#news";
        return;
    }

    client.checkAuthentication();

    // show tooltips
    var print_btn:any = $("#inventory_print");
    print_btn.prop("title", "Liste drucken");
    print_btn.tooltip({ placement: 'top' });

    var reload_btn:any = $("#inventory_reload");
    reload_btn.prop("title", "Liste aktualisieren");
    reload_btn.tooltip({ placement: 'top' });

    var delete_tooltip:any = $("#inventory_delete_tooltip");
    delete_tooltip.prop("title", "Liste löschen");
    delete_tooltip.tooltip({ placement: 'top' });

    var export_csv:any = $("#inventory_export_csv");
    export_csv.prop("title", "Export CSV");
    export_csv.tooltip({ placement: 'top' });

    var export_json:any = $("#inventory_export_json");
    export_json.prop("title", "Export JSON");
    export_json.tooltip({ placement: 'top' });

    // get list
    getInventory();

    // add click listener for refresh button
    reload_btn.click(function(){
        reload_btn.blur();
        getInventory();
    });

    // add click listener for print button
    print_btn.click(function(){
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var date_string:string = day + "." + month + "." + year;
        (<any>$("#inventory_print_container")).printElement({
            pageTitle:'Inventory - ' + date_string,
            overrideElementCSS:[
                { href:'css/inventory.css',media:'print'},
                { href:'css/bootstrap.min.css',media:'print'}
            ]
        });
        print_btn.blur();
    });

    // add click listener for delete button in modal
    var delete_btn:any = $("#inventory_modal_delete");
    delete_btn.click(function (){

        // send request
        client.request("DELETE","/inventory", callbackDeletion);
        (<any>$('#inventory_modal')).modal("hide");
    });
});

// callback of delete request
function callbackDeletion(response){
    console.log("Inventory deletion successful: " + response);
    // empty dom
    $("#inventory_list").empty();
    getInventory();
}

// send inventory get request to server
function getInventory():void{
    // disable refresh button
    $("#inventory_reload").prop("disabled", true);

    // hide info
    $("#inventory_empty").hide();

    // show loader
    $("#inventoryLoader").show();

    // send request
    client.request("GET","/inventory/", callbackInventory);
}

// callback from inventory request
function callbackInventory(response):void{
    // empty old entries for the case of refresh
    $("#inventory_list").empty();

    // enable reload
    $("#inventory_reload").prop("disabled", false);

    // hide loader
    $("#inventoryLoader").hide();

    if(response.length == 0){
        // no items -> show info
        $("#inventory_empty").show();
        $("#inventory_delete").prop("disabled", true);
    }else{
        // show items
        var html:string = "<div class='row row-inventory-head'>" + "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>"+
            "Name" + "</div>" +
            "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'>" + "ID" + "</div>" +
            "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'>" + "Anzahl" + "</div>" +
            "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" + "Benutzer" + "</div>" +
            "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" + "Hinzugefügt" + "</div>" +
            "</div>";
        for(var i=0;i<response.length;i++){
            var entry:string = "";
            entry = "<div class='row row-inventory'>" +
                "<div class='col-xs-4 col-sm-4 col-md-4 col-lg-4'>" + response[i].productName + "</div>" +
                "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'>" + response[i].productId + "</div>" +
                "<div class='col-xs-1 col-sm-1 col-md-1 col-lg-1'>" + response[i].amount + "</div>" +
                "<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3'>" + response[i].userName + "</div>" +
                "<div class='col-xs-2 col-sm-2 col-md-2 col-lg-2'>" + response[i].updated_at + "</div>" +
                "</div>";
            html += entry;
        }

        $("#inventory_list").append(html);

        $("#inventory_delete").prop("disabled", false);
    }
}
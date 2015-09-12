/// <reference path="jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>

// Rest Client
var client:RestClient = new RestClient();

// load inventory list
$( document ).ready(function() {
    // show tooltips
    var print_btn:any = $("#inventory_print");
    print_btn.prop("title", "Liste drucken");
    print_btn.tooltip({ placement: 'top' });

    var reload_btn:any = $("#inventory_reload");
    reload_btn.prop("title", "Liste aktualisieren");
    reload_btn.tooltip({ placement: 'top' });

    // get list
    getInventory();

    // add click listener for refresh button
    reload_btn.click(function(){
        getInventory();
    });

    // add click listener for print button
    print_btn.click(function(){
        (<any>$("#inventory_print_container")).printElement();
    })
});

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
    // hide loader
    $("#inventoryLoader").hide();

    if(response.length == 0){
        // no items -> show info and enable refresh button
        $("#inventory_empty").show();
        $("#inventory_reload").prop("disabled", false);
    }else{
        // show items
        var html:string = "";
        for(var i=0;i<response.length;i++){
            var entry:string;
            // make table
            html += entry;
        }

        $("#inventory_list").append(html);
    }
}
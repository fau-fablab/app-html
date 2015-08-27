/// <reference path="jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/Product.ts" />
/// <reference path="lib.d.ts" />
// General REST class


function test(){
    var restClient:RestClient = new RestClient();

    var jsonTest = {"first": 3, "second" : "Hallo"};

    var res = JSON.stringify(jsonTest);
    //var res = jsonTest;
    console.log(res);
    // send cart to cash desk
    restClient.request("POST","/mail/test", callback2, res);
    console.log("Ende");
}

function callback2(value){
    //console.log(value.first);
    console.log("war im callback");
}
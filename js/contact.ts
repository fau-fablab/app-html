/// <reference path="jquery.d.ts" />
/// <reference path="RestClient.ts"/>
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/Product.ts" />
// typescript import to create XDomainRequests
/// <reference path="lib.d.ts" />
// General REST class


function sendMail() {
    console.log("Sende Mail");
    var restClient:RestClient = new RestClient();

    var emailInput:any = $("#contact_email");
    var c:any = $("#contact_message");

    var email:string = emailInput.val();
    var message:string = emailInput.val();

    var testObject2 = {"first": 2, "second": "asdfa"};

    var urlPath:string = "http://192.168.2.102:8080" + "/mail/test";
    var xhr:XMLHttpRequest = this.createCORSRequest("POST", urlPath);
    //xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.setRequestHeader("Accept", "application/json");
    //restClient.postRequest(testObject2,"/mail/test",callback);

    //xhr.send(testObject2);

    $("#contact_email").val("");
    $("#contact_message").val("");



}

function callback(value:any):void {
    console.log("In Callack");
    console.log("ReturnValue: " + value);
}

function createCORSRequest(method:string, url:string):XMLHttpRequest {
    var xhr:XMLHttpRequest = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE
        xhr = <any>new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}



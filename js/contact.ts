/// <reference path="jquery.d.ts" />
/// <reference path="RestClient.ts"/>
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/Product.ts" />
// typescript import to create XDomainRequests
/// <reference path="lib.d.ts" />
// General REST class

var toolArray: Array<common.FabTool>;

function sendMail() {
    console.log("Sende Mail");
    var restClient:RestClient = new RestClient();

    var emailInput:any = $("#contact_email");
    var emailContent:any = $("#contact_message");


    if($('#error_message_checkbox').is(":checked")){
        var selectedItem = $('#error_message_toolsection').find(":selected").text();
        if(selectedItem != "") {
            var selectedFabTool:common.FabTool = getSelectedFabTool(selectedItem);
            restClient.postRequest("","/mail/error?id="+selectedFabTool.id+"&msg="+emailContent,showResponseErrorMessage);
        }
        else{
            console.log("Auswahlfenster war nicht belegt");
        }
    }
    else{
        restClient.postRequest("","/mail/feedback?msg="+emailContent,showResponseFeedbackMessage)
    }

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

function showResponseErrorMessage(){
    console.log("showResponseErrorMessage");
}

function showResponseFeedbackMessage(){
    console.log("showResponseFeedbackMessage")
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

function showSelect(){
    console.log("In methode showSelect");

    var selectDivAttribute = $("#error_message_fabTool_div").is(":visible");
    console.log("Ist div sichtbar: " + selectDivAttribute);
    if(selectDivAttribute){
        var selectDiv = $("#error_message_fabTool_div").attr("style", "visibility: visible");
    }
    if(!selectDivAttribute){
        var selectDiv = $("#error_message_fabTool_div").attr("style", "visibility: hidden");
    }
}


$(document).ready(function () {
    var restClient:RestClient = new RestClient();
    console.log("Starte error_message.html");
    restClient.request("GET","/drupal/tools",drupalCallback);

});

function drupalCallback(value:any):void{
    console.log("error_message_toolsection");
    toolArray = value;
    var mySelect = $('#error_message_toolsection');
    for(var index = 0; index < toolArray.length;index++){
        console.log(toolArray[index])
        mySelect.append("<option>"+toolArray[index].title+"</option>");
    }

    mySelect.prop("selectedIndex", -1);
}

function selected(){
    var selectedItem = $('#error_message_toolsection').find(":selected").text();
    console.log("Selected title: " + selectedItem);
    var selectedFabTool: common.FabTool = getSelectedFabTool(selectedItem);

    var fabToolImage = $('#error_message_fabtool_image').attr("src", selectedFabTool.link);
    console.log("Link: " + selectedFabTool.link);
    console.log("LinkToPicture: " + selectedFabTool.linkToPicture);
    var fabToolTitle = $('#error_message_fabtool_title').text(selectedFabTool.title);
    var fabToolDescription= $('#error_message_fabtool_description').text(selectedFabTool.description);
    var fabToolDetails= $('#error_message_fabtool_details').text(selectedFabTool.details);

}

function getSelectedFabTool(aValue: string): common.FabTool{
    for(var intex = 0; intex < toolArray.length;intex++){
        if(toolArray[intex].title == aValue){
            return toolArray[intex];
        }
    }
    return null;

}



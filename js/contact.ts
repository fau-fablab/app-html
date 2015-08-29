/// <reference path="jquery.d.ts" />
/// <reference path="util/RestClient.ts"/>
/// <reference path="common/model/FabTool.ts" />
/// <reference path="common/model/Product.ts" />
/// <reference path="lib.d.ts" />
/// <reference path="iscroll.d.ts" />

var toolArray: Array<common.FabTool>;
// scrollelement
var vertScroll;

$(document).ready(function () {
    $('#contact-form').hide();
    var restClient:RestClient = new RestClient();
    console.log("Starte error_message.html");
    restClient.request("GET","/drupal/tools",drupalCallback);

    // add vertical touch scrolling
    vertScroll = new IScroll("#contact_container",{
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true
    });
    setTimeout(function () {
        vertScroll.refresh();
    }, 200);
});

function sendMail() {
    var restClient:RestClient = new RestClient();
    var selectedToDoValue = $('#whattodo_select').find(":selected").val();

    var emailInput:any = $("#contact_email");
    var emailContent:any = $("#contact_message");

    if(selectedToDoValue == 3){
        var selectedItem = $('#error_message_toolsection').find(":selected").text();
        if(selectedItem != "") {
            var selectedFabTool:common.FabTool = getSelectedFabTool(selectedItem);
            restClient.request("POST","/mail/error?id="+selectedFabTool.id+"&msg="+emailContent,showResponseErrorMessage,"");
        }
        else{
            console.log("Auswahlfenster war nicht belegt");
        }
        return;
    }
    restClient.request("POST","/mail/feedback?msg="+emailContent,showResponseFeedbackMessage,"");
}

function showResponseErrorMessage(){
    console.log("showResponseErrorMessage");
}

function showResponseFeedbackMessage(){
    console.log("showResponseFeedbackMessage")
}

function todoSectionChanged(){
    console.log("todoSectionChanged")
    var selectedValue = $('#whattodo_select').find(":selected").val();
    console.log(selectedValue);
    if(selectedValue != 0){
        console.log("show form")
        $('#contact-form').show();
    }
    if(selectedValue == 0){
        console.log("hide form")
        $('#contact-form').hide();
    }

    if(selectedValue == 1){
        feedbackSelected();
    }
    if(selectedValue == 2){
        bugSelected();
    }
    if(selectedValue == 3){
        errorSelected();
    }

    setTimeout(function () {
        vertScroll.refresh();
    }, 200);
}

function feedbackSelected(){
    $('#contact_email_div').show();
    $('#error_message_fabTool_div').hide();
    $('#contact_message_div').show();
}

function bugSelected(){
    $('#contact_email_div').show();
    $('#error_message_fabTool_div').hide();
    $('#contact_message_div').show();
}

function errorSelected(){
    $('#contact_email_div').show();
    $('#error_message_fabTool_div').show();
    $('#contact_message_div').show();
}

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

function getSelectedFabTool(aValue: string): common.FabTool{
    for(var intex = 0; intex < toolArray.length;intex++){
        if(toolArray[intex].title == aValue){
            return toolArray[intex];
        }
    }
    return null;
}

/*
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
*/




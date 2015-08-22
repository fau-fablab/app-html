/// <reference path="jquery.d.ts" />
/// <reference path="RestClient.ts"/>
/// <reference path="common/model/Product.ts" />

function sendMail(){
    console.log("Sende Mail");
    var restClient: RestClient = new RestClient();

    var emailInput: any = $("#contact_email");
    var c: any = $("#contact_message");

    var email: string = emailInput.val();
    var message: string = emailInput.val();

    console.log(email);
    console.log(message);

    var value: any = "{bla: 4}"



    var testObject = {"first":4,"second":"asdf"};
    var testObject2 = {"first":2,"second":"asdfa"};
    restClient.postRequest(testObject2,"/mail/test",callback);

    $("#contact_email").val("");
    $("#contact_message").val("");

}

function callback(value:any):void{
    console.log("In Callack");
    console.log("ReturnValue: " + value);
}
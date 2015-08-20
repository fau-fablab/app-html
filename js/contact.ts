/// <reference path="jquery.d.ts" />

function sendMail(){
    console.log("Sende Mail");

    var emailInput: any = $("#contact_email");
    var c: any = $("#contact_message");

    var email: string = emailInput.val();
    var message: string = emailInput.val();



    console.log(email);
    console.log(message);

    $("#contact_email").val("");

    $("#contact_message").val("");

}
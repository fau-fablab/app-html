/// <reference path="jquery.d.ts" />

function sendMail(){
    console.log("Sende Mail");

    var email: string = $("#contact_email").val();
    var message: string = $("#contact_message").val();


    console.log(email);
    console.log(message);

    $("#contact_email").val();

    $("#contact_message").val(" ");

}
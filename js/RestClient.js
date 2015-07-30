// typescript import to create XDomainRequests
/// <reference path="lib.d.ts" />
// General REST class
var RestClient = (function () {
    function RestClient() {
        this.url = "https://ec2-52-28-16-59.eu-central-1.compute.amazonaws.com";
    }
    // CORS request
    RestClient.prototype.request = function (method, path, callback) {
        var urlPath = this.url + path;
        var xhr = this.createCORSRequest(method, urlPath);
        if (!xhr) {
            alert('CORS not supported');
            return null;
        }
        // return json response and handle reponse in the specific callback function
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            callback(response);
        };
        xhr.onerror = function () {
            alert('An error occured while loading the content.');
            return null;
        };
        xhr.send();
    };
    // Create the XHR object
    RestClient.prototype.createCORSRequest = function (method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        }
        else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE
            xhr = new XDomainRequest();
            xhr.open(method, url);
        }
        else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    };
    return RestClient;
})();
//# sourceMappingURL=RestClient.js.map
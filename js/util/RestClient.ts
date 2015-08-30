﻿// typescript import to create XDomainRequests
/// <reference path="../lib.d.ts" />
// General REST class
class RestClient{

	private _url:string;

	constructor(){
		this._url = "https://ec2-52-28-16-59.eu-central-1.compute.amazonaws.com:4433";
		//this._url = "http://192.168.2.102:8080"
	}
	
	// CORS request
	request(method:string, path:string, callback: (s: string) => any, param?:string):void{
		  var urlPath:string = this._url + path;

		  var xhr:XMLHttpRequest = this.createCORSRequest(method, urlPath);
		  if (!xhr) {
		    alert('CORS not supported');
		    return null;
		  }
		  
		  // return json response and handle response in the specific callback function
		  xhr.onload = function() {
              var response:string;
              if(method == "POST"){
                  response = xhr.responseText;
              }else{
                  response = JSON.parse(xhr.responseText);
              }
              callback(response);
		  };

		  xhr.onerror = function() {
              alert('An error occured while loading the content.');
              return null;
		  };

		  if(method == "POST"){
			  console.log("send Postrequest")
              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.send(param);
		  }else{
			  xhr.send();
		  }
        }

	// Create the XHR object
	createCORSRequest(method:string,url:string):XMLHttpRequest{
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

	public postRequest(message:Object, path:string, callback: (s: string) => any, param?:string):void {
		var urlPath:string = this._url + path;

		var xhr:XMLHttpRequest = this.createCORSRequest("POST", urlPath);
		if (!xhr) {
			alert('CORS not supported');
			return null;
		}

		// return json response and handle response in the specific callback function
		xhr.onload = function () {
			var response:string = JSON.parse(xhr.responseText);
			callback(response);
		};

		xhr.onerror = function () {
			alert('An error occured while loading the content.');
			return null;
		};
		xhr.send(message);
	}

	public requestGET(aPath:string,callback: (value: any) => any):void{
		var urlPath:string = this._url + aPath;
		var method = "GET";
		var xhr:XMLHttpRequest = this.createCORSRequest(method, urlPath);
		if (!xhr) {
			alert('CORS not supported');
			return null;
		}

		// return json response and handle response in the specific callback function
		xhr.onload = function() {
			var response:string;
			if(method == "POST"){
				response = xhr.responseText;
			}else{
				response = JSON.parse(xhr.responseText);
			}
			callback(response);
		};

		xhr.onerror = function() {
			alert('An error occured while loading the content.');
			return null;
		};



		xhr.send();

	}
}
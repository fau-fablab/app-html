// typescript import to create XDomainRequests
/// <reference path="../lib.d.ts" />
/// <reference path="../authentication.ts" />
/// <reference path="../common/model/User.ts" />
// General REST class
class RestClient{

	private _url:string;
	private _authentication:string;

	constructor(){
		this._url = "https://ec2-52-28-163-255.eu-central-1.compute.amazonaws.com:4433";
		this._authentication = "";
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
              var response : string;

              if (method == "POST" || method == "DELETE") {
                  response = xhr.responseText;
              } else if (xhr.responseText.length > 0) {
                  response = JSON.parse(xhr.responseText);
              }

			  callback(response);
		  };

		  xhr.onerror = function() {
              alert('An error occured while loading the content.');
              return null;
		  };

		  if(method == "POST" || method == "PUT"){
			  console.log("send Postrequest");
              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.send(param);
		  }else if (method == "DELETE"){
			  xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.send();
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

		// check if authentication is provided
		if (this._authentication.length > 0) {
			xhr.setRequestHeader("Authorization", this._authentication);
		}

		return xhr;
	}

	public postRequest(
		message : Object,
		path : string,
		callback : (s: string) => any, param?:string,
		callbackError? : (errorCode : number, errorMessage : any) => any) : void {

		var urlPath : string = this._url + path;
		var xhr : XMLHttpRequest = this.createCORSRequest("POST", urlPath);

		if (!xhr) {
			if (callbackError) {
				callbackError(0, 'CORS not supported');
			} else {
				alert('CORS not supported');
			}

			return null;
		}

		// return json response and handle response in the specific callback function
		xhr.onload = function () {

			if (xhr.status != 200) {
				if (callbackError(xhr.status, xhr.statusText));
				return;
			}

			var response : string = JSON.parse(xhr.responseText);

			callback(response);
		};

		xhr.onerror = function() {
			if (callbackError) {

			} else {
				alert('An error occurred while loading the content.');
			}

			return null;
		};

		xhr.send(message);
	}

	public requestGET(
		aPath : string ,
		callback : (value: any) => any,
		callbackError? : (errorCode : number, errorMessage : any) => any) : void{

		var urlPath : string = this._url + aPath;
		var xhr : XMLHttpRequest = this.createCORSRequest("GET", urlPath);

		if (!xhr) {
			if (callbackError) {
				callbackError(0, 'CORS not supported');
			} else {
				alert('CORS not supported');
			}

			return null;
		}

		// return json response and handle response in the specific callback function
		xhr.onload = function() {

			if (xhr.status != 200) {
				if (callbackError(xhr.status, xhr.statusText));
				return;
			}

			var response : string = JSON.parse(xhr.responseText);

			callback(response);
		};

		xhr.onerror = function() {
			if (callbackError) {
				callbackError(0, 'An error occurred while loading the content.');
			} else {
				alert('An error occurred while loading the content.');
			}

			return null;
		};

		xhr.send();
	}
	public checkAuthentication () {
		var user : common.User = Authentication.getUserInfo();
		if (user) {
			this.addAuthentication(user.username, user.password);
		}
		else {
			this.clearAuthentication();
		}
	}

	public hasAuthentication () : boolean {
		return this._authentication.length > 0;
	}

	public addAuthentication(aUsername : string, aPassword : string) {
		this._authentication = "Basic " + btoa(aUsername + ":" + aPassword);
	}

	public clearAuthentication () {
		this._authentication = "";
	}

	public getEndointUrl() {
		return this._url;
	}
}

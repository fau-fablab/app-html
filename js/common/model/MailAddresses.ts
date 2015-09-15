class MailAddresses{

    private _feedbackMail: string;
    private _fabLabMail: string;

    constructor(){

    }

    public get feedbackMail():string {
        return this._feedbackMail;
    }

    public set feedbackMail(value:string) {
        this._feedbackMail = value;
    }

    public get fabLabMail():string {
        return this._fabLabMail;
    }

    public set fabLabMail(value:string) {
        this._fabLabMail = value;
    }
}
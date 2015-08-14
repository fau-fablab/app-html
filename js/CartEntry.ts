class CartEntry{
    private _product_id:number;
    private _name:string;
    private _price: number;
    private _category_id: number;
    private _category_string: string;
    private _unit: string;
    private _location: string;
    private _amount:number;

    constructor(product_id:number, name: string, price:number, category_id:number,
                category_string: string, unit:string, location:string, amount:number){
        this._product_id = product_id;
        this._name = name;
        this._price = price;
        this._category_id = category_id;
        this._category_string = category_string;
        this._unit = unit;
        this._location = location;
        this._amount = amount;
    }

    public get product_id():number{
        return this._product_id;
    }

    public get name():string{
        return this._name;
    }

    public get price():number{
        return this._price;
    }

    public get category_id():number{
        return this._category_id;
    }

    public get category_string():string{
        return this._category_string;
    }

    public get unit():string{
        return this._unit;
    }

    public get location():string{
        return this._location;
    }

    public get amount():number{
        return this._amount;
    }

    public set amount(a:number){
        this._amount = a;
    }
}
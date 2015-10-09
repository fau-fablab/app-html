/// <reference path="../common/model/Category.ts" />

class CategoryView{

    private _categoryView: any;

    constructor(aCategoryView:any){
        this._categoryView = aCategoryView
    }

    public createNewCategoryView(aCategoryTree:common.Category):any{
        for(var index in aCategoryTree.childCategoryObjects){
            var newNode = this.createNewNode(aCategoryTree.childCategoryObjects[index],index);
            var newElement = this._categoryView.append(newNode);


        }
    }

    public createNewLeaf(aCategory:common.Category): any{
        var leaf = "<ui></ui>";
    }

    public createNewNode(aCategory:common.Category,aButtonID:number): any{
        var node = "<li><a role='button' data-toggle='collapse' href=''#collapse"+aButtonID+"' aria-expanded='false'"
        + "aria-controls='collapse"+aButtonID+"'>"+aCategory.name+"</a></li>";
        return node;
    }

    createNewListForNode():any{

    }


}
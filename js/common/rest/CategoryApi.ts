/// <reference path="../../util/RestClient.ts"/>

class CategoryApi {

    private static ROOT_ID: number = 0;

    private _restClient: RestClient;

    constructor() {
        this._restClient = new RestClient();
    }

    public findAll(callback: (value: any) => any):void {
        this._restClient.requestGET("/categories/find/all",callback);
    }

    public getAutocompletions(callback: (value: any) => any):void{
        this._restClient.requestGET("/categories/autocompletions",callback);
    }

    public getCategoriesAsTree(allCategories:Array<common.Category>):common.Category{

        var rootCategory: common.Category = new common.Category();
        rootCategory.childCategoryObjects = this.findAllCategoriesWithoutParents(allCategories);

        for(var index in rootCategory.childCategoryObjects){
            rootCategory.childCategoryObjects[index].childCategoryObjects = this.findChildCategoriesRecursively(rootCategory.childCategoryObjects[index],allCategories);
        }
        console.log(rootCategory);
        return rootCategory;
    }

    private findChildCategoriesRecursively(aParentCategory:common.Category,aCategories: Array<common.Category>): Array<common.Category>{
        var childCategories: Array<common.Category> = new Array();
        var childCategoryIds: Array<number> = aParentCategory.categoryChilds;
        for(var index in childCategoryIds){
            var category: common.Category = this.findCategoriesById(childCategoryIds[index],aCategories);
            category.childCategoryObjects = this.findChildCategoriesRecursively(category,aCategories);
            childCategories.push(category);
        }
        return childCategories;
    }

    private findCategoriesById(aId:number,aCategories:Array<common.Category>):common.Category{
        for(var index in aCategories){
            if(aCategories[index].categoryId == aId){
                return aCategories[index];
            }
        }
        console.log("Error - found no category with id: " + aId);
        return null;
    }

    private findAllCategoriesWithoutParents(aCategories: Array<common.Category>):Array<common.Category> {
        var categories: Array<common.Category> = new Array();
        for(var index in aCategories){
            if(aCategories[index].parentCategoryId == CategoryApi.ROOT_ID){
                categories.push(aCategories[index]);
            }
        }
        return categories;
    }
}

/// <reference path="../common/model/Category.ts" />
/// <reference path="../common/rest/ProductApi.ts" />

class CategoryView{

    private _categoryView: any;
    //private _productApi: ProductApi = new ProductApi();

    constructor(aCategoryView:any){
        this._categoryView = aCategoryView
    }

    private mergeProductsWithCategoryTree(aCategoryTree:common.Category,aProducts:Array<common.Product>):common.Category{
        for(var index in aCategoryTree.childCategoryObjects){
            aCategoryTree.childCategoryObjects[index] = this.mergeProductsWithCategoryTreeRecursively(aCategoryTree.childCategoryObjects[index],aProducts);
        }
        return aCategoryTree;
    }

    private mergeProductsWithCategoryTreeRecursively(aCategory:common.Category,aProducts:Array<common.Product>):common.Category{
        aCategory.productObjects = this.findProductsForCategory(aCategory,aProducts);
        for(var index in aCategory){
            aCategory = this.mergeProductsWithCategoryTreeRecursively(aCategory,aProducts);
        }
        return aCategory;
    }

    private findProductsForCategory(aCategory:common.Category,aProducts:Array<common.Product>): Array<common.Product>{
        var foundedProducts: Array<common.Product> = new Array();
        for(var index in aProducts){
            if(aCategory.categoryId == aProducts[index].category.categoryId){
                foundedProducts.push(aProducts[index]);
            }
        }
        return foundedProducts;
    }

    public createNewCategoryView(aCategoryTree:common.Category,aProducts:Array<common.Product>):any{
        //aCategoryTree = this.mergeProductsWithCategoryTree(aCategoryTree,aProducts);
        var tree: string = "";
        var treeHead: string = "<ui>";
        var treeTail: string  = "</ui>";
        tree = tree + treeHead;
        for(var index in aCategoryTree.childCategoryObjects){
            // First level
            var currentElementId = "first" + index;
            var newNode = this.createNewNode(aCategoryTree.childCategoryObjects[index],currentElementId);
            tree = tree + newNode;
            tree = tree + this.createStartCollapseDiv(currentElementId);
            var categories = aCategoryTree.childCategoryObjects[index].childCategoryObjects;
            for(var indexSecond in categories){

                var secondElementId = "second" + indexSecond;
                var currentElementObject:common.Category = categories[indexSecond];
                var currentProducts: Array<common.Product> = this.findProductsForCategory(currentElementObject,aProducts);

                if((currentProducts.length != 0) || (currentElementObject.categoryChilds.length != 0)){
                    tree = tree + this.createNewNode(categories[indexSecond],secondElementId);

                    tree = tree + this.createStartCollapseDiv(secondElementId);
                    if(currentProducts.length != 0){
                        for(var indexThird in currentProducts){
                            tree = tree + this.createProductLeaf(currentProducts[indexThird]);
                        }
                    }

                    if(currentElementObject.categoryChilds.length != 0){
                        var nextCategoryChilds = currentElementObject.childCategoryObjects;
                        for(var indexThird in nextCategoryChilds){
                            var nextLevelId = "third" + indexSecond + indexThird;
                            var nextCurrentCategory = nextCategoryChilds[indexThird]
                            tree = tree + this.createNewNode(nextCurrentCategory,nextLevelId);
                            tree = tree + this.createStartCollapseDiv(nextLevelId);

                            var currentProducts: Array<common.Product> = this.findProductsForCategory(nextCurrentCategory,aProducts);
                            for(var indexThirdProducts in currentProducts){
                                tree = tree + this.createProductLeaf(currentProducts[indexThirdProducts]);
                            }
                            tree = tree + this.createEndCollapseDiv();
                        }
                    }
                    tree = tree + this.createEndCollapseDiv();
                }
            }
            tree = tree + this.createEndCollapseDiv();

        }
        tree = tree + treeTail;
        //console.log(tree);
        this._categoryView.append(tree);
    }



    private createProductLeaf(aProduct:common.Product): any{
        return "<li>"+ aProduct.name + "</li>";
    }

    private createNewNode(aCategory:common.Category,aButtonID:string): any{
        var node = "<li><a role='button' data-toggle='collapse' href='#"+aButtonID+"' aria-expanded='false'"
        + " aria-controls='"+aButtonID+"'>"+aCategory.name+"</a></li>";
        return node;
    }

    private createStartCollapseDiv(aCollapseId:any):string{
        var treePart = "";
        treePart = treePart + "<div class='collapse' id='"+aCollapseId+"'>";
        treePart = treePart + "<div class='well'>";
        treePart = treePart + "<ui>";
        return treePart;
    }

    private createEndCollapseDiv():string {
        var treePart = "";
        treePart = treePart + "</ui>";
        treePart = treePart + "</div>";
        treePart = treePart + "</div>";
        return treePart;
    }

}
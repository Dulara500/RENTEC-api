import authentication from "../middleware/authentication.js";
import Product from "../models/product.js";

export function getProducts(user){
    console.log(user);
    if(user==null || user.role!=="admin"){
        
        return Product.find({availability:true});
    }
    return Product.find();
};

export function createProduct(data){
    if(data.user.role === "admin"){
        let product = new Product(data.body);
        return product.save();
    }
    throw new Error("Unauthorized");
};

export function upadateProduct(key,data){
        return Product.updateOne({key},{$set:{...data}});
}

export function deleteProduct(key){
    return Product.deleteOne({key});
}

export function findProduct(key){
    return Product.findOne({key});
}
import { getProducts,createProduct } from "../Controllers/productController.js";
import express from "express";

let productRoute = express.Router();

productRoute.get('/',async (req,res)=>{
    try{
        let products = await getProducts();
        res.json(products);
    }catch(err){
        res.status(500).json({
            "message" : "error while fetching products"
        })
    }
});

productRoute.post('/',async (req,res)=>{
    try{
        await createProduct(req.body);
        res.status(201).json({
            "message" : "Product saved successfully"
        });
    }catch(err){
        res.status(500).json({
            "message" : "error while saving product"
        })
    }
});

export default productRoute;
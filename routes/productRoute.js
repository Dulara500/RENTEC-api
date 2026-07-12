import { getProducts,createProduct,upadateProduct,deleteProduct,findProduct,getStockCount } from "../Controllers/productController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";
import optionalAuth from "../middleware/optionalAuth.js";
import express from "express";

let productRoute = express.Router();

productRoute.get('/',optionalAuth, async (req,res)=>{
    try{
        let products = await getProducts(req.user);
        res.json(products);
    }catch(err){
        console.error(err);
        res.status(500).json({
            "message" : "error while fetching products"
        })
    }
});



productRoute.post('/',authentication, async (req,res)=>{
    try{
        await createProduct(req);
        res.status(201).json({
            "message" : "Product saved successfully"
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while saving product"
        })
    }
});

productRoute.delete('/delete/:key',authentication,authorization("admin"), async (req,res)=>{
    try{
        await deleteProduct(req.params.key);
        res.status(200).json({
            "message" : "Product deleted successfully"
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while deleting product"
        })
    }
});

productRoute.get('/stockCount/:key',optionalAuth, async (req,res)=>{
    try{
        let product = await getStockCount(req.params.key);
        res.json(product);
    }catch(err){
        console.error(err);
        res.status(500).json({
            "message" : "error while fetching product"
        })
    }
})

productRoute.get('/:key',optionalAuth, async (req,res)=>{
    try{
        let product = await findProduct(req.params.key);
        console.log(product)
        res.json(product);
    }catch(err){
        console.error(err);
        res.status(500).json({
            "message" : "error while fetching product"
        })
    }
})

productRoute.put('/:key',authentication,authorization("admin"), async (req,res)=>{
    try{
        console.log(req.body);
        await upadateProduct(req.params.key,req.body);
        res.status(200).json({
            "message" : "Product updated successfully"
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while updating product"
        })
    }
});

export default productRoute;
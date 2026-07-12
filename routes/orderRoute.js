import express from "express"
import { createOrder, getOrder, getCustomerOrders, cancelOrder, updateStatus, updateStockOnItemRent,updateStockOnItemReturn,updateStockOnOrderCancel } from "../Controllers/orderController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";

const orderRoute = express.Router();

orderRoute.post('/',authentication,authorization("customer"),async (req,res)=>{
    try{
        const order = await createOrder(req);
        res.status(201).json({
            "message" : "Order created successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while creating order"
        })
    }
});

orderRoute.get('/my-orders',authentication,authorization("customer", "admin"),async (req,res)=>{
    try{
        const orders = await getCustomerOrders(req.user.email);
        res.status(200).json({
            "message" : "Orders fetched successfully",
            "orders" : orders
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while fetching orders"
        })
    }
});

// Customer: cancel own pending order within 15-minute window
orderRoute.put('/:orderId/cancel',authentication,authorization("customer"),async (req,res)=>{
    try{
        const order = await cancelOrder(req.params.orderId, req.user.email);
        res.status(200).json({
            "message" : "Order cancelled successfully",
            "order" : order
        });
    }catch(err){
        const status = err.message.includes("not found") ? 404
            : err.message.includes("expired") ? 410
            : err.message.includes("Only pending") ? 400
            : 500;
        res.status(status).json({
            "message" : err.message || "error while cancelling order"
        })
    }
});

// Admin: update order status (payed / approved / rejected)
orderRoute.put('/:orderId/status',authentication,authorization("admin"),async (req,res)=>{
    try{
        const allowed = ["pending","payed","approved","rejected","cancelled","returned"];
        if(!allowed.includes(req.body.status)){
            return res.status(400).json({ "message": "Invalid status value" });
        }
        const order = await updateStatus(req.params.orderId, req.body.status);
        res.status(200).json({
            "message" : "Order status updated successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message || "error while updating order"
        })
    }
});

orderRoute.get('/',authentication,authorization("admin"),async (req,res)=>{
    try{
        const orders = await getOrder();
        res.status(200).json({
            "message" : "Orders fetched successfully",
            "orders" : orders
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while fetching orders"
        })
    }
});

orderRoute.put('/update-stock-on-rent/:orderId',authentication,async (req,res)=>{
    try{
        const order = await updateStockOnItemRent(req.params.orderId);
        res.status(200).json({
            "message" : "Stock updated successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while updating stock"
        })
    }
});

orderRoute.put('/update-stock-on-return/:orderId',authentication,authorization("admin"),async (req,res)=>{
    try{
        const order = await updateStockOnItemReturn(req.params.orderId);
        res.status(200).json({
            "message" : "Stock updated successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while updating stock"
        })
    }
});

orderRoute.put('/update-stock-on-cancel/:orderId',authentication,authorization("customer", "admin"),async (req,res)=>{
    try{
        const order = await updateStockOnOrderCancel(req.params.orderId);
        res.status(200).json({
            "message" : "Stock updated successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while updating stock"
        })
    }
});

export default orderRoute;

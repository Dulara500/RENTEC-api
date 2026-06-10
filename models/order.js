import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required: true
    },
    orderDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    status:{
        type:String,
        required:true,
        default:"pending"
    },
    orderItems:{
        type:[{
            product:{
                key:{
                    type:String
                },
                name:{
                    type:String
                },
                image:{
                    type:String,
                    required:true
                },
                price:{
                    type:Number,
                    required:true
                }
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    required:true
        
    },
    days:{
        type:Number,
        required:true
    },
    startingDate:{
        type:Date,
        required:true
    },
    endingDate:{
        type:Date,
        required:true
    },
    isApproved:{
        type:Boolean,
        required:true,
        default:false
    },
    totalAmount:{
        type:Number,
        required:true
    }
    
    
});

const Order = mongoose.model("Order",orderSchema)

export default Order;
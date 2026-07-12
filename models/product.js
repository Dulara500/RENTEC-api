import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    dimensions:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        default:"uncategorized"
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    availability:{
        type:Boolean,
        required:true,
        default:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1
    },
    image:{
        type:[String],
        required:true,
        default:["https://res.cloudinary.com/dulara/image/upload/v1690794415/kv-audio/default-product-image_ajlq8h.jpg"]
    }
});

const Product = mongoose.model("Product",productSchema);

export default Product;
import Order from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req){
    const data = req.body;
    const orderInfo={
        orderItems:[]
    }
    orderInfo.email = req.user.email

    const lastorder = await Order.find().sort({orderId:-1}).limit(1);
    if(lastorder.length === 0){
        orderInfo.orderId = "ORD-0001";
    }else{
        orderInfo.orderId = `ORD-${String(parseInt(lastorder[0].orderId.split('-')[1])+1).padStart(4,"0")}`;
    }

    let oneDayCost=0;

    for(let i=0; i<data.orderItems.length; i++){
        try{
            const product = await Product.findOne({key:data.orderItems[i].key})

            if(product==null){
                throw new Error("Product Not Found") 
            }
            if(product.availability==false){
                throw new Error("Product Not Available")
            }

            orderInfo.orderItems.push({
                product:{
                    key:product.key,
                    name:product.name,
                    image:product.image[0],
                    price:product.price
                },
                quantity:data.orderItems[i].quantity
            })

            oneDayCost += product.price * data.orderItems[i].quantity;
            
        }catch(e){
            console.log(e)
            throw new Error("Failed to create order"+e)
        }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days;
    orderInfo.shippingAddress = data.shippingAddress;
    orderInfo.paymentMethod = data.paymentMethod;
    orderInfo.status = data.status;

    console.log(orderInfo)

    try{
        const newOrder = new Order(orderInfo);
        const result = await newOrder.save();
        return result;
    }catch(e){
        throw e;
    }
    
}

export async function getOrder(){
    try{
        const orders = await Order.find();
        return orders;
    }catch(e){
        throw new Error("Failed to Get Order")
    }
}

export async function getCustomerOrders(email){
    try{
        const orders = await Order.find({email});
        return orders;
    }catch(e){
        throw new Error("Failed to Get Customer Orders")
    }
}
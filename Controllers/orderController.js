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

export async function cancelOrder(orderId, email){
    const order = await Order.findOne({orderId, email});
    if(!order){
        throw new Error("Order not found");
    }
    if(order.status !== "pending"){
        throw new Error("Only pending orders can be cancelled. If already paied contact the admin");
    }
    const FIFTEEN_MIN_MS = 15 * 60 * 1000;
    const elapsed = Date.now() - new Date(order.orderDate).getTime();
    if(elapsed > FIFTEEN_MIN_MS){
        throw new Error("Cancellation window has expired (15 minutes)");
    }
    order.status = "cancelled";
    const updated = await order.save();
    return updated;
}

export async function updateStatus(orderId,status){
    const order = await Order.findOne({orderId});
    if(!order){
        throw new Error("Order not found");
    }
    order.status = status;
    const updated = await order.save();
    return updated;
}

export async function updateStockOnItemReturn(orderId){
    const order = await Order.findOne({orderId});
    if(!order){
        throw new Error("Order not found");
    }
    
    for(let i=0; i<order.orderItems.length; i++){
        const product = await Product.findOne({key:order.orderItems[i].product.key});
        if(!product){
            throw new Error("Product not found");
        }
        const updated = await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
            $inc:{quantity:order.orderItems[i].quantity}
        },{new:true})
        if(updated.quantity>0){
            await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
                $set:{availability:true}
            },{new:true})
        }
    }
    return true;
}

export async function updateStockOnItemRent(orderId){
    const order = await Order.findOne({orderId});
    if(!order){
        throw new Error("Order not found");
    }
    for(let i=0; i<order.orderItems.length; i++){
        const product = await Product.findOne({key:order.orderItems[i].product.key});
        if(!product){
            throw new Error("Product not found");
        }
        const updated = await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
            $inc:{quantity:-order.orderItems[i].quantity}
        },{new:true})
        if(updated.quantity===0){
            await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
                $set:{availability:false}
            },{new:true})
        }else{
            await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
                $set:{availability:true}
            },{new:true})
        }
    }
    return true;
}

export async function updateStockOnOrderCancel(orderId){
    const order = await Order.findOne({orderId});
    if(!order){
        throw new Error("Order not found");
    }
    for(let i=0; i<order.orderItems.length; i++){
        const product = await Product.findOne({key:order.orderItems[i].product.key});
        if(!product){
            throw new Error("Product not found");
        }
        const updated = await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
            $inc:{quantity:order.orderItems[i].quantity}
        },{new:true})
        if(updated.quantity>0){
            await Product.findOneAndUpdate({key:order.orderItems[i].product.key},{
                $set:{availability:true}
            },{new:true})
        }
    }
    return true;
}
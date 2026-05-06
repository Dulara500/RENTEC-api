import Product from "../models/product.js";

export async function getProducts() {
    return Product.find();
};

export async function createProduct(data) {
    let product = new Product(data);
    return product.save();
};
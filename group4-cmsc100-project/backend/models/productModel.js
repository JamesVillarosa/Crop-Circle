// Schema
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        enum: [1, 2, 3, 4, 5], //1 Staple/2 Fruits and Vegetables/ 3 Livestock/ 4 Seafood/ 5 Others)
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const Product = model('Product', productSchema);

// Export the Product model
export default Product;
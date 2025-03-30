import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: String },
    addedQuantity: { type: Number, required: true },
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
    imageUrl: {
        type: String,
        required: true
    }
});

const Cart = model('Cart', cartSchema);

export default Cart;
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        default: uuidv4,
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
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    addedQuantity: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    orderStatus: {
        type: Number,
        enum: [0, 1, 2], //(Int: 0 Pending / 1 Completed / 2 Canceled )
        default: 0,
        required: true
      },
    dateOrdered: {
    type: Date,
    default: Date.now,
    required: true
    },
    timeOrdered: {
        type: String,
        default: () => new Date().toLocaleTimeString(),
        required: true
    }
});

const Order = model('Order', orderSchema);

export default Order;
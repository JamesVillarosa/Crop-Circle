import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({ 
    email: { type: String, required: true },
    fname: { type: String, required: true },
    mname: { type: String },
    lname: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
});

const User = model('User', userSchema);

export default User;
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Cart from './models/cartModel.js';
import Order from './models/orderModel.js';
import 'dotenv/config';


const SECRET_KEY = 'super-secret-key';

// connect to express app
const app = express();

// connect to mongoDB
const dbURI = 'mongodb+srv://jvvillarosa:2SIItT2zSMwamnhL@projectdb.2ib30.mongodb.net/';

// Landing route for /
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Crop Circle API!');
});

// Self-ping function to keep the server alive
const keepServerAlive = () => {
  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT}`;
  setInterval(async () => {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        console.log('Server pinged to stay alive.');
      } else {
        console.error('Server ping failed with status:', response.status);
      }
    } catch (err) {
      console.error('Error pinging the server:', err.message);
    }
  }, 5 * 60 * 1000); // Ping every 5 minutes
};

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server connected to port ${process.env.PORT} and MongoDB`);
      keepServerAlive();
    });
  })
  .catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB', error);
  });

// middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware to verify admin status
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.isAdmin) {
      // User is an admin, proceed to the next middleware
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      next();
  } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

app.get('/test-auth', authenticateToken, (req, res) => {
  res.json({ message: 'Authenticated successfully', userId: req.userId });
});

// Routes

// REGISTER
// POST REGISTER
app.post('/register', async (req, res) => {
  try {
    const { email, fname, mname, lname, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, fname, mname, lname, password: hashedPassword, isAdmin });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing up' });
  }
});

// GET Registered Users
app.get('/register', async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to get users' });
  }
});

// LOGIN
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.isAdmin) {
      const tokenPayload = { userId: user._id, isAdmin: true };
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1hr' });
      res.json({ message: 'Admin login successful', token });
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to log in as an admin' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin login not allowed' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});


// using isAdmin middleware
app.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

// CRUD - create, read, update, delete

app.post('/products', async (req, res) => {
  try {
    const { productId, name, price, description, type, quantity, imageUrl } = req.body;
    const newProduct = new Product({ productId, name, price, description, type, quantity, imageUrl });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
});

// GET products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});


// POST request to add product to cart
app.post('/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, name, price, description, type, addedQuantity, imageUrl } = req.body;
    const userId = req.userId;

    // Check if the product already exists in the cart
    let cartItem = await Cart.findOne({ user: userId, productId });

    if (cartItem) {
      // If the product exists, increment the quantity
      cartItem.addedQuantity += addedQuantity;
      await cartItem.save();
      console.log(`Product with ID ${productId} quantity updated to ${cartItem.addedQuantity} for user ${userId}`);
      res.status(200).json({ message: 'Product quantity updated in cart successfully' });
    } else {
      // If the product does not exist, add it to the cart
      cartItem = new Cart({ user: userId, productId, name, price, description, type, addedQuantity, imageUrl });
      await cartItem.save();
      console.log(`Product with ID ${productId} added to cart for user ${userId} with quantity ${addedQuantity}`);
      res.status(200).json({ message: 'Product added to cart successfully' });
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'An error occurred while adding the product to cart' });
  }
});

// GET Products that are in cart
app.get('/cart', authenticateToken, async (req, res) => {
  try {
      const userId = req.userId; 
      const cartItems = await Cart.find({ user: userId }).populate('productId');
      res.status(200).json(cartItems);
  } catch (error) {
      console.error('Error fetching products from cart:', error);
      res.status(500).json({ error: 'Unable to fetch products from cart' });
  }
});

// DELETE request to remove product from cart
app.delete('/cart/:id', authenticateToken, async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.userId;
    
    // Ensure the cart item belongs to the authenticated user
    const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, user: userId });
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    console.log(`Product with ID ${cartItemId} removed from cart for user ${userId}`);
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'An error occurred while removing the product from cart' });
  }
});

// POST request to place an order
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Find the user's cart items
    const cartItems = await Cart.find({ user: userId });

    // Transform cart items into order items
    const orderItems = cartItems.map(item => ({
      user: userId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      description: item.description,
      type: item.type,
      addedQuantity: item.addedQuantity,
      imageUrl: item.imageUrl
    }));

    // Save the order items to the database
    console.log('Order Items:', orderItems);
    const savedOrders = await Order.insertMany(orderItems);


    // Clear the user's cart after placing the order
    await Cart.deleteMany({ user: userId });

    res.status(200).json({ message: 'Order placed successfully', orders: savedOrders });
  } catch (error) {
    console.error('Error placing order:', error); // Detailed error logging
    res.status(500).json({ error: 'An error occurred while placing the order', details: error.message });
  }
});

// GET request to fetch all orders for the authenticated user
app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId; 

    // Fetch all orders from the database for the authenticated user
    const orders = await Order.find({ user: userId }).populate('user', 'name');

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// PATCH request to cancel an order
app.patch('/orders/:id/cancel', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { orderStatus: 2 } },  
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found or user does not have permission to cancel this order' });
    }

    res.status(200).json({ message: 'Order canceled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ error: 'An error occurred while canceling the order', details: error.message });
  }
});

// PATCH request to complete an order
app.patch('/orders/:id/complete', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Find the product by ID
    const product = await Product.findOne({ productId: order.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product has enough quantity to fulfill the order
    if (product.quantity < order.addedQuantity) {
      return res.status(400).json({ error: 'Insufficient product quantity to complete the order' });
    }

    // Decrement the product quantity by the order's added quantity
    product.quantity -= order.addedQuantity;

    // Save the updated product
    await product.save();

    // Update the order status to 'completed'
    order.orderStatus = 1;
    const updatedOrder = await order.save();

    res.status(200).json({ message: 'Order completed successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: 'An error occurred while completing the order', details: error.message });
  }
});


// DELETE request to remove product from mart and all carts
app.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    // Remove the product from all carts
    await Cart.deleteMany({ productId });

    // Remove the product from the products collection
    const product = await Product.findOneAndDelete({ productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Product with ID ${productId} removed from mart and all carts`);

    res.status(200).json({ message: 'Product removed from mart and all carts successfully' });
  } catch (error) {
    console.error('Error removing product from mart and all carts:', error);
    res.status(500).json({ error: 'An error occurred while removing the product from mart and all carts' });
  }
});

  
app.put('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, type, quantity, imageUrl } = req.body;

    // Use findOneAndUpdate to update existing document
    const editedProduct = await Product.findOneAndUpdate(
      { productId }, // Search criteria
      { name, price, description, type, quantity, imageUrl }, // Updated fields
      { new: true } // Return updated document
    );

    if (!editedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product edited successfully:', editedProduct);
    res.status(200).json({ message: 'Product edited successfully', product: editedProduct });
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).json({ error: 'An error occurred while editing the product' });
  }
});

// GET all Users
app.get('/admin/users/show', async (req, res) => {
  try {
    const users = await User.find();
    const filteredUsers = users.filter(user => !user.isAdmin);
    console.log(filteredUsers);
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

// GET request to fetch user information
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId; 
    const user = await User.findById(userId).select('fname mname lname email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});


// PATCH request to update user information
app.patch('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId; 
    const updates = req.body; 

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('fname mname lname email');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Failed to update user information' });
  }
});


// GET all Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Unable to fetch user' });
  }
});

// GET request to fetch all orders
app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});


// Route to fetch orders by month and year
app.get('/completedOrders/:month/:year', async (req, res) => {
  const { month, year } = req.params;
  try {
    const orders = await Order.find({
      orderStatus: 1,
      dateOrdered: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Route to fetch orders by year
app.get('/completedOrders/year/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const orders = await Order.find({
      orderStatus: 1,
      dateOrdered: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year, 12, 1),
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Route to fetch orders by week and year
app.get('/completedOrders/week/:week/:year', async (req, res) => {
  const { week, year } = req.params;
  try {
    const startOfWeek = getDateOfISOWeek(week, year);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const orders = await Order.find({
      orderStatus: 1,
      dateOrdered: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Helper function to get the date of the ISO week
function getDateOfISOWeek(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}


export default app;
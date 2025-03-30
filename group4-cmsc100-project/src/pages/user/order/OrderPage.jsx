import React, { useState, useEffect } from "react";
import OrderList from "./OrderList";
import axios from "axios";
import "../../styles/UserOrders.css";
import Footer from "../../components/Footer";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from the database
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:3001/orders", {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });

      // Update the orders state with the fetched data
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching ordered products:", error);
      setError('No ordered products.'); 
    }
  };

  return (
    <div className="order-page">
      <img src="../../src/assets/illus/illus3.png" alt="Illustration" className="orders-image" />
      <h2 className="orderspage-title">Orders</h2>
      {error && <p className="error-message">{error}</p>}
      <OrderList orders={orders} />
      <Footer />
    </div>
  );
};

export default OrderPage;

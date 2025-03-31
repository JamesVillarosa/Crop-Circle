import React, { useState, useEffect } from "react";
import AdminOrderList from "./AdminOrderList";
import axios from "axios";
// import "/styles/UserOrders.css";
import Footer from "../../../components/Footer";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to fetch orders from the database
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`, {
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching ordered products:", error);
      setError('Failed to load ordered products.'); 
    }
  };

  return (
    <div className="order-page">
      <img style={{marginTop: '6%'}} src="../../src/assets/illus/illus3.png" alt="Illustration" className="orders-image" />
      <h2 className="orderspage-title">Orders</h2>
      {error && <p className="error-message">{error}</p>}
      <AdminOrderList orders={orders} />
      <Footer />
    </div>
  );
};

export default AdminOrderPage;

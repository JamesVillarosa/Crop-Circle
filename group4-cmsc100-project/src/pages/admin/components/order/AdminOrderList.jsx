import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../../components/modals/Modal";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    color: "",
    icon: "",
    title: "",
    message: "",
  });

  const orderStatusLabels = {
    0: "Pending",
    1: "Ready for Delivery",
    2: "Canceled"
  };

  const foodTypeLabels = {
    1: "Staple",
    2: "Fruits & Veggies",
    3: "Livestock",
    4: "Seafood",
    5: "Others",
    'All': "All Type",
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const completeOrder = async (orderId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/complete`, {});

      if (response.status === 200) {
        setModalContent({
          color: "#28a745",
          icon: "../../src/assets/icons/modal-check.png",
          title: "Order Completion Successful",
          message: response.data.message,
        });
      } else {
        setModalContent({
          color: "red",
          icon: "../../src/assets/icons/modal-x.png",
          title: "Failed to Complete Order",
          message: response.data.error,
        });
      }
    } catch (error) {
      console.error('Error completing the order:', error);
      setModalContent({
        color: "red",
        icon: "../../src/assets/icons/modal-x.png",
        title: "Error",
        message: "An error occurred while completing the order.",
      });
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
      }
    } finally {
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      fetchOrders();
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.orderStatus === parseInt(filter));

  return (
    <div className="order-product-list">
      {modalVisible && <Modal {...modalContent} />}
      <div className="mart-sorting-button">
        <button onClick={() => setFilter('all')} className="sort-by-name">All</button>
        <button onClick={() => setFilter('0')} className="sort-by-price">Pending</button>
        <button onClick={() => setFilter('1')} className="sort-by-qty">Completed</button>
        <button onClick={() => setFilter('2')} className="sort-by-type">Canceled</button>
      </div>
      <div className="order-products">
        {filteredOrders.map((order) => (
          <div key={order._id} className="order-item">
            <img src={order.imageUrl} alt={order.name} className="order-product-image"/>
            <div className="order-transaction"> Transaction ID: {order.transactionId}</div>
            <div className="order-product-details">
              <span className="span-name-price">
                <h3 className="order-productname">{order.name}</h3>
                <p className="order-productprice">₱{order.price}</p>
              </span>
              <div>
                <span className="span-order" style={{ display: 'flex' }}>
                  <p className="order-foodtype">{foodTypeLabels[order.type]}</p>
                  <p className="order-productqty">Qty: {order.addedQuantity}</p>
                  <p className={`order-status ${order.orderStatus === 1 ? 'completed' : order.orderStatus === 2 ? 'canceled' : ''}`}> {orderStatusLabels[order.orderStatus]} </p>
                </span>
              </div>
              <div className="order-desc-container">
                <p className="order-desc">{order.description}</p>
              </div>
            </div>
            {order.orderStatus === 0 && <button className="cancel-order" onClick={() => completeOrder(order._id)}>Complete Order</button>}
            <div className="order-time">Ordered at: {order.dateOrdered} {order.timeOrdered}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/OrderProducts.css";
import Modal from "../../components/modals/Modal";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalProps, setModalProps] = useState({
    color: '',
    icon: '',
    title: '',
    message: '',
    actions: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:3001/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setModalProps({
          color: "#28a745",
          icon: './src/assets/icons/modal-check.png',
          title: "Success",
          message: "Order cancelled successfully.",
          actions: null,
        });
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          fetchOrders();
        }, 2000);
      } else {
        setModalProps({
          color: "#fcbf49",
          icon: './src/assets/icons/modal-warning.png',
          title: "Error",
          message: "Failed to cancel order.",
          actions: null,
        });
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setModalProps({
        color: "#fcbf49",
        icon: './src/assets/icons/modal-warning.png',
        title: "Error",
        message: "An error occurred while cancelling the order.",
        actions: null,
      });
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    if (selectedOrder) {
      cancelOrder(selectedOrder._id);
    }
    setShowConfirmModal(false);
    setSelectedOrder(null);
  };

  const handleCancelModalClose = () => {
    setShowConfirmModal(false);
    setSelectedOrder(null);
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.orderStatus === parseInt(filter));

  return (
    <div className="order-product-list">
      {showModal && (
        <Modal
          color={modalProps.color}
          icon={modalProps.icon}
          title={modalProps.title}
          message={modalProps.message}
          actions={modalProps.actions}
        />
      )}
      {showConfirmModal && (
        <Modal
          color="#fcbf49"
          icon="./src/assets/icons/modal-warning.png"
          title="Confirm Cancellation"
          message="Are you sure you want to cancel this order?"
          actions={
            <>
              <button className="minimal-button" onClick={handleConfirmCancel}>Yes</button>
              <button className="minimal-button" onClick={handleCancelModalClose}>No</button>
            </>
          }
        />
      )}
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
                {order.orderStatus === 0 && <button className="cancel-order" onClick={() => handleCancelClick(order)}>Cancel Order</button>}
            <div className="order-time">Ordered at: {order.dateOrdered} {order.timeOrdered}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;

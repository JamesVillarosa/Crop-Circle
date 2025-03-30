import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Product.css";
import Modal from "../../components/modals/Modal";

const CartList = ({ cartProducts }) => {
  const [cartList, setCartList] = useState([]);
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedType, setSelectedType] = useState('All');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    color: '',
    icon: '',
    title: '',
    message: '',
    actions: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const foodTypeLabels = {
    1: "Staple",
    2: "Fruits & Veggies",
    3: "Livestock",
    4: "Seafood",
    5: "Others",
    'All': 'All Types',
  };

  useEffect(() => {
    setCartList(cartProducts);
  }, [cartProducts]);

  useEffect(() => {
    const filtered = selectedType === 'All' ? cartProducts : cartProducts.filter(product => product.type.toString() === selectedType);
    const sorted = filtered.sort((a, b) => {
      if (!sortOrder) return 0;
      let comparison = 0;
      switch (sortType) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
        case 'quantity':
          comparison = a[sortType] - b[sortType];
          break;
        case 'foodType':
          comparison = foodTypeLabels[a.type].localeCompare(foodTypeLabels[b.type]);
          break;
        default:
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setCartList(sorted);
  }, [cartProducts, selectedType, sortOrder, sortType]);

  useEffect(() => {
    let quantity = 0;
    let price = 0;
    cartList.forEach(item => {
      quantity += item.addedQuantity;
      price += item.addedQuantity * item.price;
    });
    setTotalQuantity(quantity);
    setTotalPrice(price);
  }, [cartList]);

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/cart/${cartItemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCartList(cartList.filter(item => item._id !== cartItemId));
      setModalProps({
        color: '#AD4D4D',
        icon: './src/assets/icons/modal-delete.png',
        title: 'Successfully Deleted',
        message: 'The product has been deleted in the cart.',
        actions: null,
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleSortChange = (type) => {
    setSortType(type);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/orders', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCartList([]);
      setModalProps({
        color: '#28a745',
        icon: './src/assets/icons/modal-check.png',
        title: 'Order Placed',
        message: 'Your order has been placed successfully.',
        actions: null,
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handlePlaceOrderClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPlaceOrder = () => {
    placeOrder();
    setShowConfirmModal(false);
  };

  const handleCancelModalClose = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="cart-list">
      <h1 className="cartspage-title">Cart</h1>
      <div className="mart-sorting-button">
        <button onClick={() => handleSortChange('name')} className="sort-by-name">
          Name {sortType === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSortChange('price')} className="sort-by-price">
          Price {sortType === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSortChange('quantity')} className="sort-by-qty">
          Quantity {sortType === 'quantity' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </button>
        <select id="typeSelect" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="sort-by-type">
          {Object.entries(foodTypeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="cart-products">
        {cartList.map((item) => (
          <div key={item._id} className="cart-product">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="product-image"
            />
            <div className="product-details">
              <span className="span-name-price">
                <h3 className="productname" style={{ textAlign: 'left' }}>{item.name}</h3>
                <p className="productprice" style={{ textAlign: 'right' }}>₱{item.price}</p>
              </span>
              <div>
                <span className="span" style={{ display: 'flex', alignItems: 'center', marginLeft: '-5px' }}>
                  <p className="foodtype">{foodTypeLabels[item.type]}</p>
                  <p className="productqty">Qty: {item.addedQuantity}</p>
                </span>
              </div>
              <p className="desc">Description: {item.description}</p>
              <div className="delete-order">
                <button onClick={() => removeFromCart(item._id)} className="deletebtn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="orderbtn-container">
        <div className="total">
          <p>Total Quantity: {totalQuantity}</p>
          <p>Total Price: ₱{totalPrice}</p>
        </div>
        {cartList.length > 0 && <button onClick={handlePlaceOrderClick} className="orderbtn">Order</button>}
      </div>

      {showModal && <Modal {...modalProps} />} 

      {showConfirmModal && (
        <Modal
          color="#fcbf49"
          icon="./src/assets/icons/modal-warning.png"
          title="Confirm Order"
          message="Are you sure you want to place the order?"
          actions={
            <>
              <button className="minimal-button" onClick={handleConfirmPlaceOrder}>Yes</button>
              <button className="minimal-button" onClick={handleCancelModalClose}>No</button>
            </>
          }
        />
      )}
    </div>
  );
};

export default CartList;

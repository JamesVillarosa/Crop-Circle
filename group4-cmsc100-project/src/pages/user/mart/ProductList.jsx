import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/MartsButton.css";
import "../../styles/Product.css";
import Modal from "../../components/modals/Modal"

const ProductList = ({ products, title }) => {
  const [productList, setProductList] = useState([]);
  const [productQuantity, setProductQuantity] = useState({});
  const [selectedType, setSelectedType] = useState('All');
  const [sortOrder, setSortOrder] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [modalProps, setModalProps] = useState({
    color: '',
    icon: '',
    title: '',
    message: ''
  });
  const [showModal, setShowModal] = useState(false);

  const foodTypeLabels = {
    1: "Staple",
    2: "Fruits & Veggies",
    3: "Livestock",
    4: "Seafood",
    5: "Others",
    'All': "All Types"
  };

  useEffect(() => {
    const initialQuantity = {};
    products.forEach(product => {
      initialQuantity[product.productId] = 0;
    });
    setProductList(products);
    setProductQuantity(initialQuantity);
  }, [products]);

  useEffect(() => {
    const filtered = selectedType === 'All' ? products : products.filter(product => product.type.toString() === selectedType);
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
          comparison = a.foodType.localeCompare(b.foodType);
          break;
        default:
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setProductList(sorted);
  }, [products, selectedType, sortOrder, sortType]);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModalProps({
        title: 'Error',
        message: '',
        color: '', // Set color to red for error
        icon: '' // Set icon for error
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
      return;
    }
  
    if (productQuantity[product.productId] === 0) {
      setModalProps({
        title: 'Error',
        message: 'Quantity cannot be 0.',
        color: '#fcbf49',
        icon: './src/assets/icons/modal-warning.png'
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
      return;
    }
  
    if (productQuantity[product.productId] > product.quantity) {
      setModalProps({
        title: 'Error',
        message: 'Cannot add more than available quantity.',
        color: '#AD4D4D', // Set color to red for error
        icon: './src/assets/icons/error.png' // Set icon for error
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
      return;
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/cart`, {
        productId: product.productId,
        name: product.name,
        price: product.price,
        description: product.description,
        type: product.type,
        addedQuantity: productQuantity[product.productId],
        imageUrl: product.imageUrl
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log("Product added to cart:", response.data);
      setModalProps({
        title: 'Success',
        message: 'Product added to cart!',
        color: '#28a745', // Set color to green for success
        icon: './src/assets/icons/modal-cart.png' // Set icon for success
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
      // Reset quantity to zero after successful addition
      setProductQuantity(prev => ({
        ...prev,
        [product.productId]: 0
      }));
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setModalProps({
        title: 'Error',
        message: 'Failed to add product to cart.',
        color: '#AD4D4D', // Set color to red for error
        icon: './src/assets/icons/modal-x.png' // Set icon for error
      });
      setShowModal(true); // Show the modal
      setTimeout(() => setShowModal(false), 3000); // Hide the modal after 3 seconds
    }
  };
  
  
  
  const toggleQuantity = (productId, delta) => {
    setProductQuantity(prev => ({
      ...prev,
      [productId]: Math.max(0, prev[productId] + delta)
    }));
  };

  const handleSortChange = (type) => {
    setSortType(type);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="product-list">
      <h2>{title}</h2>
      <div className="mart-sorting-button">
      <h1 className="martspage-title">Mart</h1>
        <button onClick={() => handleSortChange('name')} className="sort-by-name">
        Name {sortType === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <button onClick={() => handleSortChange('price')} className="sort-by-price">
        Price {sortType === 'price' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <button onClick={() => handleSortChange('quantity')} className="sort-by-qty">
        Quantity {sortType === 'quantity' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</button>
        <select id="typeSelect" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="sort-by-type">
        {Object.entries(foodTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
        </select>
      </div>
      
      <div className="products">
        {productList.map(product => (
          <div key={product.productId} className="product">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="productimage"
            />
            <div className="product-details">
              <span className="span-name-price">
                  <h3 className="productname">{product.name}</h3>
                  <p className="productprice">₱{product.price}</p>
              </span>
              <div>
                <span className="span">
                  <p className="foodtype">{foodTypeLabels[product.type]}</p>
                  <p className="productqty">Qty: {product.quantity}</p>
                </span>
              </div>
              <div className="desc">{product.description}</div>
              <div className="addcart-plus">
                <button onClick={() => toggleQuantity(product.productId, -1)}> - </button>
                <span className="qtybutton">{productQuantity[product.productId]} </span>
                <button onClick={() => toggleQuantity(product.productId, 1)}> + </button>
                <button className='addToCart' onClick={() => addToCart(product)}> Add to Cart </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <Modal {...modalProps} onClose={() => setShowModal(false)} />}
    </div>
    
  );
};

export default ProductList;

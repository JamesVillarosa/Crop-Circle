import React, { useState, useEffect } from "react";
import axios from "axios";
import CartList from "./CartList.jsx";
import "../../styles/Cart.css";
import Footer from "../../components/Footer";
import emptyCartIcon from "/src/assets/icons/empty-cart.png"; 

function CartPage() {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState("");  

  const fetchCartProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:3001/cart", {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      setCartProducts(response.data);
    } catch (error) {
      console.error("Error fetching cart products:", error);
      setError('Failed to load cart products.'); 
    }
  };  

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src="../../src/assets/illus/illus2.png" alt="Illustration" className="carts-image" />                                      
      </header>
      <main>
        {cartProducts.length === 0 ? (
          <div className="empty-cart">
            <img src={emptyCartIcon} alt="Empty Cart" className="empty-cart-icon" />
          </div>
        ) : (
          <CartList cartProducts={cartProducts} />
        )}
        {error && <p className="error">{error}</p>}
      </main>
      <Footer />
    </div>
  );
}

export default CartPage;

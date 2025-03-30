import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductListing from "./ProductListing";
import "../../../styles/Product.css";

function ProductPage() {
  // State to store the fetched products
  const [product, setProduct] = useState([]);

  // Function to fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/products");
      // Update the products state with the fetched data
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <header className="App-header"></header>
      <main>
        <ProductListing products={product} />
      </main>
    </div>
  );
}

export default ProductPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../../components/Footer";
import Modal from "../../../components/modals/Modal";
import "../../styles/ProductListingButton.css";
import "../../styles/AddProducts.css"

const ProductListing = ({ products, title }) => {
  const [productList, setProductList] = useState([]);
  const [productQuantity, setProductQuantity] = useState({});
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    price: "",
    description: "",
    type: "",
    quantity: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const removeFromMart = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const foodTypeLabels = {
    1: "Staple",
    2: "Fruits and Vegetables",
    3: "Livestock",
    4: "Seafood",
    5: "Others",
    All: "All Types",
  };

  useEffect(() => {
    const initialQuantity = {};
    products.forEach((product) => {
      initialQuantity[product.productId] = 0;
    });
    setProductList(products);
    setProductQuantity(initialQuantity);
  }, [products]);

  useEffect(() => {
    const filtered =
      selectedType === "All"
        ? products
        : products.filter(
            (product) => product.type.toString() === selectedType
          );
    const sorted = filtered.sort((a, b) => {
      if (!sortOrder) return 0;
      let comparison = 0;
      switch (sortType) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
        case "quantity":
          comparison = a[sortType] - b[sortType];
          break;
        case "foodType":
          comparison = a.foodType.localeCompare(b.foodType);
          break;
        default:
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    setProductList(sorted);
  }, [products, selectedType, sortOrder, sortType]);

  const handleSortChange = (type) => {
    setSortType(type);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/products/${productToDelete.productId}`
      );
      openModal({
        color: "#28a745",
        icon: "../../src/assets/icons/modal-check.png",
        title: "Success",
        message: "Product is successfully deleted.",
      });
      setTimeout(() => closeModal(), 3000); // Hide the modal after 3 seconds
      setProductList(
        productList.filter((item) => item.productId !== productToDelete.productId)
      );
    } catch (error) {
      console.error("Error removing product from mart:", error);
      const errorMessage = "Failed to remove product.";
      openModal({
        color: "red",
        icon: "../../src/assets/icons/modal-x.png",
        title: "Error",
        message: errorMessage,
      });
      setTimeout(() => closeModal(), 3000); // Hide the modal after 3 seconds
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
      type: product.type,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
    });
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setFormData({
      productId: "",
      name: "",
      price: "",
      description: "",
      type: "",
      quantity: "",
      imageUrl: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(
          `http://localhost:3001/products/${editingProduct.productId}`,
          formData
        );
      } else {
        response = await axios.post("http://localhost:3001/products", formData);
        window.location.reload();
      }

      if (response.status === 200 || response.status === 201) {
        const successMessage = editingProduct
          ? "Product edited successfully!"
          : "Product added successfully!";
        openModal({
          color: "#28a745",
          icon: "../../src/assets/icons/modal-check.png",
          title: "Success",
          message: successMessage,
        });
        setTimeout(() => closeModal(), 3000); // Hide the modal after 3 seconds
        setProductList((prevList) => {
          if (editingProduct) {
            return prevList.map((item) =>
              item.productId === editingProduct.productId
                ? { ...item, ...formData }
                : item
            );
          } else {
            return [...prevList, response.data];
          }
        });
        setEditingProduct(null);
        setIsAddingProduct(false);
      } else {
        const errorMessage = "Failed to submit product.";
        openModal({
          color: "red",
          icon: "../../src/assets/icons/modal-x.png",
          title: "Error",
          message: errorMessage,
        });
        setTimeout(() => closeModal(), 3000); // Hide the modal after 3 seconds
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      const errorMessage = "An error occurred while submitting the product.";
      openModal({
        color: "red",
        icon: "../../src/assets/icons/modal-x.png",
        title: "Error",
        message: errorMessage,
      });
      setTimeout(() => closeModal(), 3000); // Hide the modal after 3 seconds
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="product-list">
        <h2 className="productlisting-title">PRODUCTS</h2>
        <div>
          <button className="productlisting-button" onClick={handleAddProduct}>
            +
          </button>
        </div>
        <div className="product-sorting-container">
          <button
            className="sort-by-name"
            onClick={() => handleSortChange("name")}
          >
            Name {sortType === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            className="sort-by-price"
            onClick={() => handleSortChange("price")}
          >
            Price {sortType === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            className="sort-by-qty"
            onClick={() => handleSortChange("quantity")}
          >
            Quantity{" "}
            {sortType === "quantity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </button>
          <select
            id="typeSelect"
            className="sort-by-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {Object.entries(foodTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="products">
          {productList.map((product) => (
            <div key={product.productId} className="product">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h3 className="productname">{product.name}</h3>
                <p className="productprice">₱{product.price}</p>
                <p className="desc">{product.description}</p>
                <p className="foodtype">{foodTypeLabels[product.type]}</p>
                <p className="foodquantity">Quantity: {product.quantity}</p>
                <div>
                  <button
                    className="productlisting-delete"
                    onClick={() => removeFromMart(product)}
                  >
                    Delete
                  </button>
                  <button
                    className="productlisting-edit"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {(editingProduct || isAddingProduct) && (
          <div className="edit-form-popup">
            <div className="edit-form">
              <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  name="productId"
                  id="product-id"
                  placeholder="Product ID"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                  readOnly={!!editingProduct}
                />
                <input
                  type="text"
                  name="name"
                  id="food-name"
                  placeholder="Food name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  id="food-price"
                  placeholder="Food Price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="1">Staple</option>
                  <option value="2">Fruits and Vegetables</option>
                  <option value="3">Livestock</option>
                  <option value="4">Seafood</option>
                  <option value="5">Others</option>
                </select>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="imageUrl"
                  id="image-url"
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingProduct(false);
                  }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal
          color={modalContent.color}
          icon={modalContent.icon}
          title={modalContent.title}
          message={modalContent.message}
          actions={modalContent.actions}
        />
      )}
      {showConfirmModal && (
        <Modal
          color="#fcbf49"
          icon="../../src/assets/icons/modal-warning.png"
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${productToDelete.name}?`}
          actions={
            <>
              <button className="minimal-button" onClick={handleConfirmDelete}>
                Yes
              </button>
              <button className="minimal-button" onClick={handleCancelDelete}>
                No
              </button>
            </>
          }
        />
      )}
      <Footer />
    </>
  );
};

export default ProductListing;

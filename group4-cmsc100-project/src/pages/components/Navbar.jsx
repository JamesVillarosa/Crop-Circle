import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import NavbarLogo from "../../assets/illus/navbar-icon.png";
import ShoppingBag from "../../assets/icons/shopping-bag-orange.png";
import ShoppingCart from "../../assets/icons/shopping-cart-orange.png";
import SampleIcon from "../../assets/icons/usernavbar-icon.png";
import UserModal from "../../pages/components/modals/UserModal";

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isUserSignedIn = localStorage.getItem("token");
  const isAdminSignedIn =
    localStorage.getItem("token") && location.pathname.startsWith("/admin");

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUserPhotoClick = () => {
    setIsModalOpen(prevState => !prevState); // Toggle modal state
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar-background");
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isUserSignedIn && !isAdminSignedIn && (
        <nav className="user-navbar navbar-background sticky">
          <Link to="/home">
            <img className="navbar-logo" src={NavbarLogo} alt="Navbar Logo"></img>
          </Link>
          <ul>
            <Link to="/order">
              <img
                src={ShoppingBag}
                className="shopping-bag"
                alt="Shopping Bag"
              ></img>
            </Link>
            <Link to="/cart">
              <img
                src={ShoppingCart}
                className="shopping-cart"
                alt="Shopping Cart"
              ></img>
            </Link>
            <img
              src={SampleIcon}
              className="user-photo"
              alt="User Photo"
              onClick={handleUserPhotoClick}
            />
          </ul>
        </nav>
      )}

      {isAdminSignedIn && (
        <nav className="admin-navbar navbar-background sticky">
          <ul className="admin-nav">
            <li className="admin-components">
              <Link
                className={`admin-link ${location.pathname === "/admin/users" ? "active" : ""}`}
                to="/admin/users"
              >
                User Accounts
              </Link>
            </li>
            <li className="admin-components">
              <Link
                className={`admin-link ${location.pathname === "/admin/products" ? "active" : ""}`}
                to="/admin/products"
              >
                Product Listing
              </Link>
            </li>
            <li className="admin-components">
              <Link
                className={`admin-link ${location.pathname === "/admin/orders" ? "active" : ""}`}
                to="/admin/orders"
              >
                Orders
              </Link>
            </li>
            <li className="admin-components">
              <Link
                className={`admin-link ${location.pathname === "/admin/reports" ? "active" : ""}`}
                to="/admin/reports"
              >
                Reports
              </Link>
            </li>
            <li className="admin-components">
              <img
                src={SampleIcon}
                className="user-photo"
                alt="User Photo"
                onClick={handleUserPhotoClick}
              />
            </li>
          </ul>
        </nav>
      )}

      <UserModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Navbar;

import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import { Link } from "react-scroll";
import axios from "axios";
import HomepageLogo from "../../assets/illus/illus10.png";
import ShoppingCart from "../../assets/icons/shopping-cart.png";
import Footer from "../components/Footer";
import "../styles/Homepage.css";
import MartPage from "./mart/MartPage";

export default function Home() {
  const [userName, setUserName] = useState("");
  const cursorRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { 
          throw new Error('No token found');
        }

        const response = await axios.get("http://localhost:3001/user", {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const user = response.data;
        setUserName(user.fname); 
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();

    // Add event listener for mouse movement
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseMove = (e) => {
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    const traceElement = document.createElement("div");
    traceElement.classList.add("cursor-trace");
    document.body.appendChild(traceElement);
  
    document.addEventListener("mousemove", function (event) {
      traceElement.style.left = event.pageX + "px";
      traceElement.style.top = event.pageY + "px";
    });
  });
  

  return (
    <>
      <div className="homepage-background">
        <div className="homepage-text">
          <h1 className="welcome-name">Welcome, {userName || "Guest"}!</h1>
          <p className="welcome-subtext ">
            Dive into a world of culinary delights as you explore our curated selection of premium ingredients, handpicked from local farmers and artisans. Whether you're a seasoned chef or a passionate home cook, our extensive range of products. Shop with confidence knowing that every item is carefully sourced for its quality and freshness, ensuring a gourmet experience with every bite.
          </p>
          <Link
            to="mart-section"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="about-us-btn"
          >
            <img
              src={ShoppingCart}
              alt="Login Icon"
              style={{ color: "white", width: "20px", height: "20px" }}
              className="white-icon"
            />
            Shop Now
          </Link>
        </div>
        <img
          src={HomepageLogo}
          alt="Description of Image"
          className="homepage-logo"
        />
        <div className="background-image"></div>
        <div ref={cursorRef} className="cursor"></div>
      </div>
      <div id="mart-section">
        <MartPage />
      </div>
      <Footer />
    </>
  );
}
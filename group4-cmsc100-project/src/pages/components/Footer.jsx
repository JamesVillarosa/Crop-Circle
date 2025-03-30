import React from "react";
import { Link } from "react-router-dom";
import MailLogo from "../../assets/icons/mail.png";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <h1 className="footer-text">Crop Circle</h1>
      <Link to="/about-us" className="footer-contact">
        <img
          src={MailLogo}
          alt="Login Icon"
          style={{ color: "white", width: "20px", height: "20px" }}
          className="green-icon"
        />
        Contact Us
      </Link>
    </footer>
  );
}

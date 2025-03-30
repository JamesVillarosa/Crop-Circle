import React from "react";
import { Link } from "react-router-dom";
import CropCircleLogo from "../assets/illus/signin.png";
import mailIcon from "../assets/icons/mail.png";
import adminIcon from "../assets/icons/user-x.png";
import "./styles/WelcomePage.css";

function WelcomePage() {
  return (
    <div className="welcome-page-container">
      <div className="welcome-page">
        <img
          src={CropCircleLogo}
          alt="Crop Circle"
          className="welcomepage-logo"
        ></img>
        <h1 className="welcome-text">Crop Circle</h1>
        <Link to="/login" className="login-btn">
          <img
            src={mailIcon}
            alt="Login Icon"
            style={{ color: "white", width: "20px", height: "20px" }}
            className="white-icon"
          />
          Login
        </Link>
        <Link to="/admin/login" className="admin-btn">
          <img
            src={adminIcon}
            alt="Login Icon"
            style={{ color: "white", width: "20px", height: "20px" }}
          />
          Continue as Admin
        </Link>
        <Link to="/signup" className="signin-text">
          No Account Yet? Sign up.
        </Link>
        <p className="welcome-footer upper-welcome">contacts@ics.uplb.edu.ph</p>
        <p className="welcome-footer lower-welcome">(02) 123 4567 890</p>
      </div>
    </div>
  );
}

export default WelcomePage;

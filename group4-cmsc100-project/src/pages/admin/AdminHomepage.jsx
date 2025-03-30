// User Welcome Page
import React from "react";
import { Link } from "react-router-dom";
import AdminHomepageLogo from "../../assets/illus/illus9.png";
import Footer from "../components/Footer";
import "../styles/AdminHomepage.css";

export default function Home() {
  return (
    <>
      <div className="admin-homepage-background">
        <h1 className="admin-welcome-name">Hi, Admin!</h1>
        <img src={AdminHomepageLogo} className="admin-homepage-logo"></img>
      </div>
      <Footer />
    </>
  );
}

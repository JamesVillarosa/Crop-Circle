import React, { useState, useEffect } from "react";
import "./styles/LoginSignup.css";
import CropCircleLogo from "../assets/illus/signin.png";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./components/modals/Modal";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    color: "",
    icon: "",
    title: "",
    message: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3001/register")
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      const token = response.data.token;
      setModalContent({
        color: "#28a745",
        icon: './src/assets/icons/modal-check.png',
        title: "Success",
        message: "Login successful"
      });
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000); // Hide the modal after 3 seconds
      setEmail("");
      setPassword("");
      fetchUsers();
      localStorage.setItem("token", token);
      setTimeout(() => {
        setModalVisible(false);
        navigate("/home");
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error.response.status === 401) {
        // Unauthorized - email or password is incorrect
        setModalContent({
          color: "#fcbf49",
          icon: './src/assets/icons/modal-warning.png',
          title: "Error",
          message: "Incorrect email or password. Please try again."
        });
      } else if (error.response.status === 403) {
        // Forbidden - no permission to log in as admin
        setModalContent({
          color: "#fcbf49",
          icon: './src/assets/icons/modal-warning.png',
          title: "Error",
          message: "You do not have permission to log in as an admin."
        });
      } else if (error.response.status === 404) {
        // Not Found - email not found in the database
        setModalContent({
          color: "#fcbf49",
          icon: './src/assets/icons/modal-warning.png',
          title: "Error",
          message: "Email not found. Please create an account."
        });
      } else {
        // Other errors
        setModalContent({
          color: "#fcbf49",
          icon: './src/assets/icons/modal-warning.png',
          title: "Error",
          message: "An unexpected error occurred. Please try again later."
        });
      }
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000); // Hide the modal after 3 seconds
    }
  };

  return (
    <div className="login-container login-specific">
      {modalVisible && (
        <Modal
          color={modalContent.color}
          icon={modalContent.icon}
          title={modalContent.title}
          message={modalContent.message}
        />
      )}
      <div className="login-wrapper">
        <form onSubmit={handleLogin}>
          <div className="header">
            <img
              src={CropCircleLogo}
              alt="Crop Circle"
              className="loginsignup-logo"
            ></img>
            <h1 className="welcome-loginsignup-text">Crop Circle</h1>
            <h3 className="subtext-loginsignup">Log In</h3>
          </div>

          <div className="input-loginsignup">
            <MdEmail className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="loginsignup-fields no-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-loginsignup">
            <RiLockPasswordFill className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="loginsignup-fields no-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="loginsignup-button">
            <img
              src="./src/assets/icons/log-in.png"
              alt="Login icon"
              style={{
                width: "15px",
                height: "15px",
                marginRight: "8px",
                filter: "invert(1) grayscale(1) brightness(10)",
              }}
            />
            Login
          </button>

          <div className="loginsignup-submit">
            <p>
              {" "}
              Don't have an account?{" "}
              <Link to="/signup" className="link-button">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import "./styles/LoginSignup.css";
import CropCircleLogo from "../assets/illus/signin.png";
import LoginIcon from "../assets/icons/log-in.png";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./components/modals/Modal";

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    color: '',
    icon: '',
    title: '',
    message: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
      fetchUsers();
  }, []);

  const fetchUsers = () => {
      axios.get('http://localhost:3001/register')
          .then((res) => {
              console.log(res.data);
          })
          .catch((error) => {
              console.log('Error fetching users:', error);
          });
  };

  const handleLogin = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.post('http://localhost:3001/admin/login', { email, password });
          const { token } = response.data;
          setModalContent({
            color: "#28a745",
            icon: './src/assets/icons/modal-check.png',
            title: "Success",
            message: "Login successful"
          });
          setModalVisible(true);
          setTimeout(() => setModalVisible(false), 3000); 
          setEmail('');
          setPassword('');
          fetchUsers();
          localStorage.setItem('token', token);
          navigate('/admin/home');
          window.location.reload();
      } catch (error) {
          let message;
          if (error.response.status === 401) {
              message = 'Incorrect email or password. Please try again.';
          } else if (error.response.status === 403) {
              message = 'You do not have permission to log in as an admin.';
          } else if (error.response.status === 404) {
              message = 'Email not found. Please create an account.';
          } else {
              message = 'Login Error';
              console.log('Login Error', error);
          }
          alert(message);
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
            />
            <h1 className="welcome-loginsignup-text">Crop Circle</h1>
            <h3 className="subtext-loginsignup">Admin Log In</h3>
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
              src={LoginIcon}
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

export default AdminLogin;

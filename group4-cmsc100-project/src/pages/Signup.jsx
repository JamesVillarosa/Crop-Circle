import React, { useState, useEffect } from "react";
import "./styles/LoginSignup.css";
import CropCircleLogo from "../assets/illus/signin.png";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./components/modals/Modal"

function Signup() {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    color: "",
    icon: "",
    title: "",
    message: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3001/register").then((res) => {
      console.log(res.data);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const submittedFname = event.target.elements.fname.value;
    const submittedLname = event.target.elements.lname.value;
    const submittedMname = event.target.elements.mname.value;
    const submittedEmail = event.target.elements.email.value;
    const submittedPassword = event.target.elements.password.value;
    const confirmPassword = event.target.elements.confirmPassword.value;

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let errors = {};

    if (
      submittedPassword !== confirmPassword &&
      !passwordPattern.test(submittedPassword)
    ) {
      errors.password = "Invalid Password and Passwords do not match.";
      setModalContent({
        color: "#fcbf49",
        icon: './src/assets/icons/modal-warning.png',
        title: "Error",
        message: "Invalid Password and Passwords do not match."
      });
      setModalVisible(true);
  setTimeout(() => setModalVisible(false), 3000); 
    } else if (submittedPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      setModalContent({
        color: "#fcbf49",
        icon: './src/assets/icons/modal-warning.png',
        title: "Error",
        message: "Passwords do not match."
      });
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000); 
    } else if (!passwordPattern.test(submittedPassword)) {
      errors.password =
        "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.";
      setModalContent({
        color: "#fcbf49",
        icon: './src/assets/icons/modal-warning.png',
        title: "Error",
        message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."
      });
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000); 
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      axios
        .post("http://localhost:3001/register", {
          fname: submittedFname,
          mname: submittedMname,
          lname: submittedLname,
          email: submittedEmail,
          password: submittedPassword,
        })
        .then(() => {
          setModalContent({
            color: "#28a745",
            icon: './src/assets/icons/modal-check.png',
            title: "Success",
            message: "Registration Successful"
          });
          setModalVisible(true);
          setTimeout(() => setModalVisible(false), 3000); 
          setEmail("");
          setFname("");
          setMname("");
          setLname("");
          setPassword("");
          fetchUsers();
          setTimeout(() => {
            setModalVisible(false);
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          console.log("Unable to register user:", error);
        });
    }
  };

  return (
    <div className="signup-container signup-specific">
      {modalVisible && (
        <Modal
          color={modalContent.color}
          icon={modalContent.icon}
          title={modalContent.title}
          message={modalContent.message}
        />
      )}
      <div className="signup-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="header">
            <img
              src={CropCircleLogo}
              alt="Crop Circle"
              className="loginsignup-logo"
            />
            <div className="welcome-loginsignup-text">Crop Circle</div>
            <div className="subtext-loginsignup">Sign Up</div>
          </div>
          <div className="inputs">
            <div className="input-loginsignup">
              <FaUser className="icon" />
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                required
                className="loginsignup-fields no-outline"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>
            <div className="input-loginsignup">
              <FaUser className="icon" />
              <input
                type="text"
                name="mname"
                placeholder="Middle Name"
                className="loginsignup-fields no-outline"
                value={mname}
                onChange={(e) => setMname(e.target.value)}
              />
            </div>
            <div className="input-loginsignup">
              <FaUser className="icon" />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                required
                className="loginsignup-fields no-outline"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
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
            <div className="input-loginsignup">
              <RiLockPasswordLine className="icon" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                className="loginsignup-fields no-outline"
              />
            </div>
          </div>
          <button type="submit" className="loginsignup-button">
            Sign Up
          </button>
          <div className="loginsignup-submit">
            Already have an account? <Link to="/login"> Login </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

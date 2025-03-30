import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import Footer from "../components/Footer";

const User = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ fname: '', lname: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ fname: '', lname: '', email: '' });

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
        setUserInfo(user);
        setUpdatedInfo(user);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.patch("http://localhost:3001/user", updatedInfo, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setUserInfo(response.data);
      setEditMode(false);
      alert("User information updated successfully.");
    } catch (error) {
      alert("Error updating user information:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="../../src/assets/icons/useracc-icon.png" alt="Illustration" className="users-image" />
      </header>

      <div className="userheader">
        <div className="user-header-item">
          <span className="userspage-title">{userInfo.fname} {userInfo.lname}</span>
          <button className="edit-button" onClick={handleEditToggle}>
            <img src="../../src/assets/icons/user-edit-icon.png" className="user-info-icon" alt="Edit User" />
          </button>
        </div>
        <span className="user-subtext">User</span>
      </div>

      <div className="form-look-container">
        <div className="input-group">
          <img src="../../src/assets/icons/user-name-icon.png" alt="Name Icon" className="user-info-icon" />
          <span className="text"></span>
          {editMode ? (
            <input
              type="text"
              name="fname"
              value={updatedInfo.fname}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userInfo.fname} {userInfo.lname}</span>
          )}
        </div>
        <div className="input-group">
          <img src="../../src/assets/icons/user-mail-icon.png" alt="Email Icon" className="user-info-icon" />
          <span className="text"></span>
          {editMode ? (
            <input
              type="text"
              name="email"
              value={updatedInfo.email}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userInfo.email}</span>
          )}
        </div>
      </div>

      <div className="signoutbtn">
        {editMode ? (
          <button onClick={handleSaveChanges}>Save Changes</button>
        ) : (
          <button onClick={handleSignOut}>Sign Out</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default User;

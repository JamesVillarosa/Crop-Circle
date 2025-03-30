import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/modals/Modal";
import "../../styles/UserModal.css";

const UserModal = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState({ fname: '', mname: '', lname: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ fname: '', mname: '', lname: '', email: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ color: "", icon: "", title: "", message: "" });
  const navigate = useNavigate();

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
      setModalContent({
        color: "#28a745",
        icon: './src/assets/icons/modal-check.png',
        title: "Success",
        message: "User information updated successfully."
      });
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    } catch (error) {
      setModalContent({
        color: "#dc3545",
        icon: './src/assets/icons/modal-warning.png',
        title: "Error",
        message: "Error updating user information: " + error.message
      });
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    onClose();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
        <div className="dropdown-arrow"></div>
        <div className="modal-content">
          <header className="modal-header">
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
              {editMode ? (
                <input
                  type="text"
                  name="fname"
                  value={updatedInfo.fname}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userInfo.fname}</span>
              )}
            </div>
            <div className="input-group">
              <img src="../../src/assets/icons/user-name-icon.png" alt="Name Icon" className="user-info-icon" />
              {editMode ? (
                <input
                  type="text"
                  name="mname"
                  value={updatedInfo.mname}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userInfo.mname}</span>
              )}
            </div>
            <div className="input-group">
              <img src="../../src/assets/icons/user-name-icon.png" alt="Name Icon" className="user-info-icon" />
              {editMode ? (
                <input
                  type="text"
                  name="lname"
                  value={updatedInfo.lname}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{userInfo.lname}</span>
              )}
            </div>
            <div className="input-group">
              <img src="../../src/assets/icons/user-mail-icon.png" alt="Email Icon" className="user-info-icon" />
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
        </div>
      </div>
      {modalVisible && (
        <Modal
          color={modalContent.color}
          icon={modalContent.icon}
          title={modalContent.title}
          message={modalContent.message}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
};

export default UserModal;

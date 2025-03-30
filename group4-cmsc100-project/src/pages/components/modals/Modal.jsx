import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/Modal.css";

const Modal = ({ color, icon, title, message, actions }) => {
  return (
    <div className="modal-container">
      <div className="popup-container" style={{ '--modal-background-color': color }}>
        <div className="icon-container">
          <img src={icon} alt="Alert icon" className="icon" />
        </div>
        <div className="text-container">
          <h3 className="title">{title}</h3>
          <p className="message">{message}</p>
        </div>
        <div className="modal-actions">
          {actions}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actions: PropTypes.node, 
};

export default Modal;

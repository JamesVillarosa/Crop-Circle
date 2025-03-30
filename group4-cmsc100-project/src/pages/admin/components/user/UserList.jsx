import React, { useState, useEffect } from "react";
import "../../styles/UserList.css";

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <h1 className="user-text">USERS</h1>
      <div className="userlist-header">
        <p className="userlist-text">No</p>
        <p className="userlist-text">Names</p>
        <p className="userlist-text userlist-email-text">Email</p>
      </div>
      <div className="users">
        {users.map((user, index) => (
          <div key={user._id} className="user">
            <div className="user-details">
              <div className="username">
                <p className="username-details username-index">{index + 1}</p>
                <p className="username-details username-name">
                  {user.fname} {user.mname} {user.lname}
                </p>
                <p className="username-details username-email">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
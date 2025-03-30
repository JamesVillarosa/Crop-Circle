import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";
import Footer from "../../../components/Footer"


function UserAccounts() {
  // State to store the fetched products
  const [user, setUser] = useState([]);

  // Function to fetch products from the database
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/users/show");
      // Update the users state with the fetched data
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="App" >
      <header className="App-header"></header>
      <main>
        <UserList users={user} />
      </main>
      <Footer />
    </div>
  );
}

export default UserAccounts;
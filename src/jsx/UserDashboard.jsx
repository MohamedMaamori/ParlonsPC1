import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "../components/grid";
import Sidebar from "../components/sidebar";
import "../style/userDashboard.css";

export const UserDashboard = (props) => {
  const [userName, setUserName] = useState("");

  // Function to fetch the user ID from the server
  const fetchUserName = () => {
    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/get_userinfo.php",
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.user_username) {
          setUserName(response.data.user_username);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle other errors here
      });
  };

  // Fetch the user ID when the component mounts
  useEffect(() => {
    fetchUserName();
  }, []);
  console.log(userName);
  return (
    <>
      <div>
        <div className="header">
          <h1 className="h1">Account</h1>
        </div>
        <div className="grid_cont">
          <Sidebar />
          <div>
            <h1>Hello {userName} </h1>
            <p>from your account you can manage your items</p>
            <Grid />
          </div>
        </div>
      </div>
    </>
  );
};

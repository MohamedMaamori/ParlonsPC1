import React, { useState, useEffect } from "react";
import axios from "axios";

export const Profile = (props) => {
  const [userId, setUserId] = useState("");

  // Function to fetch the user ID from the server
  const fetchUserId = () => {
    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/get_user_id.php",
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.user_id) {
          setUserId(response.data.user_id);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle other errors here
      });
  };

  // Fetch the user ID when the component mounts
  useEffect(() => {
    fetchUserId();
  }, []);
  console.log(userId);
  return (
    <>
      <div className="login_box">
        <h1>PROFILE PAGE</h1>
        {userId && <h1>{userId}</h1>}
      </div>
    </>
  );
};

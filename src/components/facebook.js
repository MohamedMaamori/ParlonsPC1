/* global FB */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";
const FacebookLoginButton = ({ onFacebookLogin, isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    setIsLoading(true);
    FB.login(
      (response) => {
        if (response.authResponse) {
          FB.api(
            "/me",
            { fields: "id,first_name,last_name,email,birthday" },
            (data) => {
              console.log("Logged in:", data);
              console.log("Logged in:", data.email);
              axios({
                method: "post",
                url: "http://localhost/php/myapp/php/login_facebook.php",
                data: {
                  email: data.email,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  userName: data.first_name + data.last_name,
                  facebookID: data.id, // Using Facebook ID as the password
                },
                withCredentials: true,
              })
                .then((response) => {
                  if (response.data.success) {
                    console.log(response.data.message);
                    console.log(response);
                    setTimeout(() => {
                      isAuthenticated();
                      onFacebookLogin(data.email);
                      setIsLoading(false);
                      console.log(response);
                      navigate("/UserDashboard");
                      window.location.reload();
                    }, 3000);
                  }
                })
                .catch((error) => {
                  console.log("error", error);
                });
            }
          );
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "email,user_birthday", auth_type: "rerequest" } // Specify the permissions you need
    );
  };
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("disable-pointer-events");
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.classList.remove("disable-pointer-events");
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [isLoading]);
  useEffect(() => {
    // Ensure the FB object is defined before using it
    if (typeof FB !== "undefined") {
      FB.init({
        appId: "YOUR_APP_ID", // Replace with your actual App ID
        cookie: true,
        xfbml: true,
        version: "v17.0", // Replace with your desired API version
      });

      FB.AppEvents.logPageView();
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <button className="signInWith-btns" onClick={handleFacebookLogin}>
          <Loader />
          <FontAwesomeIcon icon={faFacebookF} />
        </button>
      ) : (
        <button className="signInWith-btns" onClick={handleFacebookLogin}>
          <FontAwesomeIcon icon={faFacebookF} />
        </button>
      )}
    </div>
  );
};

export default FacebookLoginButton;

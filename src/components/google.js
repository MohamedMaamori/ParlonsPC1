import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoginSocialGoogle } from "reactjs-social-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";
const GoogleLoginButton = ({ onGoogleLogin, isAuthenticated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSuccess = (data) => {
    const email = data.email;
    const firstName = data.given_name;
    const lastName = data.family_name;
    const userName = data.name;
    const googleID = data.sub;

    axios({
      method: "post",
      url: "http://localhost/php/myapp/php/login_google.php",
      data: {
        email,
        firstName,
        lastName,
        userName,
        googleID,
      },
      withCredentials: true,
    })
      .then((response) => {
        setIsLoading(true);
        if (response.data.success) {
          console.log(response.data.message);
          setTimeout(() => {
            isAuthenticated();
            setIsLoading(false);
            navigate("/UserDashboard");
            window.location.reload();
          }, 3000);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <LoginSocialGoogle
          client_id="887120635552-uslhqgjtf2ur8omdb7tnt8jcc0tfjo49.apps.googleusercontent.com"
          scope="openid profile email"
          discoveryDocs="claims_supported"
          access_type="offline"
          onResolve={({ provider, data }) => {
            console.log(provider, data);
            onGoogleLogin(data.email); // Pass the email back to the parent component
            onSuccess(data);
          }}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <button className="signInWith-btns">
            <FontAwesomeIcon icon={faGoogle} />
          </button>
        </LoginSocialGoogle>
      )}
    </div>
  );
};

export default GoogleLoginButton;

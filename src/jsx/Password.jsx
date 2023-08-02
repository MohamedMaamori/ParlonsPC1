import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../style/password.css";
import usePasswordToggle from "../hooks/usePasswordToggle.js";

export const Password = (props) => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromLogin = queryParams.get("email") || "";

  const handleSubmit = function (e) {
    e.preventDefault();
    console.log(password, emailFromLogin);
    if (password.trim()) {
      // Send the password validation request to the authentication.php script
      axios({
        method: "post",
        url: "http://localhost/php/myapp/php/password.php",
        data: {
          email: emailFromLogin,
          password,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.valid) {
            // Password is correct, navigate to Home page or desired page
            console.log(response.data.message);

            props.onLogin(password);
            props.navFunction();
            navigate(
              `/?email=${encodeURIComponent(
                emailFromLogin
              )}&password=${encodeURIComponent(password)}`
            ); // Replace "/home" with your desired route
          } else {
            // Incorrect password
            setErrorMessage("Incorrect Password");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle other errors here
        });
    } else {
      setErrorMessage("Please enter your password.");
    }
  };
  const handleBackButtonClick = () => {
    // Navigate back to the Login page
    navigate("/Login");
  };
  return (
    <>
      <div className="container_login">
        <div className="login_box">
          <button className="back-btn" onClick={handleBackButtonClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="welcome_login">
            <img src="LOGOparlonNoBackground.png" alt="" />
          </div>
          <div className="welcome_text_login">
            <h2>Bonjour !</h2>
            <p>Connectez-vous pour découvrir toutes nos fonctionnalités</p>
          </div>
          <form className="login_form">
            <div className="relative">
              <input
                type={PasswordInputType}
                name="password"
                placeholder=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required="required"
                id="pass-input"
                className="input-cal input-base"
              />

              <label id="pass-label">Password</label>
              <span className="password-toggle-icon">{ToggleIcon}</span>
            </div>
            <div className="below_input">
              <input type="checkbox" name="rememberMe" id="" />
              <span>Rappelez-vous de moi</span>
              <a href="/App.js"> Mot de passe oublié</a>
            </div>

            {errorMessage && <p className="error_message">{errorMessage}</p>}
            <button className="login-btn" type="submit" onClick={handleSubmit}>
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

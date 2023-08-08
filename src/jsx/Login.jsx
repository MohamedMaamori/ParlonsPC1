import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faApple } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/login.css";
import GoogleLoginButton from "../components/google";
export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputEmailRef = useRef(null);
  const navigate = useNavigate();

  const handleGoogleLogin = (googleEmail) => {
    setEmail(googleEmail); // Update the email state
  };

  // console.log("authentiocated", props.authenticated);
  // if (props.authenticated) {
  //   navigate("/");
  // }
  // Handle submit button
  const handleSubmit = function (e) {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const inputEmail = inputEmailRef.current;
    inputEmail.style.border = "1px solid rgb(218, 214, 214)";

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      inputEmail.style.border = "2px solid red";
    } else if (!emailPattern.test(email)) {
      inputEmail.style.border = "2px solid red";
      setErrorMessage("Please enter a valid email address.");
    } else {
      // Send the login request to the authentication.php script to check email
      axios({
        method: "post",
        url: "http://localhost/php/myapp/php/email.php",
        data: {
          email,
        },
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.exists) {
            // Email exists, navigate to Password.jsx
            console.log(response.data.message);
            navigate(`/Password?email=${encodeURIComponent(email)}`);
          } else {
            // Email does not exist, navigate to Register.jsx
            console.log(response.data.message);
            navigate(`/Register?email=${encodeURIComponent(email)}`);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle other errors here
        });
    }
  };
  console.log(email);

  return (
    <>
      <div className="container_login">
        <div className="login_box">
          <div className="welcome_login">
            <img src="LOGOparlonNoBackground.png" alt="" />
          </div>
          <div className="welcome_text_login">
            <h2>Bonjour !</h2>
            <p>Connectez-vous pour découvrir toutes nos fonctionnalités</p>
          </div>
          <form onSubmit={handleSubmit} className="login_form">
            <div className="relative">
              <input
                ref={inputEmailRef}
                type="text"
                name="email"
                placeholder=""
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required="required"
                id="email-input"
                className="input-cal input-base"
              />
              <label id="email-label">Enter Your Email</label>
            </div>

            {errorMessage && <p className="error_message">{errorMessage}</p>}
            <button type="submit">Se Connecter</button>
          </form>

          <div className="login_form_bottom">
            <p>OU</p>
            <div className="signInWith">
              <a href="">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <GoogleLoginButton
                onGoogleLogin={handleGoogleLogin}
                isAuthenticated={props.isAuthenticated}
              />
              <a href="/Login">
                <FontAwesomeIcon icon={faApple} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

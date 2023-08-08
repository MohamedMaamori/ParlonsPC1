import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../style/register.css";
import "react-datepicker/dist/react-datepicker.css";
import usePasswordToggle from "../hooks/usePasswordToggle.js";
export const Register = (props) => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfPasswordInputType, ConfToggleIcon] = usePasswordToggle();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromLogin = queryParams.get("email") || "";
  const email = emailFromLogin;

  const [stage, setStage] = useState(1);

  const handleNext = () => {
    if (stage < 2) {
      setStage((prevStage) => prevStage + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (stage > 1) {
      setStage((prevStage) => prevStage - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`Email: ${email}`);
    // console.log(`firstname: ${firstName}`);
    // console.log(`lastname:${lastName}`);
    // console.log(`username:${userName}`);
    // console.log(`password:${password}`);

    // Validate the form data before submitting
    if (
      email.trim() &&
      password.trim() &&
      confPassword.trim() &&
      password === confPassword
    ) {
      // Prepare the form data to be sent to the server
      const formData = {
        email,
        firstName,
        lastName,
        userName,
        password,
      };
      // Send the registration request to the server using Axios
      axios({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: "http://localhost/php/myapp/php/register.php",
        data: formData, // Pass the formData as 'data' property
        withCredentials: true,
      })
        .then((response) => {
          console.log("Response:", response);
          props.onLogin(password);
          props.isAuthenticated();
          navigate("/");
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle registration errors here
        });
    } else {
      setErrorMessage("Please fill in all the fields correctly.");
    }
  };
  const handleBackButtonClick = () => {
    // Navigate back to the Login page
    navigate("/Login");
  };

  return (
    <>
      <div className="reg-container">
        <div className="reg-box">
          <button className="back-btn" onClick={handleBackButtonClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="reg-welcome">
            <img src="LOGOparlonNoBackground.png" alt="" />
          </div>

          <div className="reg-input-container">
            <h3>{emailFromLogin}</h3>
            {stage === 1 && (
              <div className="reg-input-firstpage">
                <div className="center">
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      placeholder=""
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-cal input-base reg-input"
                    />

                    <label className="reg-label">Prenom</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      placeholder=""
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-cal input-base reg-input"
                    />
                    <label className="reg-label">Nom</label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="userName"
                      value={userName}
                      placeholder=""
                      onChange={(e) => setUserName(e.target.value)}
                      className="input-cal input-base reg-input"
                    />
                    <label className="reg-label">Surnom</label>
                  </div>
                </div>

                <button className="next-btn" type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

            {/* Second page*/}
            {stage === 2 && (
              <div className="reg-input-thirdpage">
                <div className="relative">
                  <input
                    type={PasswordInputType}
                    name="password"
                    value={password}
                    placeholder=""
                    onChange={(event) => setPassword(event.target.value)}
                    required="required"
                    className="input-cal reg-input-base"
                    id="reg-pass-input"
                  />
                  <label id="reg-pass-label">Password</label>
                  <span className="password-toggle-icon">{ToggleIcon}</span>
                </div>
                <div className="relative">
                  <input
                    type={ConfPasswordInputType}
                    name="confPassword"
                    placeholder=""
                    value={confPassword}
                    onChange={(event) => setConfPassword(event.target.value)}
                    required="required"
                    id="reg-confpass-input"
                    className="input-cal reg-input-base"
                  />
                  <label id="reg-confpass-label">Confirm Password</label>
                  <span className="password-toggle-icon">{ConfToggleIcon}</span>
                </div>
                <div className="reg-btns">
                  <button type="button" onClick={handlePrevious}>
                    Previous
                  </button>
                  <button type="submit" onClick={handleSubmit}>
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>

          {errorMessage && <p className="error_message">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
};

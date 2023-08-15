import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faL } from "@fortawesome/free-solid-svg-icons";
import "../style/register.css";
import "react-datepicker/dist/react-datepicker.css";
import usePasswordToggle from "../hooks/usePasswordToggle.js";
import Loader from "../components/loader";

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
  const [verificationPage, setVerificationPage] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [stage, setStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (stage < 2) {
      setStage((prevStage) => prevStage + 1);
    } else {
      handleRegisterSubmit();
    }
  };

  const handlePrevious = () => {
    if (stage > 1) {
      setStage((prevStage) => prevStage - 1);
    }
  };
  const handleBackButtonClick = () => {
    // Navigate back to the Login page
    navigate("/Login");
  };

  const register = () => {
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
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle registration errors here
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Validate the form data before submitting
    if (
      email.trim() &&
      password.trim() &&
      confPassword.trim() &&
      password === confPassword
    ) {
      const formData = {
        email,
      };
      // Prepare the form data to be sent to the server
      // Send the registration request to the server using Axios
      axios({
        method: "POST",
        url: "http://localhost/php/myapp/php/send_verification_email.php",
        data: formData, // Pass the formData as 'data' property
        withCredentials: true,
      })
        .then((response) => {
          const jsonMatch = response.data.match(/\{.*\}/);
          if (jsonMatch) {
            const responseData = JSON.parse(jsonMatch[0]); // Parse the JSON response
            console.log("Response:", responseData.success);
            if (responseData.success) {
              setVerificationPage(true);
            }
          } else {
            console.error("Invalid JSON response:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle registration errors here
        });
    } else {
      setErrorMessage("Please fill in all the fields correctly.");
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    console.log(verificationCode);
    if (verificationCode.trim()) {
      axios({
        method: "POST",
        url: "http://localhost/php/myapp/php/verify.php",
        data: { verificationCode },
        withCredentials: true,
      })
        .then((response) => {
          console.log(response.data.verification);
          if (response.data.verification) {
            register();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigate("/UserDashboard");
            }, 2000);
          } else {
            setErrorMessage("Invalid verification code.");
          }
          // Handle verification success, navigate to a success page
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            // Suppress error for 400 status code
            return;
          }
          console.error("Error:", error);
          setErrorMessage("Invalid verification code.");
        });
    } else {
      setErrorMessage("Please enter the verification code.");
    }
  };
  const handleOtpInputChange = (index, value) => {
    const updatedVerificationCode = [...verificationCode];
    updatedVerificationCode[index] = value;

    // Update the state with the new array
    setVerificationCode(updatedVerificationCode);

    // Check if all inputs are filled, then join them into a string
    const verificationString = updatedVerificationCode.join("");
    if (verificationString.length === 4) {
      setVerificationCode(verificationString);
    }

    if (value.length === 1) {
      if (index < 3) {
        document.getElementById(`otp-input${index + 2}`).focus();
      }
    } else if (value.length === 0 && index > 0) {
      document.getElementById(`otp-input${index}`).focus();
    }
    console.log("Verification Code  ", verificationCode);
  };
  const handleOtpPaste = (e) => {
    const pastedValue = e.clipboardData.getData("text");
    const updatedVerificationCode = pastedValue.slice(0, 4);
    if (updatedVerificationCode.length === 4) {
      setVerificationCode(updatedVerificationCode);
    } else if (updatedVerificationCode.length < 4) {
      const updatedVerificationCode = pastedValue.slice(0, 4).split("");
      setVerificationCode(updatedVerificationCode);
    }
    console.log("Verification Code  ", verificationCode);
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
          {isLoading && (
            <div className="overlay">
              <Loader />
            </div>
          )}

          {!verificationPage ? (
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

                  <button
                    className="next-btn"
                    type="button"
                    onClick={handleNext}
                  >
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
                    <span className="password-toggle-icon">
                      {ConfToggleIcon}
                    </span>
                  </div>
                  <div className="reg-btns">
                    <button type="button" onClick={handlePrevious}>
                      Previous
                    </button>
                    <button type="submit" onClick={handleRegisterSubmit}>
                      Register
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form className="otp-Form" onSubmit={handleVerificationSubmit}>
              <span className="mainHeading">Enter OTP</span>
              <p className="otpSubheading">
                We have sent a verification code to your mobile number
              </p>
              <div className="otp-inputcontainer">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    required
                    maxLength="1"
                    type="text"
                    className="otp-input"
                    id={`otp-input${index + 1}`}
                    value={verificationCode[index]}
                    onChange={(e) =>
                      handleOtpInputChange(index, e.target.value)
                    }
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>
              {errorMessage && <p className="error_message">{errorMessage}</p>}
              <button className="verifyButton" type="submit">
                Verify
              </button>
              <p className="resendNote">
                Didn't receive the code?{" "}
                <button className="resendBtn" onClick={handleRegisterSubmit}>
                  Resend Code
                </button>
              </p>
            </form>
          )}

          {errorMessage && <p className="error_message">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
};

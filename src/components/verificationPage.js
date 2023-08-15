// This is just template for the verification page

import React, { useState } from "react";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// ... Import statements

export const Verify = () => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromLogin = queryParams.get("email") || "";
  const email = emailFromLogin;
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
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
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigate("/UserDashboard");
            }, 2000);
          }
          // Handle verification success, navigate to a success page
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("Invalid verification code.");
        });
    } else {
      setErrorMessage("Please enter the verification code.");
    }
  };
  const handleOtpInputChange = (index, value) => {
    // Create a new array to update the verificationCode
    const updatedVerificationCode = [...verificationCode];
    updatedVerificationCode[index] = value;

    // Update the state with the new array
    setVerificationCode(updatedVerificationCode);

    // Check if all inputs are filled, then join them into a string
    const verificationString = updatedVerificationCode.join("");
    if (verificationString.length === 4) {
      setVerificationCode(verificationString);
    }
  };
  return (
    <>
      <form className="otp-Form" onSubmit={handleSubmit}>
        <span className="mainHeading">Enter OTP</span>
        <p className="otpSubheading">
          We have sent a verification code to your mobile number
        </p>
        <div className="otp-inputcontainer">
          <input
            required
            maxLength="1"
            type="text"
            className="otp-input"
            id="otp-input1"
            value={verificationCode[0]}
            onChange={(e) => handleOtpInputChange(0, e.target.value)}
          />
          <input
            required
            maxLength="1"
            type="text"
            className="otp-input"
            id="otp-input2"
            value={verificationCode[1]}
            onChange={(e) => handleOtpInputChange(1, e.target.value)}
          />
          <input
            required
            maxLength="1"
            type="text"
            className="otp-input"
            id="otp-input3"
            value={verificationCode[2]}
            onChange={(e) => handleOtpInputChange(2, e.target.value)}
          />
          <input
            required
            maxLength="1"
            type="text"
            className="otp-input"
            id="otp-input4"
            value={verificationCode[3]}
            onChange={(e) => handleOtpInputChange(3, e.target.value)}
          />
        </div>
        {errorMessage && <p className="error_message">{errorMessage}</p>}
        <button className="verifyButton" type="submit">
          Verify
        </button>
        <p className="resendNote">
          Didn't receive the code?{" "}
          <button className="resendBtn" onClick={hadnleRegisterSubmit}>
            Resend Code
          </button>
        </p>
      </form>
    </>
  );
};

// ... Export statement

export default Verify;

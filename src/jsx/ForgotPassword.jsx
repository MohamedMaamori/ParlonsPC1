import React, { useState, useEffect } from "react";
import axios from "axios";
import SetPassword from "../components/setPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export const ForgotPassword = (props) => {
  const [verificationPage, setVerificationPage] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleBackButtonClick = () => {
    // Navigate back to the Login page
    navigate("/Password");
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
  const handleResendbutton = () => {
    axios({
      method: "POST",
      url: "http://localhost/php/myapp/php/send_verification_email.php",
      withCredentials: true,
    })
      .then((response) => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle registration errors here
      });
  };
  useEffect(() => {
    handleResendbutton();
  }, []);
  const handleVerification = (e) => {
    e.preventDefault();
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
            setVerificationPage(false);
          }, 2000);
        } else {
          setErrorMessage("Wrong Verification code");
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
  };
  return (
    <>
      <div className="container_login">
        <div className="login_box">
          {isLoading && <Loader />}
          <button className="back-btn" onClick={handleBackButtonClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className="welcome_login">
            <img src="LOGOparlonNoBackground.png" alt="" />
          </div>
          {verificationPage ? (
            <form className="otp-Form" onSubmit={handleVerification}>
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
                <button className="resendBtn" onClick={handleResendbutton}>
                  Resend Code
                </button>
              </p>
            </form>
          ) : (
            <SetPassword />
          )}
        </div>
      </div>
    </>
  );
};

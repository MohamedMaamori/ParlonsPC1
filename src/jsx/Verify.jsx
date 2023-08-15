import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// ... Import statements

export const Verify = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromLogin = queryParams.get("email") || "";
  const email = emailFromLogin;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (verificationCode.trim()) {
      axios({
        method: "POST",
        url: "http://localhost/php/myapp/php/verify.php",
        data: { verificationCode, email },
        withCredentials: true,
      })
        .then((response) => {
          console.log("Response:", response);
          // Handle verification success, navigate to a success page
          navigate("/UserDashboard");
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("Invalid verification code.");
        });
    } else {
      setErrorMessage("Please enter the verification code.");
    }
  };

  return (
    <>
      <div className="verify-container">
        <div className="verify-box">
          <h2>Verify Your Email</h2>
          <p>Check your email for the verification code.</p>
          <form onSubmit={handleSubmit} className="verify-form">
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            {errorMessage && <p className="error_message">{errorMessage}</p>}
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
    </>
  );
};

// ... Export statement

export default Verify;

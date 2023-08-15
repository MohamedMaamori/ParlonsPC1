import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import usePasswordToggle from "../hooks/usePasswordToggle.js";

// ... Import statements

export const SetPassword = () => {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfPasswordInputType, ConfToggleIcon] = usePasswordToggle();
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [verificationPage, setVerificationPage] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim() && confPassword.trim() && password === confPassword) {
      const formData = {
        password,
      };
      axios({
        method: "POST",
        url: "http://localhost/php/myapp/php/change_password.php",
        data: formData, // Pass the formData as 'data' property
        withCredentials: true,
      }).then((response) => {
        alert("successfully changed the password");
        navigate("/UserDashboard");
      });
    }
  };

  return (
    <>
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
          <button type="submit" onClick={handleSubmit}>
            Change the password
          </button>
        </div>
      </div>
    </>
  );
};

// ... Export statement

export default SetPassword;

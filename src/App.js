import React, { useState, useEffect } from "react";
import "./style/App.css";
import "./Fontawesome";
import { Login } from "./jsx/Login";
import { Register } from "./jsx/Register";
import { Home } from "./jsx/Homepage"; // Import the Home component
import { UserDashboard } from "./jsx/UserDashboard"; // Import the Home component
import { AdminDashboard } from "./jsx/AdminDashboard"; // Import the Home component
import { TechnicianDashboard } from "./jsx/TechnicianDashboard"; // Import the Home component
import Nav from "./components/navbar";
import { Password } from "./jsx/Password"; // Import the Home component
import { Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  const [password, setPassword] = useState(""); // State to hold the password
  const [email, setEmail] = useState(""); // State to hold the password
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [tech, setTech] = useState(false);
  const isAuthenticated = function () {
    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/check_session.php",
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.authenticated) {
          console.log(response.data.message);
          // Check for "authenticated" => true directly in response data
          setAuthenticated(true);
          if (response.data.message === "admin") {
            setAdmin(true);
          } else if (response.data.message === "technician") {
            setTech(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    isAuthenticated();
  }, [password, email]);
  const handlePass = (enteredPassword) => {
    setPassword(enteredPassword);
    console.log(password);
    // Optionally, you can perform other logic related to login, if needed.
  };
  const handleEmail = (enteredEmail) => {
    setEmail(enteredEmail);
    console.log(email);
    // Optionally, you can perform other logic related to login, if needed.
  };

  return (
    <>
      <Nav authenticated={authenticated} admin={admin} tech={tech} />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Login"
            element={
              <Login onLogin={handleEmail} isAuthenticated={isAuthenticated} />
            }
          />

          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route
            path="/Password"
            element={
              <Password
                onLogin={handlePass}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route
            path="/TechnicianDashboard"
            element={<TechnicianDashboard />}
          />
          <Route
            path="/Register"
            element={
              <Register
                onLogin={handlePass}
                isAuthenticated={isAuthenticated}
              />
            }
          />
        </Routes>
      </div>
      <footer className="login_footer">
        <span>Footer</span>
        <p>Footer</p>
        <p>Footer</p>
        <p>Footer</p>
        <p>Footer</p>
        <p>Footer</p>
      </footer>
    </>
  );
}

export default App;

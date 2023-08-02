import React, { useState, useEffect } from "react";
import "./style/App.css";
import "./Fontawesome";
import { Login } from "./jsx/Login";
import { Register } from "./jsx/Register";
import { Home } from "./jsx/Homepage"; // Import the Home component
import { Profile } from "./jsx/Profile"; // Import the Home component
import { Password } from "./jsx/Password"; // Import the Home component
import { Link, Route, Routes } from "react-router-dom";
import axios from "axios";

function App() {
  const [password, setPassword] = useState(""); // State to hold the password
  const [email, setEmail] = useState(""); // State to hold the password
  const [authenticated, setAuthenticated] = useState("");

  const isAuthenticated = function () {
    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/check_session.php",
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.authenticated) {
          // Check for "authenticated" => true directly in response data
          setAuthenticated(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
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
  const logOut = function () {
    // Clear local storage (if needed)
    localStorage.clear();

    // Make the logout API request (if needed)
    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/logout.php",
      withCredentials: true,
    })
      .then((response) => {
        alert("You have been logged out");
        // Redirect the user to the login page after successful logout
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  function nav() {
    isAuthenticated();
    if (authenticated) {
      return (
        <>
          <nav className="login_nav">
            <Link to="/">
              <img id="nav_img" src="LOGOparlonNoBackground.png" alt="" />
            </Link>

            <div className="nav_btn">
              <button>Pricing</button>
              <button>Pricing</button>
              <button>
                <Link to="/Profile">Profile</Link>
              </button>
              <button onClick={logOut}>logout</button>
            </div>
          </nav>
        </>
      );
    } else {
      return (
        <>
          <nav className="login_nav">
            <Link to="/">
              <img id="nav_img" src="LOGOparlonNoBackground.png" alt="" />
            </Link>

            <div className="nav_btn">
              <button>Pricing</button>
              <button>Pricing</button>
              <button>
                <Link to="/login">Sign In</Link>
              </button>
            </div>
          </nav>
        </>
      );
    }
  }

  return (
    <>
      {nav()}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Login"
            element={
              <Login onLogin={handleEmail} authenticated={authenticated} />
            }
          />
          <Route path="/Profile" element={<Profile />} />
          <Route
            path="/Password"
            element={<Password onLogin={handlePass} navFunction={nav} />}
          />
          <Route
            path="/Register"
            element={<Register onLogin={handlePass} navFunction={nav} />}
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

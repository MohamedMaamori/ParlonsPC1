/* global FB */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Navbar TO be Fixed
function Nav({ authenticated, admin, tech }) {
  const [isAdmin, setAdmin] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isTech, setTech] = useState(false);
  useEffect(() => {
    setAdmin(admin);
    setAuthenticated(authenticated);
    setTech(tech);
  }, [authenticated, admin, tech]);

  const handleLogout = function () {
    localStorage.clear();

    axios({
      method: "GET",
      url: "http://localhost/php/myapp/php/logout.php",
      withCredentials: true,
    })
      .then((response) => {
        FB.logout();
        alert("You have been logged out");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <>
      {isAuthenticated && isTech ? (
        <nav className="login_nav">
          <Link to="/">
            <img id="nav_img" src="LOGOparlonNoBackground.png" alt="" />
          </Link>

          <div className="nav_btn">
            <button>Help</button>
            <button>Pricing</button>
            <button>
              <Link to="/TechnicianDashboard">Dashboard</Link>
            </button>
            <button onClick={handleLogout}>logout</button>
          </div>
        </nav>
      ) : isAuthenticated && isAdmin ? (
        <nav className="login_nav">
          <Link to="/">
            <img id="nav_img" src="LOGOparlonNoBackground.png" alt="" />
          </Link>

          <div className="nav_btn">
            <button>Help</button>
            <button>Pricing</button>
            <button>
              <Link to="/AdminDashboard">Dashboard</Link>
            </button>
            <button onClick={handleLogout}>logout</button>
          </div>
        </nav>
      ) : isAuthenticated && !isAdmin ? (
        <nav className="login_nav">
          <Link to="/">
            <img id="nav_img" src="LOGOparlonNoBackground.png" alt="" />
          </Link>

          <div className="nav_btn">
            <button>Help</button>
            <button>Pricing</button>
            <button>
              <Link to="/UserDashboard">Profile</Link>
            </button>
            <button onClick={handleLogout}>logout</button>
          </div>
        </nav>
      ) : (
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
      )}
    </>
  );
}

export default Nav;

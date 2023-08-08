import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "../components/grid";
import Sidebar from "../components/sidebar";
import "../style/userDashboard.css";

export const UserDashboard = (props) => {
  return (
    <>
      <div>
        <div className="header">
          <h1 className="h1">Account</h1>
        </div>
        <div className="grid_cont">
          <Sidebar />
          <div>
            <p>Hello user(not user? log out)</p>
            <p>from your account you can manage your items</p>
            <Grid />
          </div>
        </div>
      </div>
    </>
  );
};

import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <div>
      <nav>
        <img
          style={{ height: "33px", width: "33px" }}
          src="management.png"
          alt="error"
        />
        <h3 style={{ position: "relative", left: "-510px" }}>
          <Link to="/">Land Measurement</Link>
        </h3>
        <ul>
          <li>
            <Link to="/checkLand">Land</Link>
          </li>
          <li>
            <Link to="/validation">User</Link>
          </li>
          <li>
            <Link to="/map">Inspector</Link>
          </li>
          <li>
            <Link to="/adminInterface">Admin</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

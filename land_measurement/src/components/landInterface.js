import React from "react";
import { Outlet, Link } from "react-router-dom";

function LandInterface() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/checkLand">Check Land</Link>
          </li>
          <li>
            <Link to="/checkPreviousOwner">Check previous Owner</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default LandInterface;

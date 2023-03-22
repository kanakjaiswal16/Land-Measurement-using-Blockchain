import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

function AdminInterface({ contract, provider, account }) {
  const [Admin, setAdmin] = useState(false);

  async function checkAdmin() {
    try {
      const t = await contract.Owner();
      console.log(t);
      setAdmin(t);
    } catch (error) {
      if (error.message.includes("Only owner has Access")) {
        window.alert("Access Denied");
      }
    }
  }
  useEffect(() => {
    console.log("useEffect called");
    checkAdmin();
  }, []);

  return (
    <>
      {Admin === true && (
        <>
          <nav>
            <ul>
              <li>
                <Link to="/verifyInspector">Add Inspector</Link>
              </li>
              <li>
                <Link to="/removeInspector">Remove Inspector</Link>
              </li>
            </ul>
          </nav>
          <Outlet />
        </>
      )}
    </>
  );
}

export default AdminInterface;

/* {Admin !== true && <Link to="/">Home</Link>} */

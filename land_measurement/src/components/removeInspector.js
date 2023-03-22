import React, { useState } from "react";

function RemoveInspector({ contract, provider, account }) {
  const [address, setAddress] = useState("");

  function handleInputChange(event) {
    const input = event.target.value;
    setAddress(input);
  }

  async function removeInspector() {
    try {
      await contract.removeInspector(address);
    } catch (error) {
      if (error.message.includes("Address is not assigned as Inspector")) {
        window.alert("Address is not assigned as Inspector");
      }
    }
  }

  return (
    <>
      <label>Inspector Address :</label>
      <input type="text" value={address} onChange={handleInputChange} />
      <button onClick={removeInspector}>Remove</button>
    </>
  );
}

export default RemoveInspector;

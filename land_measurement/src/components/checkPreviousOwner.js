import React, { useState } from "react";

function CheckPreviousOwner({ contract, provider, account }) {
  const [ownerList, setOwnerList] = useState("");

  async function fetchOwnerList() {
    try {
      const list = await contract.CheckPreviousOwner(ownerList);
      console.log(list);
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleInputChange(event) {
    const input = event.target.value;
    setOwnerList(input);
  }
  return (
    <div>
      <label>Land ID: </label>
      <input type="text" value={ownerList} onChange={handleInputChange} />
      <button onClick={fetchOwnerList}>Fetch</button>
    </div>
  );
}

export default CheckPreviousOwner;

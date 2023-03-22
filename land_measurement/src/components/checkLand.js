import React, { useState } from "react";
import "./checkLand.css";

function CheckLand({ contract, provider, account }) {
  const [landID, setLandID] = useState("");
  const [recordT, setRecordsT] = useState(null);
  const [recordCoordinates, SetrecordCoordinates] = useState(null);
  const [recordInspector, SetrecordInspector] = useState(null);
  const [recordOwner, SetrecordOwner] = useState(null);

  function ConvertDate(a) {
    const epochTime = a;
    const date = new Date(epochTime * 1000);
    const dateString = date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    });
    setRecordsT(dateString);
  }

  function handleinputChange(event) {
    const input = event.target.value;
    setLandID(input);
  }

  async function CheckLandRecords() {
    try {
      let records = await contract.FetchLandRecords(landID);
      SetrecordCoordinates(records.coordinates);
      SetrecordInspector(records.LastInspector);
      SetrecordOwner(records.CurrentOwner);
      setRecordsT(() => ConvertDate(records.timestamp));
      if (
        records.LastInspector ===
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        alert("Land ID doesn't exist");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const isLandIDEmpty = landID.trim() === "";
  return (
    <div className="check-land-container">
      <label htmlFor="land-id">Enter Land ID:</label>
      <input
        id="land-id"
        className="check-land-input"
        type="number"
        value={landID}
        onChange={handleinputChange}
      />
      {recordT !== null &&
        recordT !== "1/1/1970, 5:30:00 am IST" &&
        recordCoordinates !== null &&
        recordInspector !== null &&
        recordOwner !== null && (
          <div className="check-land-results">
            <p>
              <span>Coordinates:</span> {recordCoordinates}
            </p>
            <p>
              <span>Owner:</span> {recordOwner}
            </p>
            <p>
              <span>Inspector:</span> {recordInspector}
            </p>
            <p>
              <span>Date:</span> {recordT}
            </p>
          </div>
        )}
      <button
        disabled={isLandIDEmpty}
        className="check-land-button"
        onClick={CheckLandRecords}
      >
        Check
      </button>
    </div>
  );
}

export default CheckLand;

import React, { useState } from "react";
import "./checkLand.css";

function CheckLand({ contract, provider, account }) {
  const [landID, setLandID] = useState("");
  const [recordT, setRecordsT] = useState(null);
  const [recordCoordinates, SetrecordCoordinates] = useState(null);
  const [recordInspector, SetrecordInspector] = useState(null);
  const [recordOwner, SetrecordOwner] = useState(null);
  const [output, setOutput] = useState("");
  const [prevButton, setPrevButton] = useState(false);

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
      setPrevButton(false);
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
      alert("Land ID doesn't exist");
    }
  }

  async function CheckPreviousOwner() {
    try {
      const result = await contract.CheckPreviousOwner(landID);
      setPrevButton(true);
      let newOutput = "";
      result.forEach(function (element) {
        newOutput += element + "\n";
      });
      setOutput(newOutput);
      if (newOutput === "") {
        alert("LandID doesn't exist");
      }
    } catch (error) {
      alert("LandID doesn't exist");
    }
  }

  async function CheckPreviousInspector() {
    try {
      const result = await contract.CheckPreviousInspector(landID);
      setPrevButton(true);
      let newOutput = "";
      result.forEach(function (element) {
        newOutput += element + "\n";
      });
      setOutput(newOutput);
      if (newOutput === "") {
        alert("LandID doesn't exist");
      }
    } catch (error) {
      alert("LandID doesn't exist");
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
        recordOwner !== null &&
        prevButton === false && (
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

      {prevButton === true && output !== "" && (
        <div className="check-land-results">
          <pre>{output}</pre>
        </div>
      )}
      <button
        disabled={isLandIDEmpty}
        className="check-land-button"
        onClick={CheckLandRecords}
      >
        Check
      </button>

      <button
        disabled={isLandIDEmpty}
        className="check-land-button"
        onClick={CheckPreviousOwner}
      >
        Owner History
      </button>

      <button
        disabled={isLandIDEmpty}
        className="check-land-button"
        onClick={CheckPreviousInspector}
      >
        Inspector History
      </button>
    </div>
  );
}

export default CheckLand;

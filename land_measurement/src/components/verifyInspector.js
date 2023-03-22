import React, { useState } from "react";

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function VerifyInspector({ contract, provider, account }) {
  const [address, setAddress] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isValidAadhaar, setIsValidAadhaar] = useState(null);

  function generate(array) {
    let c = 0;
    const invertedArray = array.reverse();

    for (let i = 0; i < invertedArray.length; i++) {
      c = d[c][p[(i + 1) % 8][invertedArray[i]]];
    }

    return inv[c];
  }

  function validateAadhaar(aadhaarString) {
    if (aadhaarString.length !== 12) {
      return new Error("Aadhaar numbers should be 12 digits in length");
    }

    if (aadhaarString.match(/[^$,.\d]/)) {
      return new Error("Aadhaar numbers must contain only numbers");
    }

    var aadhaarArray = aadhaarString.split("");
    var toCheckChecksum = aadhaarArray.pop();
    // console.log(toCheckChecksum);
    var generatedChecksum = generate(aadhaarArray);
    // console.log(generatedChecksum);
    if (generatedChecksum.toString() === toCheckChecksum) {
      return true;
    } else {
      return false;
    }
  }

  function handleAddressChange(event) {
    const input = event.target.value;
    setAddress(input);
  }

  function handleAadhaarChange(event) {
    const input = event.target.value;
    setAadhaarNumber(input);
    if (input.length === 12) {
      setIsValidAadhaar(validateAadhaar(input));
    } else {
      setIsValidAadhaar(null);
    }
  }

  async function addInspector() {
    try {
      await contract.addInspector(address, aadhaarNumber);
    } catch (error) {
      if (error.message.includes("Only owner has Access")) {
        window.alert("Access Denied");
      }
      if (error.message.includes("You have already assigned it as Inspector")) {
        window.alert("Inspector already Assigned");
      }
      if (error.message.includes("Owner can't be inspector")) {
        window.alert("Owner can't be inspector");
      }
    }
  }

  return (
    <>
      <label>Inspector Address: </label>
      <input type="text" value={address} onChange={handleAddressChange} />
      <label>Inspector Aadhaar Number: </label>
      <input type="text" value={aadhaarNumber} onChange={handleAadhaarChange} />
      {isValidAadhaar === true && (
        <p style={{ color: "green" }}>Aadhaar number is valid</p>
      )}
      {isValidAadhaar === false && (
        <p style={{ color: "red" }}>Aadhaar number is invalid</p>
      )}
      <button onClick={addInspector}>Add Inspector</button>
    </>
  );
}

export default VerifyInspector;

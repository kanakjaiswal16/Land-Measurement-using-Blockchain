import React, { useState } from "react";
import "./validation.css";

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

function Validation({ contract, provider, account }) {
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

  function handleInputChange(event) {
    const input = event.target.value;
    setAadhaarNumber(input);
    if (input.length === 12) {
      setIsValidAadhaar(validateAadhaar(input));
    } else {
      setIsValidAadhaar(null);
    }
  }

  async function LinkAadhaar() {
    console.log("called");
    try {
      await contract.linkAadhar(aadhaarNumber);
      // console.log("LINKED");
    } catch (error) {
      if (
        error.message.includes("This aadhar number has already been linked")
      ) {
        window.alert("This Aadhaar number has already been linked");
      }

      if (
        error.message.includes("One Address can only be link to one Aadhar")
      ) {
        window.alert("One Address can only be link to one Aadhar");
      }
    }
  }

  //   console.log(aadhaar);

  return (
    <div>
      <label style={{ color: "black" }}>
        Enter your Aadhaar number:
        <input type="text" value={aadhaarNumber} onChange={handleInputChange} />
      </label>

      {isValidAadhaar === true && (
        <p style={{ color: "green" }}>Aadhaar number is valid</p>
      )}
      {isValidAadhaar === false && (
        <p style={{ color: "red" }}>Aadhaar number is invalid</p>
      )}
      {isValidAadhaar instanceof Error && <p>{isValidAadhaar.message}</p>}
      <p className={isValidAadhaar === true ? "valid" : "invalid"}>
        Aadhaar number: {aadhaarNumber}
      </p>

      <button
        disabled={isValidAadhaar !== true}
        className="Link"
        onClick={LinkAadhaar}
      >
        Link
      </button>
    </div>
  );
}

export default Validation;

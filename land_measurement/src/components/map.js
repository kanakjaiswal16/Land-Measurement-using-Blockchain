import React, { useState, useEffect } from "react";
import "./map.css";
import jsPDF from "jspdf";

export default function Geomap({ contract, provider, account }) {
  const [map, setMap] = useState(null);
  const [landOnMap, setLandOnMap] = useState(null);
  const [landLocationsStrings, setLandLocationsStrings] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [isInspector, setIsInspector] = useState(false);
  const [receipt, setReciept] = useState(false);

  async function checkInspector() {
    try {
      const value = await contract.CheckInspector();

      setIsInspector(value);
      if (value === false) {
        alert("Access Denied");
        return false;
      }
      return true;
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const checkAndLoadMap = async () => {
      const a = await checkInspector();
      console.log(a);
      if (a === true) {
        loadMap();
      }
    };

    checkAndLoadMap();
  }, []);

  function loadMap() {
    const mapOptions = {
      center: new window.google.maps.LatLng(21.1458, 79.0882),
      zoom: 12,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };
    const mapInstance = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );
    setMap(mapInstance);
  }

  function generateInputFields() {
    setReciept(false);
    const numVertices = parseInt(document.getElementById("numVertices").value);
    const inputFieldsDiv = document.getElementById("inputFields");
    inputFieldsDiv.innerHTML = "";
    if (numVertices > 2 && numVertices < 11) {
      for (let i = 1; i <= numVertices; i++) {
        const label = document.createElement("label");
        label.textContent = "Vertex " + i + ":";
        inputFieldsDiv.appendChild(label);

        const latInput = document.createElement("input");
        latInput.type = "text";
        latInput.id = "lat" + i;
        latInput.placeholder = "Latitude";
        inputFieldsDiv.appendChild(latInput);

        const lngInput = document.createElement("input");
        lngInput.type = "text";
        lngInput.id = "lng" + i;
        lngInput.placeholder = "Longitude";
        inputFieldsDiv.appendChild(lngInput);

        const br = document.createElement("br");
        inputFieldsDiv.appendChild(br);
      }
    } else {
      alert("Enter Value between 3 and 10");
    }
  }

  function drawPolygon() {
    const numVertices = parseInt(document.getElementById("numVertices").value);
    const landLocations = [];

    for (let i = 1; i <= numVertices; i++) {
      const lat = parseFloat(document.getElementById("lat" + i).value);
      const lng = parseFloat(document.getElementById("lng" + i).value);
      landLocations.push(new window.google.maps.LatLng(lat, lng));
    }

    const landOnMapInstance = new window.google.maps.Polygon({
      path: landLocations,
      strokeColor: "#0000FF",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: "#0000FF",
      fillOpacity: 0.4,
    });

    landOnMapInstance.setMap(map);

    landLocations.sort(function (a, b) {
      if (a.lat() === b.lat()) {
        return a.lng() - b.lng();
      } else {
        return a.lat() - b.lat();
      }
    });

    const landLocationsStrings = landLocations.map(function (latLng) {
      return latLng.toString();
    });

    setLandOnMap(landOnMapInstance);
    var str = landLocationsStrings.join(",");
    setLandLocationsStrings(str);
  }
  function handleInputChange(event) {
    const input = event.target.value;
    setOwnerAddress(input);
  }

  async function generateReciept() {
    const result = await contract.FetchLandRecordsString(landLocationsStrings);
    const landID = result.land_id;
    const coordinates = result.coordinates;
    const Inspector = result.LastInspector;
    const Owner = result.CurrentOwner;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Proof of Land Measurement", 80, 20);
    doc.setFontSize(12);
    doc.text(`Land ID: ${landID}`, 20, 40);
    doc.text(`Coordinates: ${coordinates}`, 20, 50);
    doc.text(`Inspector: ${Inspector}`, 20, 60);
    doc.text(`Owner: ${Owner}`, 20, 70);

    // Save PDF receipt
    doc.save("receipt.pdf");
  }

  async function AddLandRecords() {
    try {
      await contract.MeasureLand(landLocationsStrings, ownerAddress);
      setReciept(true);
    } catch (error) {
      if (error.message.includes("You are already owner")) {
        window.alert("Measurement has already been done");
      }
      if (error.message.includes("Aadhar must be linked")) {
        window.alert("Owner must link Aadhaar to measure the land ");
      }
    }
  }

  return (
    <>
      {isInspector === true && (
        <div>
          <div>
            <label>Number of vertices:</label>
            <input type="number" id="numVertices" min="3" max="10" />
            <button onClick={generateInputFields}>Generate Fields</button>
          </div>
          <div id="inputFields"></div>
          <button onClick={drawPolygon}>Draw Polygon</button>
          <br />
          <br />
          <div>
            <label>Area:</label>
            <span>
              {landOnMap
                ? window.google.maps.geometry.spherical
                    .computeArea(landOnMap.getPath())
                    .toFixed(2) + " sq. meters"
                : ""}
            </span>
          </div>
          <div>
            <label>Vertices:</label>
            <span>{landLocationsStrings}</span>
          </div>

          <div>
            <label>Owner: </label>
            <input
              type="text"
              id="OwnerAddress"
              value={ownerAddress}
              onChange={handleInputChange}
            />
          </div>

          <button onClick={AddLandRecords}>ADD LAND</button>
          <button disabled={!receipt} onClick={generateReciept}>
            Generate Reciept
          </button>
          <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </div>
      )}
    </>
  );
}

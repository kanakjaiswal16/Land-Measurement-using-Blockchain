import Land from "./artifacts/contracts/Land.sol/Land.json";
import { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import Validation from "./components/validation";
import Geomap from "./components/map";
import Navbar from "./components/navbar";
import AdminInterface from "./components/adminInterface";
import VerifyInspector from "./components/verifyInspector";
import CheckLand from "./components/checkLand";
import RemoveInspector from "./components/removeInspector";
import LandInterface from "./components/landInterface";
import CheckPreviousOwner from "./components/checkPreviousOwner";
import { Routes, Route } from "react-router-dom";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const loadProvider = async () => {
        //To change account as changed on metamask without reloading
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, Land.abi, signer);

        setContract(contract);
        setProvider(provider);
      };
      provider && loadProvider();
    } else {
      alert("INSTALL METAMASK");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route
          path="/validation"
          element={
            <Validation
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />
        <Route
          path="/checkPreviousOwner"
          element={
            <CheckPreviousOwner
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />
        <Route
          path="/map"
          element={
            <Geomap contract={contract} provider={provider} account={account} />
          }
        />
        <Route
          path="/adminInterface"
          element={
            <AdminInterface
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />
        <Route
          path="/checkLand"
          element={
            <CheckLand
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />
        <Route
          path="/verifyInspector"
          element={
            <VerifyInspector
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />

        <Route
          path="/removeInspector"
          element={
            <RemoveInspector
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />

        <Route
          path="/landInterface"
          element={
            <LandInterface
              contract={contract}
              provider={provider}
              account={account}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;

//Goerli final address:0x327d1774ff47b8fA6Cb8E928f098a35066d03d3B

import Web3 from "web3";

let web3;
 
// Windows only loads on the browser, so it cannot be executed on a server

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/96c4a0abea8d43f3b62b1b6293cab035"
  );
  web3 = new Web3(provider);
}
 
export default web3;
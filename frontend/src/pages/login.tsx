import { useState, ChangeEvent, FormEvent, useLayoutEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { axiosI } from "../../api/axios";

const MetaMaskLoginPage = () => {
  const [address, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useLayoutEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    const savedIsConnected = localStorage.getItem("isConnected");

    if (savedAddress) {
      setWalletAddress(savedAddress);
    }

    if (savedIsConnected === "true") {
      setIsConnected(true);
    }
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const message = `Sign this message to verify your identity. Timestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const response = await axiosI.post("/api/auth/metamask", {
        address,
        message,
        signature,
      });

      if (response.data.success) {
        if (
          response.data.vc?.credentialSubject?.name &&
          response.data.vc?.credentialSubject?.email
        ) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.vc.credentialSubject)
          );
          alert("User information successfully saved!");
          window.location.replace("/");
        }
        setIsConnected(true);
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("walletAddress", address);
        localStorage.setItem("isConnected", "true");
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      // console.error("MetaMask login failed:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const completeUserData = {
      ...userData,
      address,
    };
    try {
      const response = await axiosI.post(
        "/additionaluserinfo",
        completeUserData
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        alert("User information successfully saved!");
        window.location.replace("/");
      } else {
        alert("Failed to save user data.");
      }
    } catch (error) {
      // console.error("Error submitting user data:", error);
    }
  };

  return (
    <section className="flex justify-between items-center w-full p-4">
      <Link to="/">
        <img src="./images/logo.svg" />
      </Link>

      {!isConnected ? (
        <button onClick={connectMetaMask} className="h-fit  ">
          Login
        </button>
      ) : (
        <div>
          {isConnected && !user ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h3 className="text-xl font-semibold text-gray-200 text-center mb-4">
                Enter Your Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 bg-[#0d294179] text-gray-200 border border-gray-600 rounded-lg focus:ring-1 focus:ring-[#747bff] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2.5 bg-[#0d294179] text-gray-200 border border-gray-600 rounded-lg focus:ring-1 focus:ring-[#747bff] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default MetaMaskLoginPage;

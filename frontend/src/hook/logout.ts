import { useNavigate } from "react-router-dom";
import { axiosI } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const handleLogout = async () => {
  const navigate = useNavigate();
  try {
    await axiosI.post("/logout");

    localStorage.clear();

    window.location.replace("https://web3-assignment.netlify.app/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

import { NavigateFunction } from "react-router-dom";
import { axiosI } from "../../api/axios";

const handleLogout = async (navigate: NavigateFunction) => {
  try {
    await axiosI.post("/logout");

    localStorage.clear();

    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default handleLogout;

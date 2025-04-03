import { useNavigate } from "react-router-dom";
import { axiosI } from "../../api/axios";

export const handleLogout = async () => {
  const navigate = useNavigate();
  try {
    await axiosI.post("/logout");

    localStorage.clear();

    navigate("/login");
  } catch (error) {
    // console.error("Logout failed:", error);
  }
};

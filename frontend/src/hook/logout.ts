import { axiosI } from "../../api/axios";

export const handleLogout = async () => {
  try {
    await axiosI.post("/logout");

    localStorage.clear();

    window.location.replace("/login");
  } catch (error) {
    // console.error("Logout failed:", error);
  }
};

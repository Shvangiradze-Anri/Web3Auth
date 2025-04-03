import { axiosI } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const handleLogout = async () => {
  const navigate = useNavigate();
  try {
    const res=  await axiosI.post("/logout");
if(res.status === 200){  
  localStorage.clear();
    navigate("/login")
                      
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

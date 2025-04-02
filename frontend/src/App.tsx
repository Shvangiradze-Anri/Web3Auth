import { useLayoutEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("user") || "null");
  const walletAddress = localStorage.getItem("walletAddress");

  useLayoutEffect(() => {
    if (!userRole || !walletAddress) {
      console.log("No userRole or walletAddress, redirecting to login");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("isConnected");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <section>
      <div className="flex justify-between items-center p-4">
        <Link to="/">
          <img src="./images/logo.svg" />
        </Link>

        <div className="flex gap-2">
          {(userRole?.role === "Admin" || userRole?.role === "Premium") && (
            <button onClick={() => navigate("/admin")}>Go to Dashboard</button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <Outlet />
    </section>
  );
};

export default App;

import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  role: string | string[];
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (Array.isArray(role)) {
    if (!role.includes(user.role)) {
      return <Navigate to="/login" />;
    }
  } else if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

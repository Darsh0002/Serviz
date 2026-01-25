import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AppContext);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;

import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoadingState from "../components/LoadingState";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AppContext);

  if (loading) return <LoadingState/>;

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;

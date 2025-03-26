import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;

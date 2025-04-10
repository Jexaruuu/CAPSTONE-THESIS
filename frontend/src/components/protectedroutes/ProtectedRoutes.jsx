import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem("user"); // Check if user is logged in

  return user ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
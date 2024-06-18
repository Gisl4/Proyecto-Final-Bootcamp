import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
export const Protected = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

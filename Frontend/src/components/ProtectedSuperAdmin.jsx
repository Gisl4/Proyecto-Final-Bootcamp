import { useAuth } from "../context/authContext";
import { useState, useEffect } from "react";
import { useErrorUser } from "../hooks";
import { byId } from "../services/user.service";
import { Navigate } from "react-router-dom";

export const ProtectedSuperAdmin = ({ children }) => {
  const { user, isAuthSuper } = useAuth();
  const [resUser, setResUser] = useState([]);
  const [userById, setUserById] = useState(null);

  useEffect(() => {
    (async () => {
      setResUser(await byId(user._id));
    })(user);
  }, [user]);

  useEffect(() => {
    useErrorUser(resUser, setResUser, setUserById);
    console.log("=)", resUser);
  }, [resUser]);

  useEffect(() => {
    console.log("=(", userById);
  }, [userById]);

  console.log("User in ProtectedSuperAdmin: ", user);
  console.log("Is Super Admin: ", isAuthSuper);

  if (!user || !isAuthSuper) {
    return <Navigate to="/login" />;
  }

  return children;
};
// userById.rol != superAdmin;

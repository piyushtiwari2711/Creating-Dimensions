import React from "react";
import {Navigate} from "react-router"
import AdminComponenet from "../components/Admin/Admin";
import {useAuth} from "../context/AuthContext"
const Admin = () => {
  const {user}  = useAuth();
  if(!user||user.role !== "admin"){
    return <Navigate to="/signin" />;
  }
  return <AdminComponenet />;
};

export default Admin;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const auth = localStorage.getItem("token");
  return <div>

    {!auth ? <Outlet /> : <Navigate to="/" />}
    
    </div>;
};


export default PublicRoute;

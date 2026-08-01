import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import useFetchSingleUser from "../Hooks/UseFindSingleUser";
import LoadingSpinner from "../Shared/Loading";

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading: authLoading } = useAuth();
  const { singleUser, loading: userLoading } = useFetchSingleUser(user?.email || "");

  if (authLoading || userLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !singleUser) {
    return <Navigate to="/login" replace />;
  }

  if (!singleUser.role || !allowedRoles.includes(singleUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;

import React from "react";
import useAuth from "../../../Hooks/UseAuth";
import AdminStatistics from "../Admin/AdminHome";
import HostHome from "../Host/HostHome";
import UserHome from "../User/UserHome";
import useFetchSingleUser from "../../../Hooks/UseFindSingleUser";

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { singleUser } = useFetchSingleUser(user?.email);
  if (singleUser?.role === "admin") {
    return <AdminStatistics />;
  }
  if (singleUser?.role === "host") {
    return <HostHome />;
  }
  if (singleUser?.role === "user") {
    return <UserHome />;
  }

};

export default RoleBasedDashboard;

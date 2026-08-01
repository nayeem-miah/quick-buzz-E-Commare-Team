import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import LoadingSpinner from "../../../Shared/Loading";
import Pagination from "../../../Shared/Pagination/Pagination";

// Subcomponents
import { User } from "../../../types/user";
import { ManageUsersCards } from "./components/ManageUsersCards";
import { ManageUsersTable } from "./components/ManageUsersTable";

const ROLES = ["All", "User", "Host", "Admin"];
const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'host', label: 'Host' },
  { value: 'admin', label: 'Admin' }
];

const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-100 to-blue-50 text-blue-600 border-blue-200/50',
    'from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200/50',
    'from-purple-100 to-purple-50 text-purple-600 border-purple-200/50',
    'from-pink-100 to-pink-50 text-pink-600 border-pink-200/50',
    'from-amber-100 to-amber-50 text-amber-600 border-amber-200/50',
    'from-indigo-100 to-indigo-50 text-indigo-600 border-indigo-200/50',
    'from-rose-100 to-rose-50 text-rose-600 border-rose-200/50',
    'from-teal-100 to-teal-50 text-teal-600 border-teal-200/50'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getDropdownColor = (role: string) => {
  switch(role.toLowerCase()) {
    case 'admin':
      return 'bg-purple-50/60 text-purple-600 border-purple-100 focus:ring-purple-200/60';
    case 'host':
      return 'bg-blue-50/60 text-blue-600 border-blue-100 focus:ring-blue-200/60';
    default:
      return 'bg-gray-50/60 text-gray-600 border-gray-200 focus:ring-gray-200/60';
  }
};

const ManageUsers: React.FC = () => {
  const axiosSecure = UseAxiosSecure();
  const { data: users = [], refetch, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data;
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const size = 10;

  const handleRoleChange = (user: User, newRole: string) => {
    const currentRole = user.role || "user";

    if (currentRole.toLowerCase() === newRole.toLowerCase()) return;

    Swal.fire({
      title: "Change Role?",
      text: `Change ${user.name}'s role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/role/${user._id}`, { role: newRole })
          .then((res) => {
            if (res?.data?.data?.modifiedCount > 0) {
              refetch();
              Swal.fire({
                position: "center",
                icon: "success",
                title: `${user.name} is now a ${newRole}`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Failed to update ${user.name}'s role`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      } else {
        setPage(page);
      }
    });
  };

  const handleToggleSuspend = (user: User) => {
    const isCurrentlySuspended = user.status === "suspended";
    const newStatus = isCurrentlySuspended ? "active" : "suspended";
    const actionText = isCurrentlySuspended ? "activate" : "suspend";

    Swal.fire({
      title: "Confirm Status Change?",
      text: `Are you sure you want to ${actionText} ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText} them!`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/users/status/${user._id}`, { status: newStatus })
          .then((res) => {
            if (res?.data?.data?.modifiedCount > 0) {
              refetch();
              Swal.fire({
                position: "center",
                icon: "success",
                title: `${user.name} has been ${newStatus === "suspended" ? "suspended" : "activated"}`,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Failed to update status`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const userRole = (user.role || "user").toLowerCase();
      const normalizedRole = userRole === "customer" ? "user" : userRole;

      let matchesRole = true;
      if (roleFilter !== "All") {
        matchesRole = normalizedRole === roleFilter.toLowerCase();
      }

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / size) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * size, page * size);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">Minimalist view, filter and manage all users.</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex w-full md:w-96 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-455 text-base" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto z-30">
            <CustomDropdown
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              options={ROLES.map(r => ({ value: r, label: r === "All" ? "All Roles" : r }))}
              className="w-full md:w-40"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <FiUsers className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No users found</h3>
            <p className="text-sm text-gray-550 max-w-sm">
              We couldn't find any users matching your criteria.
            </p>
            {(searchQuery || roleFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("All");
                }}
                className="mt-5 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <ManageUsersTable
              users={paginatedUsers}
              onRoleChange={handleRoleChange}
              onToggleSuspend={handleToggleSuspend}
              getAvatarColor={getAvatarColor}
              getDropdownColor={getDropdownColor}
              roleOptions={ROLE_OPTIONS}
            />

            <ManageUsersCards
              users={paginatedUsers}
              onRoleChange={handleRoleChange}
              onToggleSuspend={handleToggleSuspend}
              getAvatarColor={getAvatarColor}
              getDropdownColor={getDropdownColor}
              roleOptions={ROLE_OPTIONS}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              size={size}
              totalItems={filteredUsers.length}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;

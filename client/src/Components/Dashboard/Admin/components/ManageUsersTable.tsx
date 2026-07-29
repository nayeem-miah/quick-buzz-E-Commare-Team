import React from "react";
import { FiClock, FiUserCheck, FiUserX } from "react-icons/fi";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";
import { User } from "../../../../types/user";

interface ManageUsersTableProps {
  users: User[];
  onRoleChange: (user: User, newRole: string) => void;
  onToggleSuspend: (user: User) => void;
  getAvatarColor: (name: string) => string;
  getDropdownColor: (role: string) => string;
  roleOptions: { value: string; label: string }[];
}

export const ManageUsersTable: React.FC<ManageUsersTableProps> = ({
  users,
  onRoleChange,
  onToggleSuspend,
  getAvatarColor,
  getDropdownColor,
  roleOptions,
}) => {
  return (
    <div className="hidden md:block overflow-visible w-full min-h-[480px]">
      <table className="w-full min-w-full text-left border-collapse whitespace-nowrap table-fixed">
        <colgroup>
          <col className="w-[32%]" />
          <col className="w-[18%]" />
          <col className="w-[20%]" />
          <col className="w-[18%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-gray-50/40 border-b border-gray-100 text-gray-505 text-xs font-semibold uppercase tracking-wider">
            <th className="py-3 px-6 font-semibold">User</th>
            <th className="py-3 px-6 font-semibold">Status</th>
            <th className="py-3 px-6 font-semibold">Role</th>
            <th className="py-3 px-6 font-semibold">Joined Date</th>
            <th className="py-3 px-6 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/60">
          {users.map((user) => {
            const displayRole = (user.role || "user").toLowerCase();
            const currentRoleValue = displayRole === "customer" ? "user" : displayRole;

            return (
              <tr
                key={user._id}
                className="hover:bg-gray-50/70 transition-colors duration-150 group hover:relative hover:z-20"
              >
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-[38px] h-[38px] rounded-full bg-gradient-to-tr flex items-center justify-center font-bold text-sm border shadow-sm ${getAvatarColor(
                        user.name
                      )}`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate flex-1">
                      <p className="text-sm font-bold text-gray-955 truncate" title={user.name}>{user.name}</p>
                      <p className="text-xs text-gray-550 truncate" title={user.email}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6">
                  {user.status === "suspended" ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50/50 px-2.5 py-1 rounded-full border border-rose-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Suspended
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active
                    </div>
                  )}
                </td>
                <td className="py-3 px-6">
                  <CustomDropdown
                    value={currentRoleValue}
                    onChange={(val) => onRoleChange(user, val)}
                    options={roleOptions}
                    className="w-28"
                    buttonClassName={`w-full border text-xs rounded-lg px-2.5 py-1.5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all ${getDropdownColor(
                      currentRoleValue
                    )}`}
                  />
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiClock className="text-gray-400" />
                    {user.timestamp ? new Date(user.timestamp).toLocaleDateString() : "N/A"}
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    {user.status === "suspended" ? (
                      <button
                        onClick={() => onToggleSuspend(user)}
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Activate User"
                      >
                        <FiUserCheck className="text-base" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleSuspend(user)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Suspend User"
                      >
                        <FiUserX className="text-base" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

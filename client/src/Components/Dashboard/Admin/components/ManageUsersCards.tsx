import React from "react";
import { FiClock, FiUserCheck, FiUserX } from "react-icons/fi";
import CustomDropdown from "../../../../Shared/Dropdown/CustomDropdown";
import { User } from "../../../../types/user";

interface ManageUsersCardsProps {
  users: User[];
  onRoleChange: (user: User, newRole: string) => void;
  onToggleSuspend: (user: User) => void;
  getAvatarColor: (name: string) => string;
  getDropdownColor: (role: string) => string;
  roleOptions: { value: string; label: string }[];
}

export const ManageUsersCards: React.FC<ManageUsersCardsProps> = ({
  users,
  onRoleChange,
  onToggleSuspend,
  getAvatarColor,
  getDropdownColor,
  roleOptions,
}) => {
  return (
    <div className="md:hidden flex flex-col p-4 gap-4 bg-gray-50/50 min-h-[480px]">
      {users.map((user) => {
        const displayRole = (user.role || "user").toLowerCase();
        const currentRoleValue = displayRole === "customer" ? "user" : displayRole;

        return (
          <div
            key={user._id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-tr flex items-center justify-center font-bold text-base border ${getAvatarColor(
                    user.name
                  )}`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              {user.status === "suspended" ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50/50 px-2.5 py-1 rounded-full border border-rose-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Suspended
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-55/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </div>
              )}
              <div className="text-xs text-gray-550 flex items-center gap-1">
                <FiClock className="text-gray-400" />{" "}
                {user.timestamp ? new Date(user.timestamp).toLocaleDateString() : "N/A"}
              </div>
            </div>

            <div className="h-px w-full bg-gray-100"></div>

            <div className="flex items-center justify-between">
              <div className="w-1/2 pr-2">
                <CustomDropdown
                  value={currentRoleValue}
                  onChange={(val) => onRoleChange(user, val)}
                  options={roleOptions}
                  className="w-full"
                  buttonClassName={`w-full border text-xs rounded-lg px-2.5 py-1.5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer transition-all ${getDropdownColor(
                    currentRoleValue
                  )}`}
                />
              </div>
              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                {user.status === "suspended" ? (
                  <button
                    onClick={() => onToggleSuspend(user)}
                    className="p-2 text-gray-500 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Activate User"
                  >
                    <FiUserCheck />
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleSuspend(user)}
                    className="p-2 text-gray-500 hover:text-rose-600 bg-gray-50 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Suspend User"
                  >
                    <FiUserX />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

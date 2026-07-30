import React, { useEffect, useRef, useState } from "react";
import { FiBell, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/UseAuth";
import useNotifications from "../../Hooks/UseNotifications";
import { formatRelativeTime } from "../../utils/formatTime";

const NotificationDropdown: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(user?.email);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (id: string, actionUrl?: string) => {
    await markAsRead(id);
    if (actionUrl) {
      navigate(actionUrl);
      setIsOpen(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center p-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50/50 rounded-full transition-all duration-300 focus:outline-none"
        title="Notifications"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[9px] font-extrabold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed md:absolute top-16 md:top-full left-4 right-4 md:left-auto md:right-0 mt-2.5 w-auto md:w-80 bg-white border border-gray-150 rounded-xl shadow-lg z-50 overflow-hidden animate-scaleIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <p className="text-xs text-gray-400 font-medium">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n._id, n.actionUrl)}
                  className={`px-4 py-3 flex gap-2.5 hover:bg-gray-50/50 cursor-pointer transition-all duration-150 relative group ${
                    !n.isRead ? "bg-orange-50/5" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-start mt-1.5">
                    {!n.isRead ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent flex-shrink-0" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className={`text-xs text-gray-900 leading-tight ${!n.isRead ? "font-bold" : "font-medium"}`}>
                      {n.title}
                    </p>
                    <p className="text-[10.5px] text-gray-550 mt-0.5 leading-normal break-words font-medium">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-gray-400 mt-1 block">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, n._id)}
                    className="self-center p-1 text-gray-400 hover:text-rose-500 rounded opacity-0 group-hover:opacity-100 transition duration-150"
                    title="Delete notification"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

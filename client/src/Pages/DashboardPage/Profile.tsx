import React, { useState } from "react";
import useAuth from "../../Hooks/UseAuth";
import { Link, useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  let role: string = "host";
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-300">
        <p className="text-gray-700 text-lg font-medium">User not logged in.</p>
        <Link to="/login">
          <button
            className="mt-4 px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
            border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Login
          </button>
        </Link>
      </div>
    );
  }

  const { displayName, photoURL, email } = user;

  const handleLogout = () => {
    logOut().then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-200">
      <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-lg p-6">
        <img
          src={photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full shadow-lg object-cover"
        />
        <div className="space-y-4 text-center mt-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {displayName || "Anonymous User"}
          </h2>
          <p className="text-sm text-gray-600">
            {email || "No email provided"}
          </p>
        </div>
        <div className="mt-8">
          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={openModal}
              className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
            >
              More details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              More Options
            </h3>
            <div className="space-y-4">
              {/* Role: Common for all users */}
              {
                <>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    Edit Profile
                  </button>
                </>
              }

              {/* Role: Only for "host" */}
              {role === "host" && (
                <>
                  <button
                    onClick={() => navigate("/dashboard/host-add-product")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    add Product
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/my-host-listings")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    Manage Listings
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/host-manage-booking")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    View All Bookings
                  </button>
                </>
              )}

              {/* Role: Only for "admin" */}
              {role === "admin" && (
                <>
                  <button
                    onClick={() => navigate("/dashboard/manage-users")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => navigate("/dashboard/manage-bookings")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    manage Booking
                  </button>

                  <button
                    onClick={() => navigate("dashboard/all-payment-history")}
                    className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    View Order History
                  </button>
                </>
              )}

              {/* Logout Button: Visible to all */}
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-black shadow-lg bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
              >
                Logout
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

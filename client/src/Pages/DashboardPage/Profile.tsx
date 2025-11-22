/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, ChevronRight, CreditCard, LogOut, Package, Settings, Shield, Store, User, Users } from "lucide-react";
import { useState } from "react";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { singleUser, loading } = useFetchSingleUser(user?.email as string);

  const navigate = (path: any) => console.log(`Navigate to: ${path}`);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    logOut().then(() => navigate("/login"));
  };

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User email not available</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <Link to={"/login"}
            className="px-6 py-2.5 rounded-md   text-black shadow-lg   bg-gradient-to-r from-purple-500 to-blue-500  transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { displayName, photoURL, email } = user;

  const getRoleBadge = (role?: string) => {
    type Role = "admin" | "Host" | "user";
    const badges: Record<Role, { label: string; color: string }> = {
      admin: { label: "Administrator", color: "bg-purple-100 text-purple-700 border-purple-200" },
      Host: { label: "Host", color: "bg-blue-100 text-blue-700 border-blue-200" },
      user: { label: "Customer", color: "bg-green-100 text-green-700 border-green-200" }
    };
    if (role === "admin" || role === "Host" || role === "user") {
      return badges[role];
    }
    return badges.user;
  };

  const roleBadge = getRoleBadge(singleUser?.role);

  const menuSections = [
    {
      title: "Account Management",
      items: [
        { label: "Edit Profile", icon: Settings, path: "/edit-profile", roles: ["admin", "Host", "user"] }
      ]
    },
    {
      title: "Admin Controls",
      visible: singleUser?.role === "admin",
      items: [
        { label: "User Management", icon: Users, path: "/dashboard/manage-users", roles: ["admin"] },
        { label: "Manage Bookings", icon: Calendar, path: "/dashboard/manage-bookings", roles: ["admin"] },
        { label: "Payment History", icon: CreditCard, path: "/dashboard/all-payment-history", roles: ["admin"] }
      ]
    },
    {
      title: "Host Dashboard",
      visible: singleUser?.role === "Host",
      items: [
        { label: "Add Product", icon: Package, path: "/dashboard/host-add-product", roles: ["Host"] },
        { label: "Manage Listings", icon: Store, path: "/dashboard/my-host-listings", roles: ["Host"] },
        { label: "View Bookings", icon: Calendar, path: "/dashboard/host-manage-booking", roles: ["Host"] }
      ]
    },
    {
      title: "My Account",
      visible: singleUser?.role === "user",
      items: [
        { label: "My Listings", icon: Package, path: "/dashboard/my-listings", roles: ["user"] },
        { label: "Payment History", icon: CreditCard, path: "/dashboard/my-payment-history", roles: ["user"] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-16 mb-4">
              <img
                src={photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="mt-4 sm:mt-16 sm:ml-6 text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {displayName || "Anonymous User"}
                    </h1>
                    <p className="text-gray-600 mt-1">{email}</p>
                  </div>
                  <span className={`mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${roleBadge.color}`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={openModal}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Sign Out</h3>
                  <p className="text-sm text-gray-600">Logout from account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </div>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Account Menu</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your account and preferences</p>
            </div>

            <div className="p-6 space-y-6">
              {menuSections.map((section, idx) => (
                section.visible !== false && (
                  <div key={idx}>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.items?.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <Link to={item.path}
                            key={itemIdx}
                            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <span className="ml-3 font-medium text-gray-900">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}

              {/* Logout in Modal */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Session
                </h3>
                <button
                  onClick={() => {
                    handleLogout();
                    closeModal();
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <LogOut className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="ml-3 font-medium text-red-700">Logout</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
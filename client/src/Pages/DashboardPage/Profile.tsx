/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiLock, FiLogOut, FiMail, FiMapPin, FiSave, FiShield, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import LoadingSpinner from "../../Shared/Loading";

const Profile: React.FC = () => {
  const { user, logOut, updateUserProfile } = useAuth();
  const { singleUser, loading: isUserLoading } = useFetchSingleUser(user?.email as string);
  const navigate = useNavigate();

  // Profile Edit States
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editPhoto, setEditPhoto] = useState(user?.photoURL || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Shipping Address States (persisted in localStorage for checkout integration)
  const [shippingName, setShippingName] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    return saved ? JSON.parse(saved).name : "";
  });
  const [shippingPhone, setShippingPhone] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    return saved ? JSON.parse(saved).phone : "";
  });
  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    return saved ? JSON.parse(saved).address : "";
  });
  const [shippingCity, setShippingCity] = useState(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    return saved ? JSON.parse(saved).city : "";
  });

  const handleLogout = () => {
    logOut().then(() => navigate("/login"));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editPhoto.trim()) {
      toast.error("Full Name and Photo URL are required.");
      return;
    }
    try {
      setIsUpdatingProfile(true);
      await updateUserProfile(editName, editPhoto);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      setIsUpdatingPassword(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updatePassword(currentUser, newPassword);
        toast.success("Password changed successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Session expired. Please log in again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update password. Try logging in again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: shippingName,
      phone: shippingPhone,
      address: shippingAddress,
      city: shippingCity
    };
    localStorage.setItem("quickbuzz_shipping_address", JSON.stringify(data));
    toast.success("Shipping address saved for checkout!");
  };

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
            <FiUser size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">User email not available</h2>
          <p className="text-sm text-gray-500 mb-6">Please log in to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition shadow-md shadow-orange-500/10"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isUserLoading) return <LoadingSpinner />;

  const getRoleStyle = (role?: string) => {
    switch (role) {
      case "admin":
        return { label: "Admin", style: "bg-purple-50 text-purple-700 border-purple-200" };
      case "Host":
        return { label: "Seller / Host", style: "bg-orange-50 text-orange-700 border-orange-200" };
      default:
        return { label: "Customer", style: "bg-green-50 text-green-700 border-green-200" };
    }
  };

  const roleInfo = getRoleStyle(singleUser?.role);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <Helmet>
        <title>My Profile | QuickBuzz</title>
      </Helmet>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
        <img
          src={user.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-orange-100 object-cover shadow-sm flex-shrink-0"
        />
        <div className="text-center md:text-left flex-1 space-y-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-black text-gray-950">{user.displayName || "Anonymous User"}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider mx-auto md:mx-0 w-max ${roleInfo.style}`}>
              <FiShield className="mr-1" /> {roleInfo.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1.5">
            <FiMail className="text-gray-400" /> {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <FiLogOut /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - General / Edit Profile */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50 flex items-center gap-2">
              <FiUser className="text-orange-500" /> Edit Profile Details
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Picture URL</label>
                  <input
                    type="text"
                    value={editPhoto}
                    onChange={(e) => setEditPhoto(e.target.value)}
                    placeholder="Photo URL"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-orange-500/10"
              >
                {isUpdatingProfile ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiSave />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Shipping Address Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50 flex items-center gap-2">
              <FiMapPin className="text-orange-500" /> Default Shipping Address
            </h2>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Receiver Name</label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Receiver Phone</label>
                  <input
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    placeholder="e.g. +88017xxxxxxxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Address</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House, Road, Apartment details..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    placeholder="e.g. Dhaka"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-orange-500/10"
              >
                <FiSave /> Save Shipping Address
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Security / Change Password */}
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50 flex items-center gap-2">
              <FiLock className="text-orange-500" /> Account Security
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-orange-500/10"
              >
                {isUpdatingPassword ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiLock />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

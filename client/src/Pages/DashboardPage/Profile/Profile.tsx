import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/UseAuth";
import useFetchSingleUser from "../../../Hooks/UseFindSingleUser";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";

import ProfileHeader from "./components/ProfileHeader";
import EditProfileForm from "./components/EditProfileForm";
import ShippingAddressForm from "./components/ShippingAddressForm";
import AccountSecurityForm from "./components/AccountSecurityForm";

const Profile: React.FC = () => {
  const { user, logOut, updateUserProfile } = useAuth();
  const { singleUser, loading: isUserLoading, refetch } = useFetchSingleUser(
    user?.email as string
  );
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploadingImage(true);
      const res = await axiosPublic.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        const url = res.data.data.display_url;
        
        // 1. Update in Firebase
        await updateUserProfile(user?.displayName || "", url);
        
        // 2. Update in MongoDB
        await axiosSecure.patch(`/users/profile/${user?.email}`, {
          photo: url
        });

        refetch();
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = () => {
    logOut().then(() => navigate("/login"));
  };

  if (!user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
            <FiUser size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-950 mb-2">
            User email not available
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Please log in to view your profile
          </p>
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
        return {
          label: "Admin",
          style: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "Host":
        return {
          label: "Seller / Host",
          style: "bg-orange-50 text-orange-700 border-orange-200",
        };
      default:
        return {
          label: "Customer",
          style: "bg-green-50 text-green-700 border-green-200",
        };
    }
  };

  const roleInfo = getRoleStyle(singleUser?.role);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <Helmet>
        <title>My Profile | QuickBuzz</title>
      </Helmet>

      {/* Profile Header */}
      <ProfileHeader
        user={user}
        roleInfo={roleInfo}
        handleLogout={handleLogout}
        onImageUpload={handleImageUpload}
        isUploading={isUploadingImage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - General / Edit Profile */}
        <div className="lg:col-span-2 space-y-8">
          <EditProfileForm
            initialName={user.displayName || ""}
            userEmail={user.email}
            updateUserProfile={updateUserProfile}
            axiosSecure={axiosSecure}
          />

          <ShippingAddressForm
            dbShippingAddress={singleUser?.shippingAddress}
            userEmail={user.email}
            axiosSecure={axiosSecure}
          />
        </div>

        {/* Right Column - Security / Change Password */}
        <div className="space-y-8">
          <AccountSecurityForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;

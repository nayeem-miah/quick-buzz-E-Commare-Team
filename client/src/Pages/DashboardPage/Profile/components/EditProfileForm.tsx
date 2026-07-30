/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiUser } from "react-icons/fi";

interface EditProfileFormProps {
  initialName: string;
  userEmail: string;
  updateUserProfile: (name: string, photo: string) => Promise<void>;
  axiosSecure: any;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialName,
  userEmail,
  updateUserProfile,
  axiosSecure,
}) => {
  const [editName, setEditName] = useState(initialName || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    try {
      setIsUpdatingProfile(true);

      // Get current photoURL from Firebase Auth
      const auth = getAuth();
      const currentPhoto = auth.currentUser?.photoURL || "";

      // Update Firebase
      await updateUserProfile(editName, currentPhoto);

      // Update MongoDB UserCollection
      await axiosSecure.patch(`/users/profile/${userEmail}`, {
        name: editName,
      });

      toast.success("Profile details updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-gray-950 pb-2 border-b border-gray-50 flex items-center gap-2">
        <FiUser className="text-orange-500" /> Edit Profile Details
      </h2>
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Full name"
              className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-orange-500/10"
        >
          {isUpdatingProfile ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSave />
          )}
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;

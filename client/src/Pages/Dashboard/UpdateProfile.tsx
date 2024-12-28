import React, { useState } from "react";
import useAuth from "../../Hooks/UseAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Shared/Navbar/Navbar";

const UpdateProfile: React.FC = () => {
  const { updateUserProfile } = useAuth(); // AuthProvider থেকে ফাংশন আনুন
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); // ফর্ম রিলোড বন্ধ করতে
    if (!name || !photo) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await updateUserProfile(name, photo);
      toast.success("Profile Update Sucsesfull");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="w-1/3  mx-auto lg:mt-44">
        <h2 className="text-2xl text-center font-bold">Update Profile</h2>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="photo">Photo URL:</label>
            <input
              type="text"
              id="photo"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            className=" text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

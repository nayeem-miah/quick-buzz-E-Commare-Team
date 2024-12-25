import React, { useState } from "react";
import useAxiosPublic from "../../../../Hooks/UsePublic";
import toast from "react-hot-toast";

interface SellerData {
  sellData: any;
}
const Decline: React.FC<SellerData> = ({ sellData }) => {
  const axiosPublic = useAxiosPublic();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // decline modal
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const declineData = {
        inputValue,
      };

      await axiosPublic
        .patch(`/decline-message/${sellData._id}`, declineData)
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            toast.success("decline successfully");
            // navigate("/dashboard/my-host-listings");
          }
        });

      setInputValue(""); // Reset input field
      toggleModal(); // Close modal
    } catch (err) {
      console.error(err);
      toast.error(`error is ,${err}`);
    }
  };
  return (
    <div>
      <button
        onClick={toggleModal}
        className="  px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
      >
        Decline
      </button>

      {/* Modal decline */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              onClick={toggleModal}
            >
              X{/* <XMarkIcon className="w-6 h-6" /> */}
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reason for Decline
            </h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="declineInput" className="block text-gray-700">
                Please provide your reason:
              </label>
              <textarea
                id="declineInput"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your reason here..."
                value={inputValue}
                required
                onChange={(e) => setInputValue(e.target.value)}
                rows={4}
              ></textarea>
              <div className="flex justify-end mt-6">
                {/* <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all mr-2"
                  onClick={toggleModal}
                >
                  Cancel
                </button> */}
                <button
                  type="submit"
                  className="px-4 w-full sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                  border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decline;

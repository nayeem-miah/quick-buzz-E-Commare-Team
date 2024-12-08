import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import NoData from "../../../Shared/NoDataFound/NoData";

interface SellerDetails {
  sellerName: string;
  sellerEmail: string;
  sellerPhoto: string;
  imageUrl: string;
  mobile: number;
  reason: string;
  other: string;
  address: string;
  _id: number;
  adminIsApproved: string;
}
const AllHostRequest: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<SellerDetails | null>(
    null
  );
  //    get host request data
  const {
    data: sellerData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/seller");
      return res.data;
    },
  });
  //   console.log(sellerData);

  // delete
  const handleDelete = async (id: any) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosPublic.delete(`/delete-seller/${id}`).then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          });
        }
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  // decline modal
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted value:", inputValue);
    setInputValue(""); // Reset input field
    toggleModal(); // Close modal
  };

  //   details modal
  const handleDetailsClick = (listing: SellerDetails) => {
    setSelectedBooking(listing);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <Heading title={"All seller request"} subtitle={""} />
      {sellerData.length === 0 ? (
        <NoData />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-400 text-white">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-left">sl</th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Name
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  email
                </th>
                {/* <th className="py-3 px-4 text-sm font-medium text-left">passport img</th> */}
                <th className="py-3 px-4 text-sm font-medium text-left">
                  status
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  decline
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  delete
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {sellerData?.map((sellerData: SellerDetails, id: number) => (
                <tr
                  key={sellerData._id}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {(id = id + 1)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {sellerData?.sellerName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {sellerData?.sellerEmail}
                  </td>

                  {/* <td className="py-4 px-4 text-sm text-gray-600">
              <img
                src={sellerData?.imageUrl}
                alt={"no image founded"}
                className="w-16 h-16 object-cover rounded-md"
              />
            </td> */}

                  <td className="py-4 px-4 text-sm text-gray-600">
                    {sellerData?.adminIsApproved === "approve" ? (
                      "Approve"
                    ) : (
                      <button
                        onClick={() => {
                          // handleApproved(sellerData);
                        }}
                        className="px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                  border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                      >
                        approve
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <button
                      onClick={toggleModal}
                      className="  px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                    >
                      Decline
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    <button
                      onClick={() => {
                        handleDelete(sellerData?._id);
                      }}
                      className="px-4 py-2   text-2xl rounded-lg hover:text-red-700 transition duration-300 focus:outline-none"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <button
                      onClick={() => handleDetailsClick(sellerData)}
                      className="  px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* open details modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                Seller Details
              </h3>
              <div
                className="text-gray-600 hover:text-gray-900 cursor-pointer text-2xl"
                onClick={closeModal}
              >
                ✕
              </div>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image Section */}
              <div className="relative overflow-hidden  rounded-lg shadow-lg">
                <img
                  src={selectedBooking.imageUrl || "loading-image-url.jpg"}
                  alt={selectedBooking.sellerName}
                  className="rounded-2xl w-full mb-2  object-cover"
                />
                <span className=" text-sm  px-3 py-1 rounded-full">
                  <h3>
                    <span className="font-bold">
                      Why should you become a seller?
                    </span>
                  </h3>
                  {selectedBooking.reason ? (
                    <span>{selectedBooking.reason}</span>
                  ) : (
                    "Reason not provided"
                  )}
                </span>
              </div>

              {/* Details Section */}
              <div className="space-y-3 text-gray-700">
                <p className="text-sm">
                  <span className="font-bold text-gray-900">Seller Name:</span>{" "}
                  {selectedBooking.sellerName || "Loading..."}
                </p>
                <p className="text-sm">
                  <span className="font-bold text-gray-900">Email:</span>{" "}
                  <span className="text-blue-600 underline">
                    {selectedBooking.sellerEmail || "Loading..."}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-bold text-gray-900">Mobile:</span>{" "}
                  {selectedBooking.mobile || "N/A"}
                </p>
                <p className="text-sm">
                  <span className="font-bold text-gray-900">Address:</span>{" "}
                  {selectedBooking.address || "N/A"}
                </p>

                {/* Host Info */}
                <div className="flex items-center space-x-3">
                  <img
                    className="h-12 w-12 rounded-full border-2 border-blue-500 shadow-md"
                    src={selectedBooking.sellerPhoto || "default-photo.jpg"}
                    alt={selectedBooking.sellerName}
                  />
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedBooking.sellerName || "Loading..."}
                  </p>
                </div>

                <p className="text-sm">
                  <span className="font-bold text-gray-900">
                    Additional Info:
                  </span>{" "}
                  {selectedBooking.other || "No details provided"}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600">
                {selectedBooking.reason || "No description available."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal decline */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              <XMarkIcon className="w-6 h-6" />
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

export default AllHostRequest;

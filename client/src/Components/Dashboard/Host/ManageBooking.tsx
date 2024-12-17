import React, { useState } from "react";
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";
import useAxiosPublic from "../../../Hooks/UsePublic";
import useAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Shared/Loading";
import Heading from "../../../Shared/Heading/Heading";
import { useNavigate } from "react-router-dom";
import NoData from "../../../Shared/NoDataFound/NoData";

interface Listing {
  [x: string]: ReactNode;
  _id: number;
  productTitle: string;
  productImage: string;
  adminIsApproved: string;
  hostPhoto: string;
  hostName: string;
  hostEmail: string;
  brandName: string;
  category: string;
  price: number;
  tags: string;
  description: string;
}

const ManageBooking: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/host-payment-history/${user?.email}`);
      return res.data;
    },
  });
  console.log(data);
  // handle delete
  const handleDelete = (id: any) => {
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
        axiosPublic.delete(`/pro/${id}`).then((res) => {
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
  };

  const handleApproved = (product: any) => {
    // handle product approval logic
  };

  const [selectedBooking, setSelectedBooking] = useState<Listing | null>(null);
  const handleDetailsClick = (listing: Listing) => {
    setSelectedBooking(listing);
  };
  const closeModal = () => {
    setSelectedBooking(null);
  };

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>error...{isError}</div>;

  return (
    <div>
      <div>
        <Heading title={"Manage booking product"} subtitle={""} />
        {data.length === 0 ? (
          <NoData />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-400 text-white">
                <tr>
                  <th className="py-3 px-4 text-sm font-medium text-left">sl</th>
                  <th className="py-3 px-4 text-sm font-medium text-left">cus_email</th>
                  <th className="py-3 px-4 text-sm font-medium text-left">date</th>
                  {/* <th className="py-3 px-4 text-sm font-medium text-left">transition ID</th> */}
                  <th className="py-3 px-4 text-sm font-medium text-left">Price</th>
                  <th className="py-3 px-4 text-sm font-medium text-left">Status</th>
                  <th className="py-3 px-4 text-sm font-medium text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.map((listing: Listing) => (
                  <tr
                    key={listing._id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-4 text-sm text-gray-600">{listing?.cus_email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <img
                        src={listing?.productImage}
                        alt={"no image found"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">${listing?.price}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {listing?.adminIsApproved === "approve" ? (
                        "Approve"
                      ) : (
                        <button
                          onClick={() => {
                            handleApproved(listing);
                          }}
                          className="px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                        >
                          approve
                        </button>
                      )}
                    </td>
                    {/* <td className="py-4 px-4 text-sm text-gray-600">
                      <button
                        onClick={() => {
                          handleDelete(listing?._id);
                        }}
                        className="px-4 py-2 text-2xl rounded-lg hover:text-red-700 transition duration-200 focus:outline-none"
                      >
                        <MdDeleteForever />
                      </button>
                    </td> */}
                    <td className="py-4 px-4 text-sm">
                      <button
                        onClick={() => handleDetailsClick(listing)}
                        className="px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
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

        {/* Modal */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h3 className="text-4xl font-extrabold text-gray-800 tracking-wide">
                  Product Details
                </h3>
                <div
                  className="text-gray-600 hover:text-gray-900 cursor-pointer text-2xl"
                  onClick={closeModal} // Close modal when clicking the "X"
                >
                  ✕
                </div>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={selectedBooking.productImage || "loading-image-url.jpg"} // Add a placeholder loading image
                    alt={selectedBooking.productTitle}
                    className="rounded-2xl w-full h-64 object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    {selectedBooking?.category}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg">
                    <span className="font-bold text-gray-900">Title:</span> {selectedBooking?.productTitle || "Loading..."}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold text-gray-900">Price:</span>{" "}
                    <span className="text-lg font-extrabold text-green-600">${selectedBooking?.price || "0.00"}</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-900">Brand:</span> {selectedBooking?.brandName || "Loading..."}
                  </p>

                  {/* Host Info */}
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-900">Host:</span>
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-14 w-14 rounded-full border-2 border-blue-500 shadow-md"
                        src={selectedBooking?.hostPhoto || "default-host-photo.jpg"}
                        alt={selectedBooking?.hostName || "Host"}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{selectedBooking?.hostName || "Loading..."}</p>
                        <p className="text-sm text-gray-600">{selectedBooking?.hostEmail || "Loading..."}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg">
                    <span className="font-bold text-gray-900">Host Approved:</span>{" "}
                    <span
                      className={`font-semibold ${selectedBooking?.adminIsApproved === "pending" ? "text-red-600" : "text-green-600"}`}
                    >
                      {selectedBooking?.adminIsApproved || "Loading..."}
                    </span>
                  </p>
                  <p className="text-lg">
                    <span className="font-bold text-gray-900">Tags:</span> {selectedBooking?.tags || "Loading..."}
                  </p>
                </div>
              </div>

              {/* Description Section */}
              <div className="mt-6">
                <p className="text-xl font-bold text-gray-900">Description:</p>
                <p className="text-gray-700">{selectedBooking?.description || "No description available."}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;

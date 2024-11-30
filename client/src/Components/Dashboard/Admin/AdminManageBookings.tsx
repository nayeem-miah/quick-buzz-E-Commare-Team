import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";

interface Listing {
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

const AdminManageBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Listing | null>(null);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // get all product
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  // admin is approved
  const handleApproved = (product: any) => {
    axiosPublic.patch(`/admin-product/${product._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${product.productTitle} is approved now!`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/product");
      }
    });
  };

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

  const handleDetailsClick = (listing: Listing) => {
    setSelectedBooking(listing);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>error...</div>;

  return (
    <div className="">
      <Heading title={"Manage product"} subtitle={""} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">sl</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Title</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Image</th>
              <th className="py-3 px-4 text-sm font-medium text-left">price</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                status
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
            {data?.map((listing: Listing, id: number) => (
              <tr
                key={listing._id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  {(id = id + 1)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {listing?.productTitle}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <img
                    src={listing?.productImage}
                    alt={"no image founded"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  ${listing?.price}
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  <th>
                    {listing?.adminIsApproved === "approve" ? (
                      "Approve"
                    ) : (
                      <button
                        onClick={() => {
                          handleApproved(listing);
                        }}
                        className="text-black shadow-lg  relative md:px-6 md:py-2 lg:py-2 py sm:px-4 lg:px-6  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                      >
                        approve now
                      </button>
                    )}
                  </th>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <button
                    onClick={() => {
                      handleDelete(listing?._id);
                    }}
                    className="px-4 py-2   text-2xl rounded-lg hover:text-red-700 transition duration-300 focus:outline-none"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
                <td className="py-4 px-4 text-sm">
                  <button
                    onClick={() => handleDetailsClick(listing)}
                    className="  text-black shadow-lg  relative md:px-6 md:py-2 lg:py-2 py sm:px-4 lg:px-6  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                  border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ease-in-out"
          onClick={closeModal} // Closes modal when clicking outside
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl p-8 w-full max-w-4xl scale-95 opacity-0 transition-all duration-200 ease-out transform hover:scale-100 hover:opacity-100"
            onClick={(e) => e.stopPropagation()} // Prevents modal content from triggering close
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-4xl font-extrabold text-gray-800 tracking-wide transition-transform duration-200 ease-in-out transform hover:scale-105">
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
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-all duration-200 ease-in-out">
                <img
                  src={selectedBooking.productImage || "loading-image-url.jpg"} // Add a placeholder loading image
                  alt={selectedBooking.productTitle}
                  className="rounded-2xl w-full h-64 object-cover"
                />
                <span className="absolute top-4 left-4 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transform translate-x-2 translate-y-2">
                  {selectedBooking?.category}
                </span>
              </div>

              {/* Details Section */}
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  <span className="font-bold text-gray-900">Title:</span>{" "}
                  {selectedBooking?.productTitle || "Loading..."}
                </p>
                <p className="text-lg">
                  <span className="font-bold text-gray-900">Price:</span>{" "}
                  <span className="text-lg font-extrabold text-green-600">
                    ${selectedBooking?.price || "0.00"}
                  </span>
                </p>
                <p>
                  <span className="font-bold text-gray-900">Brand:</span>{" "}
                  {selectedBooking?.brandName || "Loading..."}
                </p>

                {/* Host Info */}
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gray-900">Host:</span>
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-14 w-14 rounded-full border-2 border-blue-500 shadow-md transform hover:scale-105 transition-all duration-200"
                      src={
                        selectedBooking?.hostPhoto || "default-host-photo.jpg"
                      } // Placeholder for host image
                      alt={selectedBooking?.hostName || "Host"}
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedBooking?.hostName || "Loading..."}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedBooking?.hostEmail || "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg">
                  <span className="font-bold text-gray-900">
                    Host Approved:
                  </span>{" "}
                  <span
                    className={`font-semibold ${
                      selectedBooking?.adminIsApproved === "pending"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedBooking?.adminIsApproved &&
                      selectedBooking?.adminIsApproved}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-bold text-gray-900">Tags:</span>{" "}
                  {selectedBooking?.tags || "Loading..."}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-6">
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Description
              </h4>
              <p className="text-gray-600 leading-relaxed text-base">
                {selectedBooking?.description || "Loading... Please wait."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageBookings;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";

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
  const axiosSecure = UseAxiosSecure();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const category = params.get("category") || "all";

  const [page, setPage] = useState(1);
  const [size] = useState(10);


  /* Fetch products with pagination */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", category, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/products?category=${category}&page=${page}&size=${size}`
      );
      return res.data;
    },
    enabled: !!category,
  });

  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;


  useEffect(() => {
    setPage(1);
    refetch();
  }, [category, refetch]);

  // admin is approved
  const handleApproved = (product: any) => {
    axiosSecure.patch(`/products/admin-product/${product._id}`).then((res) => {
      if (res.data.data.modifiedCount > 0) {
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
        axiosSecure.delete(`/products/${id}`).then((res) => {
          if (res.data.data.deletedCount > 0) {
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

  return (
    <div className="w-full block px-6 lg:px-16 xl:px-28 2xl:px-40">
      <div className="mb-6">
        <Heading title={"Manage product"} subtitle={""} />
      </div>
      <div className="w-full block bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 mb-8 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/80 border-b border-blue-100 uppercase tracking-wider text-blue-800 text-xs font-bold">
                <th className="py-4 px-6 md:px-8">SL</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Delete</th>
                <th className="py-4 px-8 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((listing: Listing, id: number) => (
                <tr
                  key={listing._id}
                  className="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td className="py-4 px-6 md:px-8 text-sm font-medium text-gray-500">
                    {id + 1 + (page - 1) * size}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-800">
                    {listing?.productTitle.slice(0, 20)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img
                        src={listing?.productImage}
                        alt={"Product representation"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-blue-600">
                    ${listing?.price}
                  </td>

                  <td className="py-4 px-4 text-sm">
                    {listing?.adminIsApproved === "approve" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproved(listing)}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/30 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleDelete(listing?._id)}
                      className="inline-flex justify-center items-center w-8 h-8 text-lg text-gray-400 bg-gray-50 rounded-lg hover:text-red-600 hover:bg-red-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      title="Delete"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDetailsClick(listing)}
                      className="px-4 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 shadow-sm rounded-full transition-all duration-300"
                    >
                      View Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end items-center gap-3 mt-6 mb-12 pr-4 sm:pr-8">
          <button
            className={`flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl shadow-sm border 
            ${isLoading || page <= 1
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:-translate-x-1"
              }`}
            disabled={isLoading || page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Previous
          </button>

          <div className="flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-blue-50/50 text-blue-800 border border-blue-100 rounded-xl shadow-sm">
            Page <span className="font-extrabold mx-1.5">{page}</span> of <span className="font-bold ml-1.5">{totalPages}</span>
          </div>

          <button
            className={`flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl shadow-sm border
            ${isLoading || page >= totalPages
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:translate-x-1"
              }`}
            disabled={isLoading || page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

      </div>

      {/* Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal} // Closes modal when clicking outside
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl p-8 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()} // Prevents modal content from triggering close
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
                      className="h-14 w-14 rounded-full border-2 border-blue-500 shadow-md"
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
                    className={`font-semibold ${selectedBooking?.adminIsApproved === "pending"
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

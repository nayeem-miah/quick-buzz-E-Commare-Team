import React, { ReactNode, useState } from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import useAuth from "../../../Hooks/UseAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Shared/Loading";
import Heading from "../../../Shared/Heading/Heading";
import NoData from "../../../Shared/NoDataFound/NoData";
import Swal from "sweetalert2";

interface Listing {
  [x: string]: ReactNode;
  _id: number;
  productTitle: any  ;
  productImage: string;
  hostIsApproved: string;
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
 


  /* All Payment history  */
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

   

  /* Product approve update */

  const handleApproved = (product: any) => {
    axiosPublic.patch(`/host-manage-product/${product._id}`).then((res) => {
      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${product.productTitle} is approved now!`,
          showConfirmButton: false,
          timer: 1500,
        });
        // navigate("/product");
      }
    });
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
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    sl
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    cus_email
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    date
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    Price
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    Status
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-left">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map(
                  (listing: Listing, i: number) =>
                    listing.status === "success" && (
                      <tr
                        key={listing._id}
                        className="border-b hover:bg-gray-50 transition duration-200"
                      >
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {(i = i + 1)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {listing?.cus_email}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {listing?.date}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          ${listing?.totalPrice}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {listing?.hostIsApproved === "approve" ? (
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
                       
                        <td className="py-4 px-4 text-sm">
                          <button
                            onClick={() => handleDetailsClick(listing)}
                            className="px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    )
                )}
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
              <div className="space-y-4 text-gray-700">
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    User Name:
                  </span>
                  {selectedBooking?.cus_name || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">Email:</span>
                  {selectedBooking?.cus_email || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    Payment Date:
                  </span>
                  {selectedBooking?.tran_date || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">Amount:</span>
                  {selectedBooking?.totalPrice || "0"}
                  {selectedBooking?.currency || ""}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    Transaction ID:
                  </span>
                  {selectedBooking?.transactionId || "N/A"}
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    Card Type:
                  </span>
                  {selectedBooking?.card_type || "N/A"}
                </p>

                {/* Host Approval Status */}
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    Approval Status:
                  </span>
                  <span
                    className={`font-semibold ${
                      selectedBooking?.hostIsApproved === "approve"
                        ? "text-green-600"
                        : selectedBooking?.hostIsApproved === "pending"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {selectedBooking?.hostIsApproved || "N/A"}
                  </span>
                </p>

                {/* Status */}
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">
                    payment Status:
                  </span>
                  <span
                    className={`font-semibold ${
                      selectedBooking?.status === "success"
                        ? "text-green-500" // Green for Success
                        : selectedBooking?.status === "Failed"
                        ? "text-red-500" // Red for Failed
                        : "text-yellow-500" // Yellow for Pending or N/A
                    }`}
                  >
                    {selectedBooking?.status || "N/A"}
                  </span>
                </p>

                {/* Products List */}
                <p className="text-sm sm:text-base">
                  <span className="font-semibold text-gray-900">Products:</span>
                  <ul className="list-disc list-inside space-y-2">
                    {selectedBooking?.productTitle?.map(
                      (title: any, index: any) => (
                        <li key={index} className="flex items-start space-x-3">
                          <img
                            src={selectedBooking?.productImage?.[index] || ""}
                            alt={title || "Product Image"}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                          />
                          <div>
                            <p className="font-medium text-sm sm:text-base">
                              {title || "Unnamed Product"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {selectedBooking?.brandName?.[index] ||
                                "No Brand"}
                            </p>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;

import React, { useState } from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Heading from "../../../Shared/Heading/Heading";
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";
import useAuth from "../../../Hooks/UseAuth";
import LoadingSpinner from "../../../Shared/Loading";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

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

const MyAddedProduct: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/host-product/${user?.email}`);
      return res.data;
    },
  });

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

  // modal code
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
      <div className="">
        <Heading title={"My added product"} subtitle={""} />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-400 text-white">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Title
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Image
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  price
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  status
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  delete
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  edit
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((listing: Listing) => (
                <tr
                  key={listing._id}
                  className="border-b hover:bg-gray-50 transition duration-300"
                >
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
                    {listing?.adminIsApproved}
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
                  <td className="py-4 px-4 text-sm text-gray-600">
                    <Link to={`/updated-product/${listing._id}`}>
                      <button className="px-4 py-2   text-2xl rounded-lg hover:text-green-700 transition duration-300 focus:outline-none">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>

                  <td className="py-4 px-4 text-sm">
                    <Link to={`/product/${listing._id}`}>
                      <button
                        // onClick={() => handleDetailsClick(listing)}
                        className="  text-black shadow-lg  relative md:px-6 md:py-2 lg:py-2 py sm:px-4 lg:px-6  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                      >
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                my added product
              </h3>
              <div className="space-y-2">
                <div>
                  <strong>Image:</strong>
                  <img
                    src={selectedBooking.productImage}
                    alt={selectedBooking.productTitle}
                    className="w-full h-48 object-cover mt-2 rounded-md"
                  />
                </div>
                <p>
                  <strong>Title:</strong> {selectedBooking?.productTitle}
                </p>
                <p>
                  <strong>adminIsApproved:</strong>{" "}
                  {selectedBooking?.adminIsApproved}
                </p>
                <p>
                  <strong>price:</strong> {selectedBooking?.price}
                </p>
                <p>
                  <strong>brandName:</strong> {selectedBooking?.brandName}
                </p>
                <p>
                  <strong>category:</strong> {selectedBooking?.category}
                </p>

                <p>
                  <strong>hostEmail:</strong> {selectedBooking?.hostEmail}
                </p>
                <p className="flex  items-center gap-4">
                  <strong>hostName:</strong> {selectedBooking?.hostName}
                  <img
                    className="h-10 w-10 rounded-full"
                    src={selectedBooking?.hostPhoto}
                    alt=""
                  />
                </p>

                <p>
                  <strong>price:</strong> {selectedBooking?.price}
                </p>
                <p>
                  <strong>tags:</strong> {selectedBooking?.tags}
                </p>
                <p>
                  <strong>description:</strong> {selectedBooking?.description}
                </p>
              </div>
              <div className="mt-6 text-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAddedProduct;

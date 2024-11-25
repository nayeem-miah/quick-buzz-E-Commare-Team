import React, { useState } from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Heading from "../../../Shared/Heading/Heading";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allProduct"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  const [selectedBooking, setSelectedBooking] = useState<Listing | null>(null);

  const handleDetailsClick = (listing: Listing) => {
    setSelectedBooking(listing);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };
  console.log(data);
  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;
  return (
    <div>
      <div className="">
        <Heading title={"My added product"} subtitle={""} />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-blue-500 text-white">
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
              <div className="mt-6 gap-8 flex">
                <button
                  // onClick={closeModal} 
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none"
                >
                  delete
                </button>
                <button
                  // onClick={closeModal}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none"
                >
                  edit
                </button>
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

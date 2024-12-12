import React from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Shared/Loading";
import { FaArrowRight } from "react-icons/fa";
import useAuth from "../../../Hooks/UseAuth";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

const MyAddedCart: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Query data
  const {
    data: allsave = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allsave"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/allsave/${user?.email}`);
      return res.data;
    },
  });
  // Wait until allsave is fetched before calculating totalPrice
  const totalPrice = allsave.reduce(
    (total: any, save: { price: any }) => total + save.price,
    0
  );

  // console.log(typeof totalPrice);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  /* My added product is deleted */
  const handleDelete = (id: any) => {
    // console.log("Deleting ID:", id); 
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
        axiosPublic
          .delete(`/userpro/${id}`)
          .then((res) => {
            console.log("Response from server:", res.data);
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "No item was deleted. Please try again.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error(
              "Delete error:",
              error.response?.data || error.message
            );
            Swal.fire({
              title: "Error",
              text: "Failed to delete the item. Please check your connection or try again.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex justify-around items-center m-8 gap-8">
          <h2 className="md:text-3xl sm:text-2xl lg:text-3xl">
            All Items: {allsave?.length}
          </h2>
          <h2 className="md:text-3xl sm:text-2xl lg:text-3xl mb-4 md:mb-0 ">
            Total Price: ${totalPrice}
          </h2>
          <h3 className="md:text-xl lg:xl  sm:text-sm">
            <button className="mt-3 px-6 md:px-6 sm:px-1 flex py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
              <span className="mx-4 flex items-center">Pay </span>
              <FaArrowRight className="" />
            </button>
          </h3>
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">Image</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Title</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Brand Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">Price</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Discount
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Payment
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {allsave.map((save: any) => (
              <tr
                key={save._id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  <img
                    src={save?.productImage}
                    alt="No image found"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {save?.productTitle.slice(0, 20)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {save?.brandName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  ${save?.price}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {save?.discount}%
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <button className="mt-3 px-6 flex py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
                    <span className="mx-4 font-medium">Pay </span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(save?._id)}
                    className=" btn-ghost"
                  >
                    <MdDeleteForever className="text-red-600 text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAddedCart;

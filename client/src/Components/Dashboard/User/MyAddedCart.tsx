import React from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../Shared/Loading";
import { FaArrowRight } from "react-icons/fa";
import useAuth from "../../../Hooks/UseAuth";



const MyAddedCart: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const {user} = useAuth()

  const { data: allsave = [], isLoading } = useQuery({
    queryKey: ["allsave"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/allsave/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">Image</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Title</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Brand Name</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Price
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Discount
              </th>
             
              <th className="py-3 px-4 text-sm font-medium text-left">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {allsave.map((save: Save) => (
              <tr
                key={save._id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  <img
                    src={save?.productImage}
                    alt={"no image founded"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  {save?.productTitle}
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
                <button
                className="mt-3 px-6 flex   py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
              >
                  <span className="mx-4 font-medium">Pay Now</span>
               <FaArrowRight className="w-5 h-5" />
            
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

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
}
const AllHostRequest: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  //    get host request data
  const { data: sellerData = [], isLoading } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/seller");
      return res.data;
    },
  });
  //   console.log(sellerData);

  // delete
  const handleDelete = (id: any) => {
    console.log(id);
  };

  // decline modal
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted value:", inputValue);
    setInputValue(""); // Reset input field
    toggleModal(); // Close modal
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <Heading title={"All seller request"} subtitle={""} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-400 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">sl</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Name</th>
              <th className="py-3 px-4 text-sm font-medium text-left">email</th>
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
                    // onClick={() => handleDetailsClick(sellerData)}
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

import React from "react";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Heading from "../../../Shared/Heading/Heading";
import NoData from "../../../Shared/NoDataFound/NoData";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

type SellerRequestProps = {
  sellerData: {
    _id: string;
    sellerName: string;
    sellerEmail: string;
    sellerPhoto: string;
    mobile: string;
    reason: string;
    address: string;
    other: string;
    imageUrl: string;
  };
};
const SellerRequest: React.FC<SellerRequestProps> = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  //    get host request data in every single email
  const { data: sellerData = [], refetch } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/single-seller/${user?.email}`);
      return res.data;
    },
  });

  const {
    sellerName,
    sellerEmail,
    sellerPhoto,
    mobile,
    reason,
    address,
    other,
    imageUrl,
  } = sellerData;

  const handleEdit = () => {
    console.log(`Approved seller: ${sellerName}`);
  };

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
  return (
    <div>
      <section className="">
        <Heading title={"Seller Request data"} subtitle={""}></Heading>

        <div>
          {sellerData?.length === 0 ? (
            <NoData />
          ) : (
            <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300 transform transition hover:scale-105 duration-300">
              {/* Image Section */}
              <img
                src={imageUrl}
                alt="Seller's Product"
                className="w-full h-56 object-cover"
              />

              {/* Seller Details Section */}
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={sellerPhoto}
                    alt={sellerName}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {sellerName}
                    </h2>
                    <p className="text-sm text-gray-500">{sellerEmail}</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p className="text-sm">
                    <span className="font-semibold">Mobile:</span> {mobile}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Reason:</span> {reason}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Address:</span> {address}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Other Details:</span>{" "}
                    {other}
                  </p>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="mt-6 flex justify-between p-6">
                <Link to={`/updated-seller/${sellerData._id}`}>
                  <button
                    className="px-5  py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    edit
                  </button>
                </Link>
                <button
                  onClick={() => {
                    handleDelete(sellerData._id);
                  }}
                  className="px-4  py-2 text-white bg-gradient-to-r from-red-500 to-red-500 rounded-md transition-all duration-500 ease-in-out
                  border-2 border-transparent hover:bg-red-600 hover:border-red-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SellerRequest;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import { MdDeleteForever } from "react-icons/md";

// Define the types for user
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const ManageUsers: React.FC = () => {
  const axiosSecure = UseAxiosSecure();
  const { data: users = [], refetch, isLoading, } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data.data;
    },
  });


  const handleMakeAdmin = (role: string, user: User): void => {
    axiosSecure
      .patch(`/users/role/${user._id}`, { role: role })
      .then((res) => {
        // console.log(res.data);
        if (res?.data?.data?.modifiedCount > 0) {
          refetch();
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${user.name} is now an ${role}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: `Failed to make ${user.name} an ${role}`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  /* user Delete fun */
  const handleDelete = (user: User): void => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/users/${user._id}`)
          .then((res) => {
            if (res?.data?.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Failed to delete ${user.name}`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const [page, setPage] = useState(1);
  const size = 10;
  
  const totalPages = Math.ceil((users?.length || 0) / size) || 1;
  const paginatedUsers = users?.slice((page - 1) * size, page * size) || [];

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="w-full block px-6 lg:px-16 xl:px-28 2xl:px-40">
      <div className="mb-6">
        <Heading title={"Manage Users"} subtitle={""} />
      </div>

      <div className="w-full block bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 mb-8 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-blue-50/80 border-b border-blue-100 uppercase tracking-wider text-blue-800 text-xs font-bold">
                <th className="py-4 px-6 md:px-8">SL</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6 text-center">Host</th>
                <th className="py-4 px-6 text-center">Admin</th>
                <th className="py-4 px-6 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user: User, index: number) => (
                <tr key={user._id} className="hover:bg-blue-50/30 transition-colors duration-200">
                  <td className="py-4 px-6 md:px-8 text-sm font-medium text-gray-500">
                    {index + 1 + (page - 1) * size}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                    {user.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-medium">
                    {user.role === "Host" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Host</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin("Host", user)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 focus:outline-none"
                        title="Make Host"
                      >
                        <FaUsers className="text-xl" />
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-medium">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">Admin</span>
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin("admin", user)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 focus:outline-none"
                        title="Make Admin"
                      >
                        <FaUsers className="text-xl" />
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(user)}
                      className="inline-flex justify-center items-center w-8 h-8 text-lg text-gray-400 bg-gray-50 rounded-lg hover:text-red-600 hover:bg-red-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      title="Delete User"
                    >
                      <MdDeleteForever />
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
            ${
              page <= 1
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:-translate-x-1"
            }`}
            disabled={page <= 1}
            onClick={() => setPage((prev: number) => prev - 1)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Previous
          </button>

          <div className="flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-blue-50/50 text-blue-800 border border-blue-100 rounded-xl shadow-sm">
            Page <span className="font-extrabold mx-1.5">{page}</span> of <span className="font-bold ml-1.5">{totalPages}</span>
          </div>

          <button
            className={`flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl shadow-sm border
            ${
              page >= totalPages
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:translate-x-1"
            }`}
            disabled={page >= totalPages}
            onClick={() => setPage((prev: number) => prev + 1)}
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

      </div>
    </div>
  );
};
export default ManageUsers;

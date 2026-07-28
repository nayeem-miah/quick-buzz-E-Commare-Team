/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FiEdit, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";

import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import { ApprovalStatus } from "../../../constants/enums";
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

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(params.get("category") || "all");

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter]);

  /* Fetch products with pagination, search, and filters */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", categoryFilter, statusFilter, debouncedSearch, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/products?category=${categoryFilter}&status=${statusFilter}&search=${debouncedSearch}&page=${page}&size=${size}`
      );
      return res.data;
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categoryData?.data?.map((cat: any) => ({ value: cat.name, label: cat.name })) || [])
  ];

  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  // handle delete
  const handleDelete = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/products/${id}`).then((res) => {
          if (res.data.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Product has been deleted.",
              icon: "success",
              confirmButtonColor: "#f97316"
            });
          }
        });
      }
    });
  };

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
      }
    });
  };

  const handleDetailsClick = (listing: Listing) => {
    setSelectedBooking(listing);
  };
  const closeModal = () => {
    setSelectedBooking(null);
  };



  return (
    <div className="min-h-screen bg-gray-50/50 p-4 lg:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Products</h1>
            <p className="text-gray-500 mt-1 text-sm">View, approve, and manage all platform products.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/host-add-product')}
            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-orange-500/30 hover:bg-orange-600 transition-all duration-300"
          >
            <FiPlus size={18} /> Add New Product
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by title or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-300 text-sm"
            />
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <CustomDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
            />
            
            <CustomDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Statuses" },
                { value: ApprovalStatus.APPROVED, label: "Approved" },
                { value: ApprovalStatus.PENDING, label: "Pending" },
                { value: ApprovalStatus.REJECTED, label: "Rejected" }
              ]}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <LoadingSpinner smallHeight={true} />
          ) : products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mb-4">
                <FiSearch size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-gray-500 max-w-sm mt-2 text-sm">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={() => { setSearch(""); setCategoryFilter("all"); setStatusFilter("all"); }}
                className="mt-6 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="py-4 px-6 font-semibold rounded-tl-2xl">Product</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Price</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold text-right rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {products.map((listing: Listing) => (
                      <tr key={listing._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                              <img src={listing?.productImage} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{listing?.productTitle.slice(0, 30)}{listing.productTitle.length > 30 ? '...' : ''}</p>
                              <p className="text-xs text-gray-500">{listing?.brandName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{listing?.category}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">${listing?.price}</td>
                        <td className="py-4 px-6">
                          {listing?.adminIsApproved === ApprovalStatus.APPROVED ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                              Approved
                            </span>
                          ) : listing?.adminIsApproved === ApprovalStatus.REJECTED ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                              Rejected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproved(listing)}
                              className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 shadow-sm rounded-full transition-all duration-300 hover:bg-orange-100"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDetailsClick(listing)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/dashboard/update-product/${listing._id}`)}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(listing?._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4 p-4">
                {products.map((listing: Listing) => (
                  <div key={listing._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                        <img src={listing?.productImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 line-clamp-2">{listing?.productTitle}</h4>
                        <p className="text-sm text-gray-500">{listing?.brandName}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">${listing?.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                      <div>
                        {listing?.adminIsApproved === ApprovalStatus.APPROVED ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-600">Approved</span>
                        ) : (
                          <button onClick={() => handleApproved(listing)} className="px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-50 rounded-md">Approve</button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDetailsClick(listing)} className="p-2 bg-gray-50 text-gray-500 rounded-lg"><FiEye size={16} /></button>
                        <button onClick={() => navigate(`/dashboard/update-product/${listing._id}`)} className="p-2 bg-gray-50 text-gray-500 rounded-lg"><FiEdit size={16} /></button>
                        <button onClick={() => handleDelete(listing?._id)} className="p-2 bg-gray-50 text-red-500 rounded-lg"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={isLoading || page <= 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={isLoading || page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeModal}>
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 aspect-square md:aspect-auto">
                <img src={selectedBooking.productImage} alt={selectedBooking.productTitle} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {selectedBooking?.category}
                </span>
              </div>

              <div className="space-y-6 text-gray-700 text-sm">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedBooking?.productTitle}</h4>
                  <p className="text-orange-500 font-medium">{selectedBooking?.brandName}</p>
                </div>

                <div className="text-3xl font-extrabold text-gray-900">
                  ${selectedBooking?.price}
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={selectedBooking?.hostPhoto || "https://via.placeholder.com/150"}
                    alt={selectedBooking?.hostName}
                  />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Seller</p>
                    <p className="font-bold text-gray-900">{selectedBooking?.hostName}</p>
                    <p className="text-gray-500 text-xs">{selectedBooking?.hostEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
                    <span className={`font-bold capitalize ${
                      selectedBooking?.adminIsApproved === ApprovalStatus.APPROVED ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {selectedBooking?.adminIsApproved || 'Pending'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Tags</p>
                    <span className="font-semibold text-gray-800">{selectedBooking?.tags || 'N/A'}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900 mb-2">Description</h5>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedBooking?.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageBookings;

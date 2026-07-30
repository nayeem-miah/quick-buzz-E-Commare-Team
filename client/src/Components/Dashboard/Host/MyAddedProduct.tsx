import React, { useState } from "react";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/UseAuth";
import LoadingSpinner from "../../../Shared/Loading";
import { Link } from "react-router-dom";
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Plus, 
  Inbox
} from 'lucide-react';
import { ApprovalStatus } from "../../../constants/enums";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";

interface Listing {
  _id: string;
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
  quantity?: number;
  createdAt?: string;
  feedback?: string;
  rejectionReason?: string;
}

const MyAddedProduct: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Listing | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: productsData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allProduct", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/host-product/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const products: Listing[] = productsData || [];

  // Handle delete
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // Soft orange matching theme
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic.delete(`/pro/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success",
              confirmButtonColor: "#f97316"
            });
          }
        });
      }
    });
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  // Filter listings
  const filteredListings = products.filter((item: Listing) => {
    const matchesSearch = 
      (item.productTitle?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.brandName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (item.category?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "approve" && item.adminIsApproved === ApprovalStatus.APPROVED) ||
      (statusFilter === "pending" && item.adminIsApproved === ApprovalStatus.PENDING) ||
      (statusFilter === "rejected" && item.adminIsApproved === ApprovalStatus.REJECTED);

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div className="text-center py-10 text-red-500 font-semibold">Error loading listings...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-white/50 min-h-screen">
      {/* Title & Add Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">My Listings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage and track your submitted store products</p>
        </div>
        <Link
          to="/dashboard/host-add-product"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by title, brand, or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-white transition-all duration-200"
          />
        </div>
        {/* Filter Dropdown */}
        <div className="w-full sm:w-48">
          <CustomDropdown
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "approve", label: "Approved" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {/* Listings Section */}
      {filteredListings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-100 rounded-2xl shadow-sm text-center">
          <span className="p-3 bg-orange-50 rounded-full text-orange-500 mb-3">
            <Inbox className="w-6 h-6" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">No listings found</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto px-4">
            We couldn't find any products matching your search or filters. Try adjusting them or add a new listing.
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="mt-4 text-xs font-semibold text-orange-500 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">Product</th>
                    <th className="py-4 px-6 text-left">Category</th>
                    <th className="py-4 px-6 text-right">Price</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {paginatedListings.map((listing: Listing) => (
                    <tr key={listing._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={listing.productImage}
                            alt={listing.productTitle}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{listing.productTitle}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Brand: <span className="font-medium text-slate-600">{listing.brandName || "No Brand"}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-left font-medium text-slate-500">
                        {listing.category}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-900">
                        ৳{listing.price?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-semibold ${
                          listing.adminIsApproved === ApprovalStatus.APPROVED
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : listing.adminIsApproved === ApprovalStatus.PENDING
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {listing.adminIsApproved === ApprovalStatus.APPROVED ? 'Approved' : listing.adminIsApproved === ApprovalStatus.PENDING ? 'Pending' : 'Rejected'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(listing)}
                            className="inline-flex items-center gap-1 p-2 rounded-lg border border-slate-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200"
                            title="Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/dashboard/update-product/${listing._id}`}
                            className="inline-flex items-center gap-1 p-2 rounded-lg border border-slate-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(listing._id)}
                            className="inline-flex items-center gap-1 p-2 rounded-lg border border-slate-100 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedListings.map((listing: Listing) => (
              <div key={listing._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex gap-3">
                  <img
                    src={listing.productImage}
                    alt={listing.productTitle}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-100 bg-slate-50"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2">{listing.productTitle}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                      <span>Brand: <span className="font-medium text-slate-600">{listing.brandName || "No Brand"}</span></span>
                      <span>Cat: <span className="font-medium text-slate-600">{listing.category}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-50 pt-3 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Price</p>
                    <p className="font-bold text-slate-900 mt-0.5">৳{listing.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      listing.adminIsApproved === ApprovalStatus.APPROVED
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : listing.adminIsApproved === ApprovalStatus.PENDING
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {listing.adminIsApproved === ApprovalStatus.APPROVED ? 'Approved' : listing.adminIsApproved === ApprovalStatus.PENDING ? 'Pending' : 'Rejected'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(listing)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200 text-xs font-semibold text-slate-600"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <Link
                    to={`/dashboard/update-product/${listing._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-200 text-xs font-semibold text-slate-600"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(listing._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg border border-slate-100 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200 text-xs font-semibold text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs">
              <p className="text-slate-400">
                Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(startIndex + itemsPerPage, filteredListings.length)}
                </span>{" "}
                of <span className="font-semibold text-slate-700">{filteredListings.length}</span> listings
              </p>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white font-medium transition duration-200"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-semibold transition duration-200 ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-sm"
                        : "border border-slate-100 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white font-medium transition duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-4 overflow-hidden border border-slate-100 shadow-xl text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Product Details
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">ID: <span className="font-mono text-slate-600">{selectedBooking._id}</span></p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-900 transition-colors"
                onClick={closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Larger Image */}
                <div className="aspect-square w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                  <img
                    src={selectedBooking.productImage}
                    alt={selectedBooking.productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Side: Key Metadata */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{selectedBooking.productTitle}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Brand: <span className="font-semibold text-slate-600">{selectedBooking.brandName || "No Brand"}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Category</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedBooking.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Price</p>
                      <p className="font-bold text-slate-900 mt-0.5">৳{selectedBooking.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Stock / Quantity</p>
                      <p className="font-semibold text-slate-700 mt-0.5">{selectedBooking.quantity !== undefined ? selectedBooking.quantity : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Created Date</p>
                      <p className="font-medium text-slate-700 mt-0.5">
                        {selectedBooking.createdAt 
                          ? new Date(selectedBooking.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) 
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Approval Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      selectedBooking.adminIsApproved === ApprovalStatus.APPROVED
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : selectedBooking.adminIsApproved === ApprovalStatus.PENDING
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {selectedBooking.adminIsApproved === ApprovalStatus.APPROVED
                        ? 'Approved'
                        : selectedBooking.adminIsApproved === ApprovalStatus.PENDING
                          ? 'Pending Approval'
                          : 'Rejected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* If Rejected: Rejection Reason */}
              {selectedBooking.adminIsApproved === ApprovalStatus.REJECTED && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <p className="text-[9px] text-rose-500 font-semibold uppercase tracking-wider">Rejection Reason</p>
                  <p className="text-rose-700 font-medium mt-1 leading-relaxed">
                    {selectedBooking.feedback || selectedBooking.rejectionReason || "This product request was rejected by admin. Please update the details and submit again."}
                  </p>
                </div>
              )}

              {/* Tags Section */}
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Tags</p>
                <p className="text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/50 font-medium">
                  {selectedBooking.tags || "No tags specified"}
                </p>
              </div>

              {/* Description Section */}
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Description</p>
                <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100/50 font-normal">
                  {selectedBooking.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Footer Buttons: Edit & Delete */}
            <div className="flex gap-3 border-t border-slate-100 pt-4 mt-6">
              <Link
                to={`/dashboard/update-product/${selectedBooking._id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm hover:shadow transition duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Product</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleDelete(selectedBooking._id);
                  closeModal();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-100 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold shadow-sm transition duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedProduct;

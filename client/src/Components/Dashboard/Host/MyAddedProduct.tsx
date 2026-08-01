import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import { ApprovalStatus } from "../../../constants/enums";
import { HostListingsHeader } from "./components/HostListingsHeader";
import { HostListingsStats } from "./components/HostListingsStats";
import { HostListingsFilters } from "./components/HostListingsFilters";
import { HostListingsTable } from "./components/HostListingsTable";
import { HostListingsCards } from "./components/HostListingsCards";
import { HostListingsModal } from "./components/HostListingsModal";
import Pagination from "../../../Shared/Pagination/Pagination";
import { Package } from "lucide-react";

export interface Listing {
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

  // Summary counts
  const totalListings = products.length;
  const approvedCount = products.filter((p: Listing) => p.adminIsApproved === ApprovalStatus.APPROVED).length;
  const pendingCount = products.filter((p: Listing) => p.adminIsApproved === ApprovalStatus.PENDING).length;
  const rejectedCount = products.filter((p: Listing) => p.adminIsApproved === ApprovalStatus.REJECTED).length;

  // Handle delete
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
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
              confirmButtonColor: "#f97316",
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
  if (isError)
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        Error loading listings...
      </div>
    );

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <HostListingsHeader />

      {/* Summary Stat Cards */}
      <HostListingsStats
        totalListings={totalListings}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
        rejectedCount={rejectedCount}
      />

      {/* Search & Filter Controls */}
      <HostListingsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onFilterChange={() => setCurrentPage(1)}
      />

      {/* Listings Section */}
      {filteredListings.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl shadow-sm text-center">
          <span className="p-3 bg-orange-50 rounded-xl text-orange-500 mb-3">
            <Package className="w-6 h-6" />
          </span>
          <h3 className="text-sm font-bold text-gray-800">No listings found</h3>
          <p className="text-xs text-gray-400 max-w-sm mt-1 mx-auto px-4">
            We couldn't find any products matching your search or filters. Try adjusting them or add a new listing.
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition border border-orange-100"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <HostListingsTable
            listings={paginatedListings}
            onSelectBooking={setSelectedBooking}
            onDelete={handleDelete}
          />

          {/* Mobile Card View */}
          <HostListingsCards
            listings={paginatedListings}
            onSelectBooking={setSelectedBooking}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
            size={itemsPerPage}
            totalItems={filteredListings.length}
          />
        </>
      )}

      {/* Details Modal */}
      <HostListingsModal
        selectedBooking={selectedBooking}
        onClose={closeModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyAddedProduct;

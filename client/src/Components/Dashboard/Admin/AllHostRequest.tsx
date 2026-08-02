/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FiInbox, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/UsePublic";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import Pagination from "../../../Shared/Pagination/Pagination";

// Subcomponents
import { SellerRequestDetailsModal } from "./components/SellerRequestDetailsModal";
import { SellerRequestsCards } from "./components/SellerRequestsCards";
import { SellerRequestsTable } from "./components/SellerRequestsTable";


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
  adminIsApproved: string;
  decline?: string;
}

const STATUS_FILTERS = [
  { value: "All", label: "All Requests" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Declined", label: "Declined" }
];

const AllHostRequest: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const [selectedSeller, setSelectedSeller] = useState<SellerDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const size = 10;

  // get host request data
  const {
    data: sellerData = [],
    isLoading,
    refetch,
  } = useQuery<SellerDetails[]>({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get("/seller");
      return res.data.data;
    },
  });

  const handleApprove = (seller: SellerDetails) => {
    Swal.fire({
      title: "Approve Seller?",
      text: `Are you sure you want to approve ${seller.sellerName} as a seller? This will update their role and send them an approval email.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, Approve",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await axiosPublic.patch(`/seller/approve/${seller._id}`);
          if (!res.data?.success) {
            throw new Error("Failed to approve");
          }
          return res.data;
        } catch (error: any) {
          Swal.showValidationMessage(`Request failed: ${error.message || error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        refetch();
        setSelectedSeller(null);
        Swal.fire({
          title: "Approved!",
          text: `${seller.sellerName} is now a seller. Email sent.`,
          icon: "success",
          confirmButtonColor: "#f97316",
        });
      }
    });
  };

  const handleDecline = (seller: SellerDetails) => {
    Swal.fire({
      title: "Decline Request?",
      text: `Enter the reason for declining ${seller.sellerName}'s request:`,
      input: "textarea",
      inputPlaceholder: "Reason for decline...",
      inputAttributes: {
        "aria-label": "Reason for decline"
      },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Decline Application",
      showLoaderOnConfirm: true,
      preConfirm: async (inputValue) => {
        if (!inputValue || inputValue.trim() === "") {
          Swal.showValidationMessage("Please enter a reason for decline");
          return false;
        }
        try {
          const res = await axiosPublic.patch(`/seller/decline-message/${seller._id}`, { inputValue });
          if (!res.data?.success) {
            throw new Error("Failed to decline");
          }
          return res.data;
        } catch (error: any) {
          Swal.showValidationMessage(`Request failed: ${error.message || error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        refetch();
        setSelectedSeller(null);
        Swal.fire({
          title: "Declined!",
          text: "Application has been declined and email sent to user.",
          icon: "success",
          confirmButtonColor: "#f97316"
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this seller application record!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await axiosPublic.delete(`/seller/${id}`);
          const count = res.data.data?.deletedCount ?? res.data?.deletedCount ?? 0;
          if (count === 0) {
            throw new Error("Record not found or already deleted");
          }
          return res.data;
        } catch (error: any) {
          Swal.showValidationMessage(`Request failed: ${error.message || error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Seller application record deleted.",
          icon: "success",
          confirmButtonColor: "#f97316",
        });
      }
    });
  };

  const handleDetailsClick = (seller: SellerDetails) => {
    setSelectedSeller(seller);
  };

  const closeModal = () => {
    setSelectedSeller(null);
  };

  const filteredSellers = useMemo(() => {
    const sellers = Array.isArray(sellerData) ? sellerData : [];
    return sellers.filter((seller) => {
      // Search by Name or Email
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        seller.sellerName?.toLowerCase().includes(searchLower) ||
        seller.sellerEmail?.toLowerCase().includes(searchLower);

      // Filter by Status
      const isApproved = seller.adminIsApproved === "Approved";
      const isDeclined = seller.adminIsApproved === "Declined" || (seller.decline ? seller.decline.trim().length > 0 : false);
      const isPending = !isApproved && !isDeclined;

      let matchesStatus = true;
      if (statusFilter !== "All") {
        if (statusFilter === "Approved") matchesStatus = isApproved;
        else if (statusFilter === "Declined") matchesStatus = isDeclined;
        else if (statusFilter === "Pending") matchesStatus = isPending;
      }

      return matchesSearch && matchesStatus;
    });
  }, [sellerData, searchQuery, statusFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredSellers.length / size) || 1;
  const paginatedSellers = filteredSellers.slice((page - 1) * size, page * size);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full block px-4 md:px-8 lg:px-12 xl:px-20 py-8">
      <div className="mb-8">
        <Heading title={"All Seller Requests"} subtitle={"Manage and verify applicant seller requests and documents."} />
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-150 mb-8">
        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex w-full sm:w-80 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-455 text-base" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto z-20">
            <CustomDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={STATUS_FILTERS}
              className="w-full sm:w-40"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredSellers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <FiInbox className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No seller requests found</h3>
            <p className="text-sm text-gray-550 max-w-sm">
              We couldn't find any seller requests matching your search or filters.
            </p>
            {(searchQuery || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
                className="mt-5 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <SellerRequestsTable
              sellers={paginatedSellers}
              onDetailsClick={handleDetailsClick}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onDelete={handleDelete}
            />

            <SellerRequestsCards
              sellers={paginatedSellers}
              onDetailsClick={handleDetailsClick}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onDelete={handleDelete}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              size={size}
              totalItems={filteredSellers.length}
            />
          </>
        )}
      </div>

      {selectedSeller && (
        <SellerRequestDetailsModal
          seller={selectedSeller}
          onClose={closeModal}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default AllHostRequest;

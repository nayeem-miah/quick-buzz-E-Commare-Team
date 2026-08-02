/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiInbox, FiSearch, FiX } from "react-icons/fi";
import useAxiosPublic from "../../../Hooks/UsePublic";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import Pagination from "../../../Shared/Pagination/Pagination";

// Subcomponents
import { AllHostRequestsStats } from "./components/AllHostRequestsStats";
import { SellerRequestDetailsModal } from "./components/SellerRequestDetailsModal";
import { SellerRequestsCards } from "./components/SellerRequestsCards";
import { SellerRequestsTable } from "./components/SellerRequestsTable";


export interface SellerDetails {
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

  // Custom confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "approve" | "decline" | "delete";
    seller: SellerDetails;
    declineReason?: string;
    loading?: boolean;
  } | null>(null);

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
    setConfirmDialog({
      type: "approve",
      seller,
    });
  };

  const handleDecline = (seller: SellerDetails) => {
    setConfirmDialog({
      type: "decline",
      seller,
      declineReason: "",
    });
  };

  const handleDelete = (id: string) => {
    const seller = sellerData.find((s) => String(s._id) === id);
    if (!seller) return;
    setConfirmDialog({
      type: "delete",
      seller,
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

      {/* Host Applications Stats */}
      <div className="mb-8">
        <AllHostRequestsStats requests={sellerData} />
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-155 mb-8">
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

      {confirmDialog && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-6 w-full max-w-md overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {confirmDialog.type === "approve" && "Approve Seller"}
                  {confirmDialog.type === "decline" && "Decline Request"}
                  {confirmDialog.type === "delete" && "Delete Application Record"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Seller: {confirmDialog.seller.sellerName}
                </p>
              </div>
              <button
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setConfirmDialog(null)}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="py-5 text-sm text-slate-600 space-y-4">
              {confirmDialog.type === "approve" && (
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to approve <strong className="text-slate-900">{confirmDialog.seller.sellerName}</strong> as a seller? This will update their role and send them an approval email.
                </p>
              )}

              {confirmDialog.type === "delete" && (
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900">{confirmDialog.seller.sellerName}</strong>'s seller application record? This action cannot be undone.
                </p>
              )}

              {confirmDialog.type === "decline" && (
                <div className="space-y-2">
                  <p className="text-slate-600 leading-relaxed">
                    Enter the reason for declining <strong className="text-slate-900">{confirmDialog.seller.sellerName}</strong>'s request:
                  </p>
                  <textarea
                    className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-800 placeholder-slate-400"
                    placeholder="Reason for decline (e.g. invalid document, missing information)..."
                    value={confirmDialog.declineReason || ""}
                    onChange={(e) => setConfirmDialog({ ...confirmDialog, declineReason: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition"
                disabled={confirmDialog.loading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (confirmDialog.type === "decline" && (!confirmDialog.declineReason || !confirmDialog.declineReason.trim())) {
                    toast.error("Please enter a reason for declining the application.");
                    return;
                  }

                  // Set loading
                  setConfirmDialog(prev => prev ? { ...prev, loading: true } : null);
                  const loadToast = toast.loading("Processing request...");

                  try {
                    if (confirmDialog.type === "approve") {
                      const res = await axiosPublic.patch(`/seller/approve/${confirmDialog.seller._id}`);
                      if (res.data?.success) {
                        toast.success(`${confirmDialog.seller.sellerName} has been approved as a seller!`, { id: loadToast });
                        refetch();
                        setSelectedSeller(null);
                        setConfirmDialog(null);
                      } else {
                        throw new Error(res.data?.message || "Failed to approve");
                      }
                    } else if (confirmDialog.type === "decline") {
                      const res = await axiosPublic.patch(`/seller/decline-message/${confirmDialog.seller._id}`, {
                        inputValue: confirmDialog.declineReason
                      });
                      if (res.data?.success) {
                        toast.success("Application has been declined and email sent to user.", { id: loadToast });
                        refetch();
                        setSelectedSeller(null);
                        setConfirmDialog(null);
                      } else {
                        throw new Error(res.data?.message || "Failed to decline");
                      }
                    } else if (confirmDialog.type === "delete") {
                      const res = await axiosPublic.delete(`/seller/${confirmDialog.seller._id}`);
                      const count = res.data.data?.deletedCount ?? res.data?.deletedCount ?? 0;
                      if (count > 0 || res.data?.success) {
                        toast.success("Seller application record deleted successfully.", { id: loadToast });
                        refetch();
                        setConfirmDialog(null);
                      } else {
                        throw new Error("Record not found or already deleted");
                      }
                    }
                  } catch (error: any) {
                    toast.error(`Request failed: ${error.message || error}`, { id: loadToast });
                    setConfirmDialog(prev => prev ? { ...prev, loading: false } : null);
                  }
                }}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 ${
                  confirmDialog.type === "approve"
                    ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
                    : "bg-red-500 hover:bg-red-600 shadow-red-500/10"
                }`}
                disabled={confirmDialog.loading}
              >
                {confirmDialog.loading ? "Processing..." : (
                  confirmDialog.type === "approve" ? "Approve" :
                  confirmDialog.type === "decline" ? "Decline" : "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllHostRequest;


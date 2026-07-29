import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FiInbox, FiSearch } from "react-icons/fi";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import CustomDropdown from "../../../Shared/Dropdown/CustomDropdown";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import Pagination from "../../../Shared/Pagination/Pagination";

import { PaymentHistory } from "../../../types/payment";
import { PaymentStatus } from "../../../constants/enums";

// Subcomponents
import { AllPaymentHistoryTable } from "./components/AllPaymentHistoryTable";
import { AllPaymentHistoryCards } from "./components/AllPaymentHistoryCards";
import { PaymentDetailsModal } from "./components/PaymentDetailsModal";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" }
];

const METHOD_OPTIONS = [
  { value: "All", label: "All Methods" },
  { value: "SSLCommerz", label: "SSLCommerz" },
  { value: "Cash on Delivery", label: "Cash on Delivery" }
];

const AllPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const size = 10;
  const axiosSecure = UseAxiosSecure();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrx(trxId);
    import("react-hot-toast").then((m) => m.default.success("Transaction ID copied to clipboard!")).catch(console.error);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const formatDate = (dateStr?: string | number | Date) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const { data: PaymentHistoryData = [], isLoading, refetch } = useQuery({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data.data;
    },
  });

  const handleDetailsClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  const handleMarkAsPaid = (payment: PaymentHistory) => {
    import("sweetalert2").then((Swal) => {
      Swal.default.fire({
        title: "Confirm Payment?",
        text: "Are you sure you want to mark this Cash on Delivery order as Paid?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark as Paid!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.patch(`/payments/${payment._id}/status`, { status: PaymentStatus.SUCCESS });
            Swal.default.fire({
              title: "Paid!",
              text: "Payment has been marked as successful.",
              icon: "success",
              confirmButtonColor: "#f97316",
            });
            refetch();
          } catch (error) {
            console.error(error);
            Swal.default.fire("Error", "Failed to update payment status.", "error");
          }
        }
      });
    }).catch(console.error);
  };

  const filteredPayments = useMemo(() => {
    return PaymentHistoryData.filter((payment: PaymentHistory) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        payment.cus_name?.toLowerCase().includes(searchLower) ||
        payment.cus_email?.toLowerCase().includes(searchLower) ||
        payment.transactionId?.toLowerCase().includes(searchLower);

      let matchesStatus = true;
      if (statusFilter !== "All") {
        const isPaid = payment.status === PaymentStatus.SUCCESS;
        matchesStatus = statusFilter === "Paid" ? isPaid : !isPaid;
      }

      let matchesMethod = true;
      if (methodFilter !== "All") {
        const payMethod = payment.payment_method || "Card";
        matchesMethod = payMethod.toLowerCase() === methodFilter.toLowerCase();
      }

      let matchesDate = true;
      if (dateFilter) {
        const paymentDateStr = new Date(payment.date || payment.tran_date || "").toDateString();
        const filterDateStr = new Date(dateFilter).toDateString();
        matchesDate = paymentDateStr === filterDateStr;
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [PaymentHistoryData, searchQuery, statusFilter, methodFilter, dateFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, methodFilter, dateFilter]);

  const totalPages = Math.ceil(filteredPayments.length / size) || 1;
  const paginatedPayments = filteredPayments.slice((page - 1) * size, page * size);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full block px-4 md:px-8 lg:px-12 xl:px-20 py-8">
      <div className="mb-8">
        <Heading title={"All Payment History"} subtitle={"View, sort, filter and verify customer transaction histories."} />
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-150 mb-8">
        {/* Filter Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center bg-white">
          <div className="flex w-full xl:w-80 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-455 text-base" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or trx ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto z-20">
            <CustomDropdown
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={STATUS_OPTIONS}
              className="w-full sm:w-40"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />
            
            <CustomDropdown
              value={methodFilter}
              onChange={(val) => setMethodFilter(val)}
              options={METHOD_OPTIONS}
              className="w-full sm:w-44"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />

            <div className="relative w-full sm:w-44">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter("")}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-orange-500"
                  title="Clear Date"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <FiInbox className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No payments found</h3>
            <p className="text-sm text-gray-550 max-w-sm">
              We couldn't find any transactions matching your parameters.
            </p>
            {(searchQuery || statusFilter !== "All" || methodFilter !== "All" || dateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                  setMethodFilter("All");
                  setDateFilter("");
                }}
                className="mt-5 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <AllPaymentHistoryTable
              payments={paginatedPayments}
              formatDate={formatDate}
              onDetailsClick={handleDetailsClick}
              onMarkAsPaid={handleMarkAsPaid}
              page={page}
              size={size}
            />

            <AllPaymentHistoryCards
              payments={paginatedPayments}
              formatDate={formatDate}
              onDetailsClick={handleDetailsClick}
              onMarkAsPaid={handleMarkAsPaid}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              size={size}
              totalItems={filteredPayments.length}
            />
          </>
        )}
      </div>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={closeModal}
          formatDate={formatDate}
          onCopyTrx={handleCopyTrx}
          copiedTrx={copiedTrx}
        />
      )}
    </div>
  );
};

export default AllPaymentHistory;

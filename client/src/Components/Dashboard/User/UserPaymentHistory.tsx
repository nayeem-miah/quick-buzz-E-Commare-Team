/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FiCreditCard, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import { PaymentHistory } from "../../../types/payment";
import { PaymentStatus } from "../../../constants/enums";
import { PaymentHistoryFilters } from "./components/PaymentHistoryFilters";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { PaymentHistoryCards } from "./components/PaymentHistoryCards";
import { PaymentDetailsModal } from "./components/PaymentDetailsModal";

const UserPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: PaymentHistoryData = [], isLoading } = useQuery({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/${user?.email}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleDetailsClick = (payment: PaymentHistory) => setSelectedPayment(payment);
  const closeModal = () => setSelectedPayment(null);
  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrx(trxId);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const formatDate = (dateStr?: string | number | Date) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredPayments = PaymentHistoryData.filter((payment: PaymentHistory) => {
    const matchesSearch = !searchQuery || (payment.transactionId && payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      (payment.date && String(payment.date).startsWith(dateFilter)) ||
      (payment.tran_date && String(payment.tran_date).startsWith(dateFilter));
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Summary stats
  const totalPayments = PaymentHistoryData.length;
  const paidCount = PaymentHistoryData.filter((p: PaymentHistory) => p.status === PaymentStatus.SUCCESS).length;
  const pendingCount = PaymentHistoryData.filter((p: PaymentHistory) => p.status === PaymentStatus.PENDING).length;
  const failedCount = PaymentHistoryData.filter((p: PaymentHistory) => p.status === PaymentStatus.FAILED).length;

  return (
    <div className="w-full px-4 md:px-8 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Payment History</h1>
          <p className="text-sm text-gray-500 mt-1">Review your recent transaction records and order status</p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Payments", value: totalPayments, icon: <FiCreditCard size={20} />, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Paid", value: paidCount, icon: <FiCheckCircle size={20} />, color: "text-green-500", bg: "bg-green-50" },
          { label: "Pending", value: pendingCount, icon: <FiClock size={20} />, color: "text-yellow-500", bg: "bg-yellow-50" },
          { label: "Failed", value: failedCount, icon: <FiXCircle size={20} />, color: "text-red-500", bg: "bg-red-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className={`p-2.5 sm:p-3 ${stat.bg} ${stat.color} rounded-xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider truncate">{stat.label}</p>
              <p className="text-base sm:text-xl font-black text-gray-950 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {PaymentHistoryData.length === 0 ? (
        <NoData />
      ) : (
        <div className="space-y-6">
          <PaymentHistoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          {filteredPayments.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-sm text-gray-400 font-semibold">No matching transactions found.</p>
              <button
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); setDateFilter(""); }}
                className="mt-4 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition border border-orange-100"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <PaymentHistoryTable
                payments={filteredPayments}
                onDetailsClick={handleDetailsClick}
                formatDate={formatDate}
              />
              <PaymentHistoryCards
                payments={filteredPayments}
                onDetailsClick={handleDetailsClick}
                formatDate={formatDate}
              />
              <p className="text-xs text-gray-400 text-right">
                Showing <span className="font-bold text-gray-600">{filteredPayments.length}</span> of{" "}
                <span className="font-bold text-gray-600">{totalPayments}</span> transactions
              </p>
            </>
          )}
        </div>
      )}

      <PaymentDetailsModal
        payment={selectedPayment}
        onClose={closeModal}
        formatDate={formatDate}
        copiedTrx={copiedTrx}
        onCopyTrx={handleCopyTrx}
      />
    </div>
  );
};

export default UserPaymentHistory;

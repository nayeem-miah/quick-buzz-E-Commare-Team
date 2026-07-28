/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";

import { PaymentHistory } from "../../../types/payment";
import { PaymentHistoryFilters } from "./components/PaymentHistoryFilters";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { PaymentHistoryCards } from "./components/PaymentHistoryCards";
import { PaymentDetailsModal } from "./components/PaymentDetailsModal";

const UserPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: PaymentHistoryData = [], isLoading } = useQuery({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/payments/${user?.email}`
      );
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleDetailsClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrx(trxId);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const formatDate = (dateStr: any) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const filteredPayments = PaymentHistoryData.filter((payment: any) => {
    const matchesSearch = !searchQuery || (payment.transactionId && payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesDate = !dateFilter || (payment.date && payment.date.startsWith(dateFilter)) || (payment.tran_date && payment.tran_date.startsWith(dateFilter));
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Payment History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your recent transaction records and order status
        </p>
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

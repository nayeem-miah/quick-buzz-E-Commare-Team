/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiCopy } from "react-icons/fi";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Heading from "../../../Shared/Heading/Heading";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";

import { PaymentHistory } from "../../../types/payment";
import { PaymentStatus, ApprovalStatus } from "../../../constants/enums";
const AllPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const axiosSecure = UseAxiosSecure();

  const handleCopyTrx = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrx(trxId);
    toast.success("Transaction ID copied to clipboard!");
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

  const { data: PaymentHistoryData = [], isLoading, refetch } = useQuery({
    queryKey: ["PaymentHistoryData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
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

  const handleMarkAsPaid = (payment: any) => {
    Swal.fire({
      title: "Confirm Payment?",
      text: "Are you sure you want to mark this Cash on Delivery order as Paid?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as Paid!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/payments/${payment._id}/status`, { status: PaymentStatus.SUCCESS });
          Swal.fire({
            title: "Paid!",
            text: "Payment has been marked as successful.",
            icon: "success",
            confirmButtonColor: "#f97316",
          });
          refetch();
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to update payment status.", "error");
        }
      }
    });
  };

  const successfulPayments = PaymentHistoryData || [];
  const [page, setPage] = useState(1);
  const size = 10;
  const totalPages = Math.ceil(successfulPayments.length / size) || 1;
  const paginatedPayments = successfulPayments.slice((page - 1) * size, page * size);

  return (
    <div className="w-full block px-6 lg:px-16 xl:px-28 2xl:px-40">
      <div className="mb-6">
        <Heading title={"All Payment History"} subtitle={""} />
      </div>
      {successfulPayments.length === 0 ? (
        <NoData />
      ) : (
        <div className="w-full block bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 mb-8 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-orange-50/80 border-b border-orange-100 uppercase tracking-wider text-orange-800 text-xs font-bold">
                  <th className="py-4 px-6 md:px-8">ID</th>
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Method</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPayments.map((payment: any, id: number) => (
                  <tr
                    key={payment._id || id}
                    className="hover:bg-orange-50/10 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 md:px-8 text-sm font-medium text-gray-500">
                      {id + 1 + (page - 1) * size}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      {payment?.cus_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {payment?.cus_email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                      {payment?.payment_method || "Card"}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {payment?.status === PaymentStatus.SUCCESS ? (
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full border border-green-200">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                      ${payment?.amount || payment?.totalPrice}
                    </td>
                    <td className="py-4 px-6 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDetailsClick(payment)}
                        className="px-3 py-1.5 text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg font-semibold transition border border-orange-100"
                      >
                        Details
                      </button>
                      {payment?.status === PaymentStatus.PENDING && payment?.payment_method === "Cash on Delivery" && (
                        <button
                          onClick={() => handleMarkAsPaid(payment)}
                          className="px-3 py-1.5 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition shadow-sm shadow-orange-500/10"
                        >
                          Mark as Paid
                        </button>
                      )}
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
                  : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:-translate-x-1"
              }`}
              disabled={page <= 1}
              onClick={() => setPage((prev: number) => prev - 1)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              Previous
            </button>

            <div className="flex items-center justify-center px-5 py-2.5 text-sm font-medium bg-orange-50/50 text-orange-800 border border-orange-100 rounded-xl shadow-sm">
              Page <span className="font-extrabold mx-1.5">{page}</span> of <span className="font-bold ml-1.5">{totalPages}</span>
            </div>

            <button
              className={`flex items-center justify-center px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl shadow-sm border
              ${
                page >= totalPages
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:translate-x-1"
              }`}
              disabled={page >= totalPages}
              onClick={() => setPage((prev: number) => prev + 1)}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

        </div>
      )}

      {/* Modal Component */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl border border-gray-100 shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h3 className="text-lg font-bold text-gray-950">
                Payment Details
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Customer Name</p>
                  <p className="font-bold text-gray-950 mt-0.5">{selectedPayment?.cus_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{selectedPayment?.cus_email || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Date</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{formatDate(selectedPayment?.date || selectedPayment?.tran_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Transaction ID</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="font-bold text-orange-500">{selectedPayment?.transactionId || "N/A"}</p>
                    {selectedPayment?.transactionId && selectedPayment.transactionId !== "N/A" && (
                      <button
                        onClick={() => handleCopyTrx(selectedPayment.transactionId!)}
                        className="text-gray-400 hover:text-orange-500 transition"
                      >
                        {copiedTrx === selectedPayment.transactionId ? (
                          <FiCheck className="text-green-600" size={13} />
                        ) : (
                          <FiCopy size={13} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Amount Paid</p>
                  <p className="font-black text-gray-950 mt-0.5">${selectedPayment?.totalPrice?.toFixed(2)} {selectedPayment?.currency || "USD"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Card Type</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{selectedPayment?.card_type || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Status</p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                      selectedPayment?.status === PaymentStatus.SUCCESS
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {selectedPayment?.status === PaymentStatus.SUCCESS ? "Paid" : "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Approval Status</p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${
                      selectedPayment?.hostIsApproved === ApprovalStatus.APPROVED
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {selectedPayment?.hostIsApproved || "Pending"}
                  </span>
                </div>
              </div>

              {/* Products List */}
              <div className="pt-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Purchased Products</p>
                <div className="space-y-3">
                  {selectedPayment?.productTitle?.map((title: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <img
                        src={selectedPayment?.productImage?.[index] || ""}
                        alt={title || "Product"}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-gray-900 truncate">
                          {title || "Unnamed Product"}
                        </p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                          Brand: {selectedPayment?.brandName?.[index] || "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Host Emails</p>
                <p className="font-semibold text-gray-700 mt-1">{selectedPayment?.hostEmail?.join(", ") || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentHistory;

import React, { ReactNode, useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import { useQuery } from "@tanstack/react-query";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";

interface PaymentHistory {
  date: ReactNode;
  id: number;
  cus_name: string;
  cus_email: string;
  tran_date: string;
  totalPrice: number;
  currency?: string;
  transactionId?: string;
  card_type?: string;
  hostIsApproved?: string;
  productTitle?: string[];
  productImage?: string[];
  brandName?: string[];
  hostEmail?: string[];
  status?: string;
}

const AllPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );
  const axiosSecure = UseAxiosSecure();

  const { data: PaymentHistoryData = [], isLoading } = useQuery({
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

  const successfulPayments = PaymentHistoryData?.filter((payment: PaymentHistory) => payment.status === "success") || [];
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
                <tr className="bg-blue-50/80 border-b border-blue-100 uppercase tracking-wider text-blue-800 text-xs font-bold">
                  <th className="py-4 px-6 md:px-8">ID</th>
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Payment Date</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPayments.map((payment: PaymentHistory, id: number) => (
                  <tr
                    key={payment.transactionId}
                    className="hover:bg-blue-50/30 transition-colors duration-200"
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
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {payment?.date}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-green-600">
                      ${payment?.totalPrice}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDetailsClick(payment)}
                        className="px-4 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 shadow-sm rounded-full transition-all duration-300"
                      >
                        Details
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
      )}

      {/* Modal Component */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 overflow-auto"
          onClick={closeModal} // Close modal when clicking outside
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevents modal content from triggering close
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Payment Details
              </h3>
              <button
                className="absolute top-2 right-2  border-gray-400  p-1 text-gray-600 hover:text-red-500 hover:border-red-500 text-lg sm:text-xl focus:outline-none"
                onClick={closeModal} // Close modal when clicking the "X"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-gray-700">
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">User Name:</span>
                {selectedPayment?.cus_name || "N/A"}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">Email:</span>
                {selectedPayment?.cus_email || "N/A"}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">
                  Payment Date:
                </span>
                {selectedPayment?.tran_date || "N/A"}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">Amount:</span>
                {selectedPayment?.totalPrice || "0"}
                {selectedPayment?.currency || ""}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">
                  Transaction ID:
                </span>
                {selectedPayment?.transactionId || "N/A"}
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">Card Type:</span>
                {selectedPayment?.card_type || "N/A"}
              </p>

              {/* Host Approval Status */}
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">
                  Approval Status:
                </span>
                <span
                  className={`font-semibold ${selectedPayment?.hostIsApproved === "approve"
                      ? "text-green-600"
                      : selectedPayment?.hostIsApproved === "pending"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                >
                  {selectedPayment?.hostIsApproved || "N/A"}
                </span>
              </p>

              {/* Status */}
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">
                  payment Status:{" "}
                </span>
                <span
                  className={`font-semibold ${selectedPayment?.status === "success"
                      ? "text-green-500" // Green for Success
                      : selectedPayment?.status === "Failed"
                        ? "text-red-500" // Red for Failed
                        : "text-yellow-500" // Yellow for Pending or N/A
                    }`}
                >
                  {selectedPayment?.status || "N/A"}
                </span>
              </p>

              {/* Products List */}
              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">Products:</span>
                <ul className="list-disc list-inside space-y-2">
                  {selectedPayment?.productTitle?.map(
                    (title: any, index: any) => (
                      <li key={index} className="flex items-start space-x-3">
                        <img
                          src={selectedPayment?.productImage?.[index] || ""}
                          alt={title || "Product Image"}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            {title || "Unnamed Product"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {selectedPayment?.brandName?.[index] || "No Brand"}
                          </p>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </p>

              <p className="text-sm sm:text-base">
                <span className="font-semibold text-gray-900">
                  Host Emails:
                </span>
                {selectedPayment?.hostEmail?.join(", ") || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentHistory;

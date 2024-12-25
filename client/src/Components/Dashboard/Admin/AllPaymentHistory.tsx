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
      const res = await axiosSecure.get("/payment-history");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const handleDetailsClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  return (
    <div className="overflow-x-auto">
      <Heading title={"All Payment History"} subtitle={""} />
      {PaymentHistoryData?.length === 0 ? (
        <NoData />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-[#b962f2] text-black">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-left">ID</th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  User Name
                </th>

                <th className="py-3 px-4 text-sm font-medium text-left">
                  Email
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Payment Date
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Amount
                </th>
                <th className="py-3 px-4 text-sm font-medium text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {PaymentHistoryData?.map(
                (payment: PaymentHistory, id: number) =>
                  payment.status === "success" && (
                    <tr
                      key={payment.transactionId}
                      className="border-b hover:bg-gray-50 transition duration-300"
                    >
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {(id = id + 1)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment?.cus_name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment?.cus_email}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment?.date}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {payment?.totalPrice}$
                      </td>

                      <td className="py-4 px-4 text-sm">
                        <button
                          onClick={() => handleDetailsClick(payment)}
                          className="px-4 sm:py-0 md:py-2 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
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
                  className={`font-semibold ${
                    selectedPayment?.hostIsApproved === "approve"
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
                  className={`font-semibold ${
                    selectedPayment?.status === "success"
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

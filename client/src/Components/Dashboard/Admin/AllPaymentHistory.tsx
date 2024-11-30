import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";

interface PaymentHistory {
  id: number;
  userName: string;
  paymentDate: string;
  amount: string;
  email: string;
  transactionId: string;
}

const paymentData: PaymentHistory[] = [
  {
    id: 1,
    userName: "John Doe",
    paymentDate: "2024-11-01",
    amount: "$100",
    email: "john.doe@example.com",
    transactionId: "TXN12345",
  },
  {
    id: 2,
    userName: "Jane Smith",
    paymentDate: "2024-11-02",
    amount: "$200",
    email: "jane.smith@example.com",
    transactionId: "TXN12346",
  },
  {
    id: 3,
    userName: "Alice Brown",
    paymentDate: "2024-11-03",
    amount: "$150",
    email: "alice.brown@example.com",
    transactionId: "TXN12347",
  },
];

const AllPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );

  const handleDetailsClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  return (
    <div className="overflow-x-auto">
      <Heading title={"All Payment History"} subtitle={""} />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">ID</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                User Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Payment Date
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Amount
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">Email</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment) => (
              <tr
                key={payment.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  {payment.id}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {payment.userName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {payment.paymentDate}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {payment.amount}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {payment.email}
                </td>
                <td className="py-4 px-4 text-sm">
                  <button
                    onClick={() => handleDetailsClick(payment)}
                    className="text-black shadow-lg  relative md:px-6 md:py-2 lg:py-2 py sm:px-4 lg:px-6  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                    border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

{/* modal  */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-200 ease-in-out"
          onClick={closeModal} // Close modal when clicking outside
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl p-8 w-full max-w-4xl scale-95 opacity-0 transition-all duration-200 ease-out transform hover:scale-100 hover:opacity-100"
            onClick={(e) => e.stopPropagation()} // Prevents modal content from triggering close
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h3 className="text-4xl font-extrabold text-gray-800 tracking-wide">
                Payment Details
              </h3>
              <div
                className="text-gray-600 hover:text-gray-900 cursor-pointer text-2xl"
                onClick={closeModal} // Close modal when clicking the "X"
              >
                ✕
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <span className="font-bold text-gray-900">User Name:</span>
                {selectedPayment.userName}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-900">Email:</span>
                {selectedPayment.email}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-900">Payment Date:</span>{" "}
                {selectedPayment.paymentDate}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-900">Amount:</span>{" "}
                {selectedPayment.amount}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-900">Transaction ID:</span>{" "}
                {selectedPayment.transactionId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentHistory;

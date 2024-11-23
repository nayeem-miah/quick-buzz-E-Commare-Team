import React, { useState } from "react";

interface PaymentHistory {
  id: number;
  userName: string;
  paymentDate: string;
  amount: string;
  email: string;
  transactionId: string;
}

const paymentData: PaymentHistory[] = [
  { id: 1, userName: 'John Doe', paymentDate: '2024-11-01', amount: '$100', email: 'john.doe@example.com', transactionId: 'TXN12345' },
  { id: 2, userName: 'Jane Smith', paymentDate: '2024-11-02', amount: '$200', email: 'jane.smith@example.com', transactionId: 'TXN12346' },
  { id: 3, userName: 'Alice Brown', paymentDate: '2024-11-03', amount: '$150', email: 'alice.brown@example.com', transactionId: 'TXN12347' },
];

const AllPaymentHistory: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);

  const handleDetailsClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">All Payment History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">ID</th>
              <th className="py-3 px-4 text-sm font-medium text-left">User Name</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Payment Date</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Amount</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Email</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50 transition duration-300">
                <td className="py-4 px-4 text-sm text-gray-600">{payment.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{payment.userName}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{payment.paymentDate}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{payment.amount}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{payment.email}</td>
                <td className="py-4 px-4 text-sm">
                  <button
                    onClick={() => handleDetailsClick(payment)}
                    className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedPayment.id}</p>
              <p><strong>User Name:</strong> {selectedPayment.userName}</p>
              <p><strong>Payment Date:</strong> {selectedPayment.paymentDate}</p>
              <p><strong>Amount:</strong> {selectedPayment.amount}</p>
              <p><strong>Email:</strong> {selectedPayment.email}</p>
              <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentHistory;

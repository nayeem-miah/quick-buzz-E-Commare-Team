import React, { useState } from "react";

interface Booking {
  id: number;
  title: string;
  image: string;
  email: string;
  amount: string;
}

const bookingData: Booking[] = [
  {
    id: 1,
    title: "Luxury Villa",
    image: "https://via.placeholder.com/80",
    email: "customer1@example.com",
    amount: "$500",
  },
  {
    id: 2,
    title: "Cozy Apartment",
    image: "https://via.placeholder.com/80",
    email: "customer2@example.com",
    amount: "$300",
  },
  {
    id: 3,
    title: "Beachside Cottage",
    image: "https://via.placeholder.com/80",
    email: "customer3@example.com",
    amount: "$450",
  },
];

const AdminManageBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleDetailsClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Manage Bookings
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-4 text-sm font-medium text-left">Title</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Image</th>
              <th className="py-3 px-4 text-sm font-medium text-left">Email</th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Amount
              </th>
              <th className="py-3 px-4 text-sm font-medium text-left">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {bookingData.map((booking) => (
              <tr
                key={booking.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-4 px-4 text-sm text-gray-600">
                  {booking.title}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {booking.email}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {booking.amount}
                </td>
                <td className="py-4 px-4 text-sm">
                  <button
                    onClick={() => handleDetailsClick(booking)}
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
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Booking Details
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Title:</strong> {selectedBooking.title}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.email}
              </p>
              <p>
                <strong>Amount:</strong> {selectedBooking.amount}
              </p>
              <div>
                <strong>Image:</strong>
                <img
                  src={selectedBooking.image}
                  alt={selectedBooking.title}
                  className="w-full h-48 object-cover mt-2 rounded-md"
                />
              </div>
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

export default AdminManageBookings;

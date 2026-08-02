/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Truck, X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";
import NoData from "../../../Shared/NoDataFound/NoData";
import Pagination from "../../../Shared/Pagination/Pagination";
import { ApprovalStatus } from "../../../constants/enums";
import { HostOrdersCards } from "./components/HostOrdersCards";
import { HostOrdersFilters } from "./components/HostOrdersFilters";
import { HostOrdersStats } from "./components/HostOrdersStats";
import { HostOrdersTable } from "./components/HostOrdersTable";

interface HostOrder {
  _id: string;
  order_id?: string;
  status: string;
  totalPrice: number;
  cus_name?: string;
  cus_email?: string;
  tran_date?: string;
  transactionId?: string;
  card_type?: string;
  productTitle?: string | string[];
  productImage?: string | string[];
  brandName?: string | string[];
  hostIsApproved?: string;
  orderStatus?: string;
  trackingId?: string;
  payment_method?: string;
  currency?: string;
}

const HostOrders: React.FC = () => {
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState<HostOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Ship Order modal states
  const [shipOrder, setShipOrder] = useState<{ id: string; title: string } | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingError, setTrackingError] = useState("");
  const [isShipping, setIsShipping] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch payment history using email (received customer orders for host products)
  const {
    data: PaymentHistoryData = [],
    isLoading,
    refetch,
  } = useQuery<HostOrder[]>({
    queryKey: ["HostOrdersData", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/host-payment-history/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const handleApproveOrder = async (orderId: string, productTitle: string) => {
    try {
      const res = await axiosSecure.patch(`/orders/${orderId}/approve`);
      if (res.data.success) {
        refetch();
        setSelectedOrder((prev) =>
          prev && prev._id === orderId
            ? { ...prev, orderStatus: "processing", hostIsApproved: ApprovalStatus.APPROVED }
            : prev
        );
        toast.success(`${String(productTitle).slice(0, 20)} approved successfully!`);
      }
    } catch (error: any) {
      console.error("Failed to approve order:", error);
      toast.error(error?.response?.data?.message || "Failed to approve order. Please try again.");
    }
  };

  const handleShipOrder = (orderId: string, productTitle: string) => {
    setTrackingInput("");
    setTrackingError("");
    setShipOrder({ id: orderId, title: productTitle });
  };

  const confirmShipOrder = async () => {
    const trackingId = trackingInput.trim();
    if (!trackingId) {
      setTrackingError("You must enter tracking info to ship!");
      return;
    }
    if (!shipOrder) return;

    setIsShipping(true);
    try {
      const res = await axiosSecure.patch(`/orders/${shipOrder.id}/ship`, { tracking_id: trackingId });
      if (res.data.success) {
        refetch();
        setSelectedOrder((prev) =>
          prev && prev._id === shipOrder.id
            ? { ...prev, orderStatus: "shipped", trackingId: trackingId }
            : prev
        );
        setShipOrder(null);
        toast.success("Order items marked as Shipped.");
      }
    } catch (error: any) {
      console.error("Failed to ship order:", error);
      const message =
        error?.response?.data?.message || "Failed to mark as Shipped. Please try again.";
      toast.error(message);
    } finally {
      setIsShipping(false);
    }
  };

  const handleCancelOrder = async (orderId: string, productTitle: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to cancel the order for ${productTitle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "Keep Order",
      buttonsStyling: false,
      customClass: {
        popup: "swal-themed-popup",
        title: "swal-themed-title",
        htmlContainer: "swal-themed-text",
        confirmButton: "swal-themed-danger-confirm",
        cancelButton: "swal-themed-cancel",
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/orders/${orderId}/cancel`);
        if (res.data.success) {
          refetch();
          setSelectedOrder((prev) =>
            prev && prev._id === orderId
              ? { ...prev, orderStatus: "cancelled" }
              : prev
          );
          Swal.fire({
            icon: "success",
            title: "Cancelled!",
            text: "Order has been cancelled.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error: any) {
        console.error("Failed to cancel order:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message || "Failed to cancel order.",
        });
      }
    }
  };

  const filteredOrders = PaymentHistoryData.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      (order.cus_name && order.cus_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.transactionId && order.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (order.orderStatus || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesDate = !dateFilter || (order.tran_date && order.tran_date.startsWith(dateFilter));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalOrders = PaymentHistoryData.length;
  const approvedCount = PaymentHistoryData.filter(
    (o) => (o.orderStatus || "").toLowerCase() !== "pending" && (o.orderStatus || "").toLowerCase() !== "cancelled"
  ).length;
  const pendingCount = PaymentHistoryData.filter(
    (o) => (o.orderStatus || "").toLowerCase() === "pending"
  ).length;

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Received Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and approve customer orders placed for your products
        </p>
      </div>

      {/* Stats Summary */}
      <HostOrdersStats
        totalOrders={totalOrders}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
      />

      {PaymentHistoryData.length === 0 ? (
        <NoData />
      ) : (
        <div className="space-y-6">
          <HostOrdersFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-sm text-gray-400 font-semibold">No matching orders found.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition border border-orange-100"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <HostOrdersTable
                orders={paginatedOrders}
                onViewDetails={setSelectedOrder}
                onApprove={handleApproveOrder}
                onShip={handleShipOrder}
                onCancel={handleCancelOrder}
              />

              {/* Mobile Card View */}
              <HostOrdersCards
                orders={paginatedOrders}
                onViewDetails={setSelectedOrder}
                onApprove={handleApproveOrder}
                onShip={handleShipOrder}
                onCancel={handleCancelOrder}
              />

              {/* Pagination */}
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
                size={itemsPerPage}
                totalItems={filteredOrders.length}
              />
            </>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Order Details</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">Transaction summary</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                {/* Amount Hero */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      ৳{selectedOrder.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider bg-green-50 text-green-700 border-green-200">
                      Payment: Success
                    </span>
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${
                        (selectedOrder.orderStatus || "pending").toLowerCase() === "delivered"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : (selectedOrder.orderStatus || "pending").toLowerCase() === "cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : (selectedOrder.orderStatus || "pending").toLowerCase() === "shipped"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : (selectedOrder.orderStatus || "pending").toLowerCase() === "processing"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {selectedOrder.orderStatus || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Info</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Name</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedOrder.cus_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="text-sm font-semibold text-gray-700 break-all">{selectedOrder.cus_email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Info</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedOrder.tran_date
                          ? new Date(selectedOrder.tran_date).toLocaleString("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Method</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedOrder.card_type || selectedOrder.payment_method || "N/A"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Transaction ID</p>
                      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2">
                        <p className="font-mono text-xs font-bold text-orange-500 truncate">
                          {selectedOrder.transactionId || "N/A"}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.trackingId && (
                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Shipping Tracking info</p>
                        <div className="bg-blue-50/50 border border-blue-100 text-blue-800 rounded-xl px-3 py-2 text-xs font-semibold">
                          {selectedOrder.trackingId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products */}
                {selectedOrder.productTitle && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Products ({Array.isArray(selectedOrder.productTitle) ? selectedOrder.productTitle.length : 1})
                    </p>
                    <div className="space-y-2">
                      {(Array.isArray(selectedOrder.productTitle)
                        ? selectedOrder.productTitle
                        : [selectedOrder.productTitle]
                      ).map((title: string | undefined, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 p-3 rounded-xl transition-colors duration-150"
                        >
                          <img
                            src={selectedOrder.productImage?.[index] || ""}
                            alt={title || "Product"}
                            className="w-11 h-11 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-gray-900 truncate">
                              {title || "Unnamed Product"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                              Brand: {selectedOrder.brandName?.[index] || "No Brand"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
                {(selectedOrder.orderStatus || "pending").toLowerCase() === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const title = Array.isArray(selectedOrder.productTitle)
                          ? selectedOrder.productTitle[0]
                          : selectedOrder.productTitle || "";
                        handleApproveOrder(selectedOrder.order_id || selectedOrder._id, title);
                      }}
                      className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30"
                    >
                      Approve Order
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const title = Array.isArray(selectedOrder.productTitle)
                          ? selectedOrder.productTitle[0]
                          : selectedOrder.productTitle || "";
                        handleCancelOrder(selectedOrder.order_id || selectedOrder._id, title);
                      }}
                      className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-all duration-200 border border-red-200"
                    >
                      Cancel Order
                    </button>
                  </>
                )}

                {(selectedOrder.orderStatus || "pending").toLowerCase() === "processing" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const title = Array.isArray(selectedOrder.productTitle)
                          ? selectedOrder.productTitle[0]
                          : selectedOrder.productTitle || "";
                        handleShipOrder(selectedOrder.order_id || selectedOrder._id, title);
                      }}
                      className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30"
                    >
                      Ship Order
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const title = Array.isArray(selectedOrder.productTitle)
                          ? selectedOrder.productTitle[0]
                          : selectedOrder.productTitle || "";
                        handleCancelOrder(selectedOrder.order_id || selectedOrder._id, title);
                      }}
                      className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition-all duration-200 border border-red-200"
                    >
                      Cancel Order
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Ship Order Modal */}
      {shipOrder &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShipOrder(null)}
          >
            <div
              className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Ship Order</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5 max-w-[220px] truncate">
                      {shipOrder.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShipOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-3">
                <div>
                  <label
                    htmlFor="tracking-input"
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block"
                  >
                    Courier Name & Tracking ID
                  </label>
                  <input
                    id="tracking-input"
                    type="text"
                    value={trackingInput}
                    onChange={(e) => {
                      setTrackingInput(e.target.value);
                      if (trackingError) setTrackingError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmShipOrder();
                    }}
                    placeholder="e.g. Pathao Courier - TRK123456"
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  {trackingError ? (
                    <p className="text-xs font-semibold text-red-500 mt-1.5">{trackingError}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400 font-medium mt-1.5">
                      This tracking info will be visible to the customer.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShipOrder(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmShipOrder}
                  disabled={isShipping}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isShipping ? "Shipping..." : "Ship Order"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HostOrders;

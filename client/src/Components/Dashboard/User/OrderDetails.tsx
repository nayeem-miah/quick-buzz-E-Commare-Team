import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FiArrowLeft, FiRefreshCw, FiXCircle } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import DeleteConfirmModal from "../../../Shared/DeleteConfirmModal";

// Sub-components
import { OrderTimeline } from "./components/OrderTimeline";
import { OrderActivityLog } from "./components/OrderActivityLog";
import { ShippingDetailsCard } from "./components/ShippingDetailsCard";
import { ItemsOrderedCard } from "./components/ItemsOrderedCard";
import { PaymentDetailsCard } from "./components/PaymentDetailsCard";
import { BillingSummaryCard } from "./components/BillingSummaryCard";

// Types & Enums
import { Order, OrderItem, OrderStatusHistory, Payment } from "../../../types/order";
import { OrderStatus } from "../../../constants/enums";

interface OrderInfoResponse {
  order: Order;
  items: OrderItem[];
  payment: Payment | null;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch single order details
  const { data: orderInfo, isLoading, refetch } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });

  // Fetch order status history (activity log)
  const { data: history = [] } = useQuery<OrderStatusHistory[]>({
    queryKey: ["orderHistory", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${id}/history`);
      return res.data.data;
    },
    enabled: !!id
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case OrderStatus.PROCESSING:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case OrderStatus.SHIPPED:
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case OrderStatus.DELIVERED:
        return "bg-green-50 text-green-700 border-green-200";
      case OrderStatus.CANCELLED:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const handleCancelOrder = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    setIsCancelling(true);
    try {
      await axiosPublic.patch(`/orders/${id}/cancel`);
      toast.success("Your order has been cancelled successfully.");
      refetch();
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      for (const item of items) {
        await axiosPublic.post("/cart", {
          email: user?.email,
          product_id: item.product_id,
          quantity: item.quantity
        });
      }
      toast.success("Items added to your cart!");
      navigate("/dashboard/my-listings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reorder items. Please try again.");
    } finally {
      setIsReordering(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!orderInfo || !orderInfo.order) {
    return <div className="p-8 text-center text-red-500">Order not found.</div>;
  }

  const { order, items = [], payment } = orderInfo as OrderInfoResponse;

  // Subtotal and discount math
  const subtotal = items.reduce(
    (total: number, item: OrderItem) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = items.reduce(
    (total: number, item: OrderItem) =>
      total + (item.price || 0) * ((item.discount || 0) / 100) * (item.quantity || 1),
    0
  );

  // Timeline Steps
  const steps = [
    { label: "Placed", status: OrderStatus.PENDING },
    { label: "Processing", status: OrderStatus.PROCESSING },
    { label: "Shipped", status: OrderStatus.SHIPPED },
    { label: "Delivered", status: OrderStatus.DELIVERED }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return 0;
      case OrderStatus.PROCESSING: return 1;
      case OrderStatus.SHIPPED: return 2;
      case OrderStatus.DELIVERED: return 3;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      <Helmet>
        <title>Order Details #{id} | QuickBuzz</title>
      </Helmet>

      {/* Back button */}
      <div>
        <Link
          to="/dashboard/my-orders"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition font-semibold"
        >
          <FiArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
            Order <span className="text-orange-500">#{order._id.substring(order._id.length - 8)}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {formatDate(order.date)} at {formatTime(order.date)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full border uppercase tracking-wider ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
          {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PROCESSING) && (
            <button
              onClick={handleCancelOrder}
              className="px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100 flex items-center gap-1.5 shadow-sm shadow-red-500/5"
            >
              <FiXCircle size={14} /> Cancel Order
            </button>
          )}
          <button
            onClick={handleReorder}
            disabled={isReordering}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/10 disabled:bg-orange-300"
          >
            <FiRefreshCw size={14} className={isReordering ? "animate-spin" : ""} /> Reorder
          </button>
        </div>
      </div>

      {/* Status Timeline */}
      <OrderTimeline
        status={order.status}
        steps={steps}
        currentStep={currentStep}
      />

      {/* Activity Log */}
      <OrderActivityLog
        email={order.email}
        date={order.date}
        history={history}
        formatDate={formatDate}
        formatTime={formatTime}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Address and Ordered items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <ShippingDetailsCard shippingAddress={order.shipping_address} />

          {/* Ordered items */}
          <ItemsOrderedCard items={items} />
        </div>

        {/* Right Column: Payment Details and Billing Summary */}
        <div className="space-y-6">
          {/* Payment Details */}
          <PaymentDetailsCard
            paymentMethod={order.payment_method}
            payment={payment}
            formatDate={formatDate}
            formatTime={formatTime}
          />

          {/* Pricing calculations summary */}
          <BillingSummaryCard
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            totalAmount={order.total_amount || 0}
          />
        </div>
      </div>

      {/* Confirm cancel modal */}
      <DeleteConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, cancel it!"
        itemName={`Order ID: ${id}`}
        isDeleting={isCancelling}
        loadingText="Cancelling..."
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={confirmCancelOrder}
      />
    </div>
  );
};

export default OrderDetails;

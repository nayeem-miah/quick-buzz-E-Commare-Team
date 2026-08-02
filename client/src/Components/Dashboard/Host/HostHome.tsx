import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";
import { ApprovalStatus, PaymentMethod, PaymentStatus } from "../../../constants/enums";
import HostDashboardHeader from "./hosthome/HostDashboardHeader";
import HostOrderModal from "./hosthome/HostOrderModal";
import HostProductStatus from "./hosthome/HostProductStatus";
import HostRecentOrders from "./hosthome/HostRecentOrders";
import HostSalesChart from "./hosthome/HostSalesChart";
import HostStatsGrid from "./hosthome/HostStatsGrid";
import { HostPayment, HostProduct } from "./hosthome/types";

const HostHome: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");
  const [selectedOrder, setSelectedOrder] = useState<HostPayment | null>(null);


  const {
    data: PaymentHistoryData = [],
    isLoading: isPaymentLoading,
    refetch: refetchPayments,
  } = useQuery<HostPayment[]>({
    queryKey: ["PaymentHistoryData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/payments/host-payment-history/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  const { data: productsData = [], isLoading: isProductsLoading } = useQuery<HostProduct[]>({
    queryKey: ["allProduct", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/host-product/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });


  // Online (success) + COD (processing/shipped/delivered)
  const successfulPayments = PaymentHistoryData.filter((item: HostPayment) => {
    if (item.status === PaymentStatus.SUCCESS) return true;
    if (item.payment_method === PaymentMethod.COD) {
      return ["processing", "shipped", "delivered"].includes(item.orderStatus || "");
    }
    return false;
  });

  const totalAmount = successfulPayments.reduce(
    (sum: number, item: HostPayment) => sum + item.totalPrice,
    0
  );

  const approvedCount  = productsData.filter((p) => p.adminIsApproved === ApprovalStatus.APPROVED).length;
  const pendingCount   = productsData.filter((p) => p.adminIsApproved === ApprovalStatus.PENDING).length;
  const rejectedCount  = productsData.filter((p) => p.adminIsApproved === ApprovalStatus.REJECTED).length;

  // Sales chart data
  const getChartData = () => {
    let referenceDate = new Date();
    const withDates = successfulPayments.filter((p: HostPayment) => p.tran_date);
    if (withDates.length > 0) {
      referenceDate = new Date(Math.max(...withDates.map((p: HostPayment) => new Date(p.tran_date!).getTime())));
    }
    const days = timeRange === "7days" ? 7 : 30;
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(referenceDate);
      d.setDate(referenceDate.getDate() - (days - 1 - i));
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const daySales = withDates
        .filter((p: HostPayment) => new Date(p.tran_date!).toDateString() === d.toDateString())
        .reduce((sum: number, p: HostPayment) => sum + p.totalPrice, 0);
      return { date: label, Sales: daySales };
    });
  };

  // Recent 5 orders (sorted newest first)
  const recentOrders = [...successfulPayments]
    .sort((a, b) => {
      const ta = a.tran_date ? new Date(a.tran_date).getTime() : 0;
      const tb = b.tran_date ? new Date(b.tran_date).getTime() : 0;
      return tb - ta;
    })
    .slice(0, 5);


  const handleApproveOrder = async (orderId: string, productTitle: string) => {
    try {
      const res = await axiosPublic.patch(`/products/host-manage-product/${orderId}`);
      if (res.data.data.modifiedCount > 0) {
        refetchPayments();
        setSelectedOrder((prev) =>
          prev ? { ...prev, hostIsApproved: ApprovalStatus.APPROVED } : null
        );
        toast.success(`"${String(productTitle).slice(0, 25)}" approved!`, {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Failed to approve order:", error);
      toast.error("Failed to approve order. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  };



  if (isPaymentLoading || isProductsLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8">

      <HostDashboardHeader displayName={user?.displayName} />

      <HostStatsGrid
        totalAmount={totalAmount}
        totalProducts={productsData.length}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
        totalOrders={successfulPayments.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HostSalesChart
          chartData={getChartData()}
          hasData={successfulPayments.length > 0}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <HostProductStatus
          totalProducts={productsData.length}
          approvedCount={approvedCount}
          pendingCount={pendingCount}
          rejectedCount={rejectedCount}
        />
      </div>

      <HostRecentOrders
        orders={recentOrders}
        onView={setSelectedOrder}
        onApprove={handleApproveOrder}
      />

      {selectedOrder && (
        <HostOrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onApprove={handleApproveOrder}
        />
      )}
    </div>
  );
};

export default HostHome;

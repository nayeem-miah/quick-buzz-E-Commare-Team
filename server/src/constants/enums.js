const OrderStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

const PaymentStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed"
};

const ApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approve",
  REJECTED: "rejected"
};

const UserRole = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller"
};

const PaymentMethod = {
  COD: "Cash on Delivery",
  ONLINE: "SSLCommerz",
  CARD: "Card"
};

module.exports = {
  OrderStatus,
  PaymentStatus,
  ApprovalStatus,
  UserRole,
  PaymentMethod
};

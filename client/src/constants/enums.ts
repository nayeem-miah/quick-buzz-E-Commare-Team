export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approve",
  REJECTED = "rejected"
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SELLER = "seller"
}

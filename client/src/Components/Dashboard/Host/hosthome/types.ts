export interface HostPayment {
  _id: string;
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
  payment_method?: string;
  orderStatus?: string;
}

export interface HostProduct {
  _id: string;
  adminIsApproved: string;
}

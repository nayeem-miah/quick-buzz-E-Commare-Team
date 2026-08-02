export interface PaymentHistory {
  date?: string | number | Date;
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
  payment_method?: string;
  _id?: string;
  amount?: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  _id: string;
  email: string;
  total_amount: number;
  status: string;
  shipping_address: ShippingAddress;
  payment_method: string;
  date: string;
}

export interface OrderItem {
  _id: string;
  order_id: string;
  product_id: string;
  productTitle: string;
  productImage: string;
  brandName?: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Payment {
  _id: string;
  order_id: string;
  cus_name: string;
  cus_email: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_id?: string;
  date: string;
}

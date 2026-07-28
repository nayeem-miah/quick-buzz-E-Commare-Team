export interface Listing {
  _id: number;
  productTitle: string;
  productImage: string;
  adminIsApproved: string;
  hostPhoto: string;
  hostName: string;
  hostEmail: string;
  brandName: string;
  category: string;
  price: number;
  tags: string;
  description: string;
  discount?: number;
  createdAt?: string;
  quantity?: number;
}

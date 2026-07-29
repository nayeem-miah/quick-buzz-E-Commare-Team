/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/UseAuth";
import useAxiosPublic from "../../Hooks/UsePublic";
import LoadingSpinner from "../../Shared/Loading";
import { ShippingAddressForm } from "./components/ShippingAddressForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { OrderSummarySidebar } from "./components/OrderSummarySidebar";
import { ShippingAddress } from "../../types/order";

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => {
    const saved = localStorage.getItem("quickbuzz_shipping_address");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing shipping address:", e);
      }
    }
    return {
      name: user?.displayName || "",
      phone: "",
      address: "",
      city: ""
    };
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("Cash on Delivery");

  const { data: cartItems = [], isLoading } = useQuery<CheckoutItem[]>({
    queryKey: ["cart", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cart/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email
  });

  const subtotal = cartItems.reduce(
    (total: number, item: CheckoutItem) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const discount = cartItems.reduce(
    (total: number, item: CheckoutItem) =>
      total + (item.price || 0) * ((item.discount || 0) / 100) * (item.quantity || 1),
    0
  );

  const totalPrice = subtotal - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      toast.error("Please fill in all shipping details");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      email: user?.email,
      items: cartItems.map((item: CheckoutItem & { product_id?: string }) => ({
        product_id: item.product_id || item._id,
        productTitle: item.productTitle,
        productImage: item.productImage,
        brandName: item.brandName,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount
      })),
      total_amount: totalPrice,
      shipping_address: shippingAddress,
      payment_method: paymentMethod
    };

    try {
      const res = await axiosPublic.post("/orders", orderPayload);
      if (res.data.success) {
        toast.success(res.data.message);

        const { paymentUrl } = res.data.data;
        if (paymentUrl) {
          window.location.replace(paymentUrl);
        } else {
          navigate("/success");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>Checkout | QuickBuzz</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-950">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Complete your shipping and payment details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <ShippingAddressForm
            shippingAddress={shippingAddress}
            handleInputChange={handleInputChange}
          />
          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <OrderSummarySidebar
          cartItems={cartItems}
          subtotal={subtotal}
          discount={discount}
          totalPrice={totalPrice}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Checkout;

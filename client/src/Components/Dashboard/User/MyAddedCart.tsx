/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever, MdLocalGroceryStore } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";

const MyAddedCart: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Local quantity state
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Query data
  const {
    data: allsave = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allsave"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cart/${user?.email}`);
      return res.data.data;
    },
  });

  const getQuantity = (id: string) => {
    const item = allsave.find((i: any) => i._id === id);
    return quantities[id] !== undefined ? quantities[id] : (item?.quantity || 1);
  };

  const updateQuantity = async (id: string, amount: number) => {
    const item = allsave.find((i: any) => i._id === id);
    if (!item) return;

    const currentQty = getQuantity(id);
    const nextQty = Math.max(1, currentQty + amount);

    // Optimistically update local state first
    setQuantities((prev) => ({ ...prev, [id]: nextQty }));

    try {
      await axiosPublic.patch(`/cart/${id}`, { quantity: nextQty });
      refetch();
    } catch (err) {
      console.error("Failed to update cart quantity", err);
      toast.error("Failed to update quantity");
      // Revert local state
      setQuantities((prev) => ({ ...prev, [id]: currentQty }));
    }
  };

  // Subtotal & Discount calculations
  const subtotal = allsave.reduce(
    (total: number, save: any) => total + (save.price || 0) * getQuantity(save._id),
    0
  );

  const discount = allsave.reduce(
    (total: number, save: any) =>
      total +
      (save.price || 0) *
        ((save.discount || 0) / 100) *
        getQuantity(save._id),
    0
  );

  const totalPrice = subtotal - discount;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  /* My added product is deleted */
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/cart/${id}`)
          .then(() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ["allsave"] });
            Swal.fire({
              title: "Deleted!",
              text: "Your cart item has been deleted.",
              icon: "success",
              confirmButtonColor: "#f97316",
            });
          })
          .catch((error) => {
            console.error("Delete error:", error.response?.data || error.message);
            Swal.fire({
              title: "Error",
              text: "Failed to delete the item. Please check your connection or try again.",
              icon: "error",
            });
          });
      }
    });
  };

  // Render Empty State
  const renderEmptyCart = () => (
    <div className="max-w-md mx-auto text-center py-16 space-y-6 animate-fadeIn">
      <div className="w-20 h-20 bg-orange-50 rounded-full mx-auto flex items-center justify-center text-orange-500">
        <MdLocalGroceryStore size={36} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-950">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          Looks like you haven't added anything to your cart yet. Go ahead and explore our awesome products!
        </p>
      </div>
      <Link to="/product" className="inline-block pt-2">
        <button className="px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 font-semibold rounded-xl transition duration-300 shadow-md shadow-orange-500/10">
          Continue Shopping
        </button>
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {allsave?.length === 0 ? (
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900">My Cart</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and checkout your items</p>
          </div>
          {renderEmptyCart()}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-extrabold text-gray-900">My Cart</h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {allsave?.length} item{allsave?.length > 1 ? "s" : ""} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {allsave.map((save: any) => {
                const qty = getQuantity(save._id);
                return (
                  <div
                    key={save._id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-orange-100 transition duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                      <img
                        src={save?.productImage}
                        alt={save?.productTitle}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                      />
                      <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-sm font-bold text-gray-950 line-clamp-1">
                          {save?.productTitle}
                        </h3>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          Brand: <span className="font-bold text-gray-700">{save?.brandName || "Unknown"}</span>
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <span className="text-sm font-bold text-orange-500">
                            ${(save?.price * (1 - (save?.discount || 0) / 100)).toFixed(2)}
                          </span>
                          {save?.discount > 0 && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ${save?.price}
                              </span>
                              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {save?.discount}% Off
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-50">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                        <button
                          onClick={() => updateQuantity(save._id, -1)}
                          className="px-3 py-1.5 hover:bg-gray-100 text-gray-500 font-bold transition text-xs"
                        >
                          –
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(save._id, 1)}
                          className="px-3 py-1.5 hover:bg-gray-100 text-gray-500 font-bold transition text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(save?._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Remove Item"
                        >
                          <MdDeleteForever size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-bold text-gray-950 pb-2 border-b border-gray-50">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span className="font-semibold text-red-500">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <hr className="border-gray-50 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="text-xl font-black text-orange-500">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full">
                <button
                  className="w-full py-3.5 text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition duration-300 font-semibold shadow-md shadow-orange-500/10 flex items-center justify-center"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedCart;

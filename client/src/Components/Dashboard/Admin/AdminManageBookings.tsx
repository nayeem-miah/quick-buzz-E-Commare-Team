import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import LoadingSpinner from "../../../Shared/Loading";
import { Listing } from "../../../types/listing.type";

import { ManageBookingsCards } from "./components/ManageBookingsCards";
import { ManageBookingsFilters } from "./components/ManageBookingsFilters";
import { ManageBookingsHeader } from "./components/ManageBookingsHeader";
import { ManageBookingsTable } from "./components/ManageBookingsTable";
import { ProductDetailsModal } from "./components/ProductDetailsModal";
import Pagination from "../../../Shared/Pagination/Pagination";
import DeleteConfirmModal from "../../../Shared/DeleteConfirmModal";

interface Category {
  _id?: string;
  name: string;
}

interface ProductDeleteTarget {
  id: string | number;
  productTitle: string;
}

const AdminManageBookings: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Listing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductDeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const axiosSecure = UseAxiosSecure();
  const [params] = useSearchParams();

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(params.get("category") || "all");

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter]);

  /* Fetch products with pagination, search, and filters */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", categoryFilter, statusFilter, debouncedSearch, page],
    queryFn: async () => {
      const res = await axiosSecure.get("/products", {
        params: {
          category: categoryFilter,
          status: statusFilter,
          search: debouncedSearch,
          page,
          size,
        },
      });
      return res.data;
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data;
    },
  });

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categoryData?.data?.map((cat: Category) => ({ value: cat.name, label: cat.name })) || []),
  ];

  const products: Listing[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  // handle delete
  const handleDelete = (id: string | number) => {
    const product = products.find((item) => String(item._id) === String(id)) || null;
    setDeleteTarget({ id, productTitle: product?.productTitle || "Selected product" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await axiosSecure.delete(`/products/${deleteTarget.id}`);
      if (res.data.data.deletedCount > 0) {
        await refetch();
        toast.success("Product has been deleted.");
        setDeleteTarget(null);
      } else {
        toast.error("Product could not be deleted.");
      }
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (product: Listing, status: string) => {
    axiosSecure.patch(`/products/admin-product/${product._id}`, { status }).then((res) => {
      if (res.data.data.modifiedCount > 0) {
        refetch();
        toast.success(`Product marked as ${status}!`);

        // update modal state if open
        if (selectedBooking && selectedBooking._id === product._id) {
          setSelectedBooking({ ...selectedBooking, adminIsApproved: status });
        }
      }
    });
  };

  const handleDetailsClick = (listing: Listing) => {
    setSelectedBooking(listing);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-6">
        <ManageBookingsHeader />

        {/* Filters and Search Bar */}
        <ManageBookingsFilters
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categoryOptions={categoryOptions}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <LoadingSpinner smallHeight={true} />
          ) : products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mb-4">
                <FiSearch size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-gray-500 max-w-sm mt-2 text-sm">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-6 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <ManageBookingsTable
                products={products}
                onStatusChange={handleStatusChange}
                onDetailsClick={handleDetailsClick}
                onDelete={handleDelete}
              />

              {/* Mobile Card View */}
              <ManageBookingsCards
                products={products}
                onStatusChange={handleStatusChange}
                onDetailsClick={handleDetailsClick}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                size={size}
                totalItems={data?.meta?.total || 0}
              />
            </>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedBooking && (
        <ProductDetailsModal
          selectedBooking={selectedBooking}
          onClose={closeModal}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.productTitle}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminManageBookings;

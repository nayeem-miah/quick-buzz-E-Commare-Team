import toast from "react-hot-toast";
import Heading from "../../../../Shared/Heading/Heading";
import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../../Hooks/UseAuth";
import useAxiosPublic from "../../../../Hooks/UsePublic";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImSpinner } from "react-icons/im";
import { Category } from "../../../../types/category.type";

const UpdateProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  //   every single get data
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/products/${id}`);
      return data.data;
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/categories");
      return res.data;
    },
  });
  const categories = categoryData?.data || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    // Extracting values for all required fields
    const productTitle = (
      form.elements.namedItem("productTitle") as HTMLInputElement
    ).value;
    const brandName = (form.elements.namedItem("brandName") as HTMLInputElement)
      .value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const discount = (form.elements.namedItem("discount") as HTMLInputElement)
      .value;
    const tags = (form.elements.namedItem("tags") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      .value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const imageFile = (
      form.elements.namedItem("productImage") as HTMLInputElement
    ).files?.[0];

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setLoading(true); // Set loading to true at the start of the submission process
      // Upload image
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      const imageUrl = data.data.display_url;
      const productData = {
        productTitle,
        brandName,
        price,
        discount,
        tags,
        category,
        description,
        productImage: imageUrl,
        hostEmail: user?.email,
        hostName: user?.displayName,
        hostPhoto: user?.photoURL,
        adminIsApproved: product.adminIsApproved,
      };

      await axiosPublic
        .patch(`/products/${product._id}`, productData)
        .then((res) => {
          if (res.data.data.modifiedCount > 0) {
            toast.success("Product updated  successfully");
            form.reset();
            navigate("/dashboard/my-host-listings");
          }
        });
    } catch (err) {
      console.error("Product addition failed:", err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="max-w-4xl p-6 mx-auto my-10 bg-white rounded-md shadow-md">
        <Heading title={"update Product"} subtitle={""} />

        <form onSubmit={handleEdit} className="mt-4 space-y-4">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium" htmlFor="productTitle">
              Product Title
            </label>
            <input
              id="productTitle"
              name="productTitle"
              type="text"
              defaultValue={product?.productTitle}
              placeholder="Enter product title"
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium" htmlFor="brandName">
              Brand Name
            </label>
            <input
              id="brandName"
              name="brandName"
              type="text"
              placeholder="Enter brand name"
              defaultValue={product?.brandName}
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium" htmlFor="price">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              defaultValue={product?.price}
              placeholder="Enter product price"
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium" htmlFor="discount">
              Discount (%)
            </label>
            <input
              id="discount"
              name="discount"
              type="number"
              defaultValue={product?.discount}
              placeholder="Enter discount percentage"
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium" htmlFor="tags">
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              defaultValue={product?.tags}
              placeholder="Enter tags"
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category}
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat: Category) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Enter product description"
              defaultValue={product?.description}
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
              required
            ></textarea>
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium" htmlFor="productImage">
              Product Image
            </label>
            <input
              id="productImage"
              name="productImage"
              type="file"
              accept="image/*"
              className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className={`w-full text-black shadow-lg py-2 relative ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 hover:bg-blue-700"
                } rounded-md transition-all duration-300 `}
            >
              {loading ? (
                <ImSpinner
                  size={20}
                  className="animate-spin mx-auto "
                ></ImSpinner>
              ) : (
                "update Product"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdateProduct;

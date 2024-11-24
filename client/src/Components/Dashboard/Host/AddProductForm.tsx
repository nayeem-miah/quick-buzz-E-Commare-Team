import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import useAuth from "../../../Hooks/UseAuth";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";

interface FormState {
  productTitle: string;
  brandName: string;
  price: number | string;
  discount: number | string;
  category: string;
  stockQuantity: number | string;
  sku: string;
  tags: string;
  description: string;
  productImage: File | null;
  hostEmail: string | any;
  hostName: string | any;
  hostPhoto: string | any;
}

const AddProductForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
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
      setLoading(true);
      // Upload image
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
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
        adminIsApproved: "pending",
      };
      // console.log(productData);
      // console.log(imageUrl);

      await axiosPublic.post("/product", productData).then((res) => {
        // console.log(res);
        if (res.data.insertedId) {
          toast.success("product added successfully")
          form.reset();
          navigate("/dashboard/my-host-listings");
        }
      });
    } catch (err: any) {
      console.log("product added failed!!!", err);
      toast.error(err);
    }
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <Heading title={"Add New Product"} subtitle={""} />

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-medium" htmlFor="productTitle">
            Product Title
          </label>
          <input
            id="productTitle"
            name="productTitle"
            type="text"
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
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select category</option>
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="penDrive">PenDrive</option>
            <option value="caves">Caves</option>
            <option value="earphones">Earphones</option>
            <option value="cable">Cable</option>
            <option value="mouse">Mouse</option>
            <option value="keyboard">Keyboard</option>
            <option value="tshirt">Tshirt</option>
            <option value="sunGlass">SunGlass</option>
            <option value="light">Light</option>
            <option value="speaker">Speaker</option>
            <option value="stand">Stand</option>
            <option value="airpode">Airpode</option>
            <option value="charger">Charger</option>
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
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            type="submit"
            className="w-full text-black shadow-lg py-2 relative disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            {loading ? "loading..." : "Add Product"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProductForm;

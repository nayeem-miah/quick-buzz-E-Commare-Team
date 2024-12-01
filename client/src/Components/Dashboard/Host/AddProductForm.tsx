import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import useAuth from "../../../Hooks/UseAuth";
import toast from "react-hot-toast";
import axios from "axios";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";
import { ImSpinner } from "react-icons/im";
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
      setLoading(true); // Set loading to true at the start of the submission process
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

      await axiosPublic.post("/product", productData).then((res) => {
        if (res.data.insertedId) {
          toast.success("Product added successfully");
          form.reset();
          navigate("/dashboard/my-host-listings");
        }
      });
    } catch (err: any) {
      console.error("Product addition failed:", err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false); // Reset loading to false once the process completes
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
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="PenDrive">PenDrive</option>
            <option value="Caves">Caves</option>
            <option value="Earphones">Earphones</option>
            <option value="Cable">Cable</option>
            <option value="Mouse">Mouse</option>
            <option value="Keyboard">Keyboard</option>
            <option value="Tshirt">Tshirt</option>
            <option value="SunGlass">SunGlass</option>
            <option value="Light">Light</option>
            <option value="Speaker">Speaker</option>
            <option value="Stand">Stand</option>
            <option value="Airpode">Airpode</option>
            <option value="Charger">Charger</option>
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
            className={`w-full text-white font-bold  shadow-lg py-2 relative ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-indigo-600"
            } rounded-md transition-all duration-500 ease-in-out border-2 border-transparent`}
          >
            {loading ? (
              <ImSpinner
                size={20}
                className="animate-spin mx-auto "
              ></ImSpinner>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProductForm;

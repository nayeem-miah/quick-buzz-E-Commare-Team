import React, { useState } from "react";
import Heading from "../../../Shared/Heading/Heading";
import useAuth from "../../../Hooks/UseAuth";

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
  // console.log(user);
  // console.clear();
  const [formState, setFormState] = useState<FormState>({
    productTitle: "",
    brandName: "",
    price: "",
    discount: "",
    category: "",
    stockQuantity: "",
    sku: "",
    tags: "",
    description: "",
    productImage: null,
    hostEmail: user?.email,
    hostName: user?.displayName,
    hostPhoto: user?.photoURL,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target;

    // Handle file inputs
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      console.log(fileInput);
      setFormState((prev) => ({
        ...prev,
        [id]: fileInput.files?.[0] || null,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [id]: value,
      }));
    }

    // Clear errors when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!formState.productTitle)
      newErrors.productTitle = "Product title is required.";
    if (!formState.price) newErrors.price = "Price is required.";
    if (!formState.category) newErrors.category = "Category is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Form submitted:", formState);
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
            type="text"
            placeholder="Enter product title"
            className={`block w-full px-4 py-2 mt-2 bg-white border ${
              errors.productTitle ? "border-red-500" : "border-gray-200"
            } rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.productTitle}
            onChange={handleChange}
            required
          />
          {errors.productTitle && (
            <p className="mt-1 text-sm text-red-500">{errors.productTitle}</p>
          )}
        </div>

        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium" htmlFor="brandName">
            Brand Name
          </label>
          <input
            id="brandName"
            type="text"
            placeholder="Enter brand name"
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={formState.brandName}
            onChange={handleChange}
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
            type="number"
            placeholder="Enter product price"
            className={`block w-full px-4 py-2 mt-2 bg-white border ${
              errors.price ? "border-red-500" : "border-gray-200"
            } rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.price}
            onChange={handleChange}
            required
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium" htmlFor="discount">
            Discount (%)
          </label>
          <input
            id="discount"
            type="number"
            placeholder="Enter discount percentage"
            className={`block w-full px-4 py-2 mt-2 bg-white border ${
              errors.discount ? "border-red-500" : "border-gray-200"
            } rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.discount}
            onChange={handleChange}
            required
          />
          {errors.discount && (
            <p className="mt-1 text-sm text-red-500">{errors.discount}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium" htmlFor="tags">
            Tags (Comma separated)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="Enter tags"
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={formState.tags}
            onChange={handleChange}
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
            className={`block w-full px-4 py-2 mt-2 bg-white border ${
              errors.category ? "border-red-500" : "border-gray-200"
            } rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300`}
            value={formState.category}
            onChange={handleChange}
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
            <option value="keyboard">keyboard</option>
            <option value="tshirt">Tshirt</option>
            <option value="sunGlass">SunGlass</option>
            <option value="light">Light</option>
            <option value="speaker">Speaker</option>
            <option value="stand">Stand</option>
            <option value="airpode">Airpode</option>
            <option value="charger">Charger</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Enter product description"
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-300"
            value={formState.description}
            onChange={handleChange}
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
            type="file"
            accept="image/*"
            required
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full text-black shadow-lg py-2 relative bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
            border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
          >
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProductForm;
